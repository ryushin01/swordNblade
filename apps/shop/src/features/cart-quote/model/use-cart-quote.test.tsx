import { screen, waitFor } from '@testing-library/react';

import { createMockServer } from '@snb/mocks/node';

import { useCartStore } from '@/entities/cart';
import { renderWithProviders } from '@/shared/lib/test';

import { useCartQuote } from './use-cart-quote';

function Probe() {
  const quote = useCartQuote();
  if (quote.status !== 'ready') return <p>{quote.status}</p>;
  return (
    <p>
      {`ready ${quote.items.length} ${quote.items.map(({ sword }) => sword.id).join(',')} ${quote.estimate.totals.total > 0}`}
    </p>
  );
}

const { server, db } = createMockServer();
let restoreFetch: () => void = () => {};

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
  const mockedFetch = globalThis.fetch;
  globalThis.fetch = (input, init) =>
    mockedFetch(typeof input === 'string' && input.startsWith('/') ? `http://localhost${input}` : input, init);
  restoreFetch = () => {
    globalThis.fetch = mockedFetch;
  };
});
afterEach(() => {
  server.resetHandlers();
  db.reset();
  useCartStore.setState({ lines: [], destination: 'KR' });
});
afterAll(() => {
  restoreFetch();
  server.close();
});

describe('useCartQuote', () => {
  it('장바구니 품목을 상품 정보와 합쳐 금액을 계산하고, 목록에 없는 상품은 뺀다', async () => {
    useCartStore.setState({
      lines: [
        { swordId: 'sw-001', quantity: 2 },
        { swordId: 'sold-out-and-removed', quantity: 1 },
      ],
      destination: 'KR',
    });
    renderWithProviders(<Probe />);
    await waitFor(() => expect(screen.getByText(/^ready/)).toHaveTextContent('ready 1 sw-001 true'));
  });

  it('할인 중인 도검은 할인가로 계산한다', async () => {
    db.write((state) => ({
      ...state,
      swords: state.swords.map((sword) => (sword.id === 'sw-003' ? { ...sword, discount: { rate: 20 } } : sword)),
    }));
    useCartStore.setState({ lines: [{ swordId: 'sw-003', quantity: 2 }], destination: 'KR' });
    function PriceProbe() {
      const quote = useCartQuote();
      if (quote.status !== 'ready') return <p>{quote.status}</p>;
      const [item] = quote.items;
      return <p>{`ready ${item?.pricing.price} ${item?.pricing.listPrice} ${quote.estimate.totals.goods}`}</p>;
    }
    renderWithProviders(<PriceProbe />);
    await waitFor(() => expect(screen.getByText(/^ready/)).toHaveTextContent('ready 7840000 9800000 15680000'));
  });

  it('저장된 배송 국가가 관세 표에 없으면(깨진 저장값) 멈추지 않고 대한민국으로 계산한다', async () => {
    useCartStore.setState({ lines: [{ swordId: 'sw-001', quantity: 1 }], destination: 'ZZ' as never });
    function DestinationProbe() {
      const quote = useCartQuote();
      return <p>{quote.status === 'ready' ? `ready ${quote.destination}` : quote.status}</p>;
    }
    renderWithProviders(<DestinationProbe />);
    await waitFor(() => expect(screen.getByText(/^ready/)).toHaveTextContent('ready KR'));
  });

  it('담은 뒤 품절되거나 재고가 줄면 줄마다 알리고 주문을 막는다', async () => {
    db.write((state) => ({
      ...state,
      swords: state.swords.map((sword) =>
        sword.id === 'sw-001' ? { ...sword, stock: 0 } : sword.id === 'sw-002' ? { ...sword, stock: 2 } : sword,
      ),
    }));
    useCartStore.setState({
      lines: [
        { swordId: 'sw-001', quantity: 1 },
        { swordId: 'sw-002', quantity: 3 },
        { swordId: 'sw-003', quantity: 1 },
      ],
      destination: 'KR',
    });
    function StockProbe() {
      const quote = useCartQuote();
      if (quote.status !== 'ready') return <p>{quote.status}</p>;
      const issues = quote.items.map(({ sword, stockIssue }) =>
        stockIssue
          ? `${sword.id}:${stockIssue.kind}${stockIssue.kind === 'short' ? stockIssue.stock : ''}`
          : `${sword.id}:ok`,
      );
      return <p>{`ready ${issues.join(' ')} blocked=${quote.blocked}`}</p>;
    }
    renderWithProviders(<StockProbe />);
    await waitFor(() =>
      expect(screen.getByText(/^ready/)).toHaveTextContent(
        'ready sw-001:sold-out sw-002:short2 sw-003:ok blocked=true',
      ),
    );
  });

  it('비어 있으면 품목 없이 준비된다', async () => {
    renderWithProviders(<Probe />);
    await waitFor(() => expect(screen.getByText(/^ready/)).toHaveTextContent('ready 0 false'));
  });
});
