import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createMockServer } from '@snb/mocks/node';

import { renderWithProviders } from '@/shared/lib/test';

import { OrderLookupForm } from './order-lookup-form';

import type { Order } from '@snb/domain';

const push = vi.hoisted(() => vi.fn());
vi.mock('@/shared/i18n', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/i18n')>()),
  useRouter: () => ({ push, replace: vi.fn(), prefetch: vi.fn(), back: vi.fn(), refresh: vi.fn() }),
}));

const { server, db } = createMockServer();
let restoreFetch: () => void = () => {};

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
  // jsdom의 fetch는 상대 경로를 해석하지 못하므로, MSW가 감싼 fetch 앞에 기준 주소를 붙입니다.
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
  localStorage.clear();
  // 주문번호가 테스트마다 같아지므로(db.reset) 앞 테스트의 이동 기록을 지웁니다.
  push.mockClear();
});
afterAll(() => {
  restoreFetch();
  server.close();
});

async function placeGuestOrder(): Promise<Order> {
  const response = await fetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      destination: 'KR',
      customer: {
        name: '김가상',
        email: 'guest@example.com',
        phone: '010-1234-5678',
        postalCode: '04524',
        address: '서울 중구 세종대로 110',
      },
      lines: [{ swordId: 'sw-004', quantity: 1 }],
      paymentMethod: 'card',
      permitConfirmed: true,
    }),
  });
  return (await response.json()) as Order;
}

describe('OrderLookupForm', () => {
  it('비운 칸을 오류 요약에 모으고 초점을 옮긴다', async () => {
    const user = userEvent.setup();
    renderWithProviders(<OrderLookupForm />);
    await user.click(screen.getByRole('button', { name: '주문 찾기' }));
    const alert = await screen.findByRole('alert');
    await waitFor(() => expect(alert).toHaveFocus());
    expect(screen.getByRole('link', { name: '주문번호: 주문번호를 입력해 주세요.' })).toHaveAttribute(
      'href',
      '#lookup-id',
    );
    expect(screen.getByRole('textbox', { name: /^이메일/ })).toHaveAttribute('aria-invalid', 'true');
  });

  it('고쳐서 다시 보내면 앞서 보인 오류를 지운다', async () => {
    const user = userEvent.setup();
    const order = await placeGuestOrder();
    renderWithProviders(<OrderLookupForm />);
    await user.click(screen.getByRole('button', { name: '주문 찾기' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: /^주문번호/ }), order.id);
    await user.type(screen.getByRole('textbox', { name: /^이메일/ }), 'guest@example.com');
    await user.click(screen.getByRole('button', { name: '주문 찾기' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /^주문번호/ })).not.toHaveAttribute('aria-invalid');
    expect(screen.getByRole('textbox', { name: /^이메일/ })).not.toHaveAttribute('aria-invalid');
    await waitFor(() => expect(push).toHaveBeenCalledWith(`/orders/${order.id}`));
  });

  it('틀리면 어느 칸인지 밝히지 않고, 맞으면 주문 키를 남기고 주문 확인으로 간다', async () => {
    const user = userEvent.setup();
    const order = await placeGuestOrder();
    renderWithProviders(<OrderLookupForm />);
    await user.type(screen.getByRole('textbox', { name: /^주문번호/ }), order.id);
    await user.type(screen.getByRole('textbox', { name: /^이메일/ }), 'other@example.com');
    await user.click(screen.getByRole('button', { name: '주문 찾기' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('주문번호와 이메일이 맞는 주문이 없습니다.');
    expect(screen.getByRole('textbox', { name: /^주문번호/ })).not.toHaveAttribute('aria-invalid');

    await user.clear(screen.getByRole('textbox', { name: /^이메일/ }));
    await user.type(screen.getByRole('textbox', { name: /^이메일/ }), 'GUEST@example.com');
    await user.click(screen.getByRole('button', { name: '주문 찾기' }));
    await waitFor(() => expect(push).toHaveBeenCalledWith(`/orders/${order.id}`));
    expect(JSON.parse(localStorage.getItem('snb-order-keys-v1') ?? '{}')).toEqual({ [order.id]: order.accessKey });
  });
});
