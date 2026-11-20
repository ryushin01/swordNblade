import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { nextOrderId } from './handlers';
import { createMockServer } from './node';

import type { Order } from '@snb/domain';

const { server, db } = createMockServer();
const BASE = 'http://localhost';

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => db.reset());
afterAll(() => server.close());

const customer = {
  name: '홍길동',
  email: 'test@example.com',
  phone: '010-1234-5678',
  postalCode: '04524',
  address: '서울 중구 세종대로 110',
};

describe('Mock API', () => {
  it('카테고리로 상품을 거른다', async () => {
    const swords = (await (await fetch(`${BASE}/api/swords?category=legend`)).json()) as Array<{ category: string }>;
    expect(swords.length).toBeGreaterThan(0);
    expect(swords.every((sword) => sword.category === 'legend')).toBe(true);
  });

  it('주문 금액은 서버가 관세까지 다시 계산하고 재고를 줄인다', async () => {
    const response = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      body: JSON.stringify({
        destination: 'KR',
        customer,
        lines: [{ swordId: 'sw-004', quantity: 1 }],
        paymentMethod: 'card',
        permitConfirmed: true,
      }),
    });
    expect(response.status).toBe(201);
    const order = (await response.json()) as Order;
    expect(order.amounts).toEqual({
      goods: 4_500_000,
      shipping: 85_000,
      duty: 366_800,
      vat: 495_180,
      total: 5_446_980,
    });
    expect(order.status).toBe('permit-review');
    expect(db.read().swords.find((sword) => sword.id === 'sw-004')?.stock).toBe(3);
  });

  it('진검 주문에서 허가 확인을 안 하면 422', async () => {
    const response = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      body: JSON.stringify({
        destination: 'KR',
        customer,
        lines: [{ swordId: 'sw-001', quantity: 1 }],
        paymentMethod: 'card',
        permitConfirmed: false,
      }),
    });
    expect(response.status).toBe(422);
    const body = (await response.json()) as { fields: Record<string, string> };
    expect(body.fields.permitConfirmed).toBeDefined();
  });

  it('재고보다 많이 주문하면 409와 함께 어느 도검이 몇 점 남았는지 알린다', async () => {
    const response = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      body: JSON.stringify({
        destination: 'KR',
        customer,
        lines: [{ swordId: 'sw-016', quantity: 5 }],
        paymentMethod: 'card',
        permitConfirmed: true,
      }),
    });
    expect(response.status).toBe(409);
    const stock = db.read().swords.find((sword) => sword.id === 'sw-016')!.stock;
    expect(await response.json()).toMatchObject({ code: 'out-of-stock', swordId: 'sw-016', stock });
  });

  it('판매가 끝난(목록에 없는) 도검은 재고 0으로 알린다', async () => {
    const response = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      body: JSON.stringify({
        destination: 'KR',
        customer,
        lines: [{ swordId: 'removed-sword', quantity: 1 }],
        paymentMethod: 'card',
        permitConfirmed: true,
      }),
    });
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ code: 'out-of-stock', swordId: 'removed-sword', stock: 0 });
  });

  it.each([
    ['음수', -2],
    ['0', 0],
    ['소수', 1.5],
    ['최대 수량 초과', 6],
    ['숫자가 아닌 값', '2'],
  ])('수량이 %s이면 주문하지 않고 422, 재고도 그대로', async (_label, quantity) => {
    const before = db.read().swords.find((sword) => sword.id === 'sw-004')!.stock;
    const response = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      body: JSON.stringify({
        destination: 'KR',
        customer,
        lines: [{ swordId: 'sw-004', quantity }],
        paymentMethod: 'card',
        permitConfirmed: true,
      }),
    });
    expect(response.status).toBe(422);
    expect(db.read().swords.find((sword) => sword.id === 'sw-004')!.stock).toBe(before);
  });

  it('같은 도검이 여러 줄이면 합쳐서 재고를 확인하고 한 줄로 주문한다', async () => {
    db.write((state) => ({
      ...state,
      swords: state.swords.map((sword) => (sword.id === 'sw-004' ? { ...sword, stock: 3 } : sword)),
    }));
    const order = (lines: Array<{ swordId: string; quantity: number }>) =>
      fetch(`${BASE}/api/orders`, {
        method: 'POST',
        body: JSON.stringify({ destination: 'KR', customer, lines, paymentMethod: 'card', permitConfirmed: true }),
      });
    // 줄마다 따로 보면 2점씩이라 재고(3점) 안이지만, 합치면 4점이라 모자랍니다.
    const short = await order([
      { swordId: 'sw-004', quantity: 2 },
      { swordId: 'sw-004', quantity: 2 },
    ]);
    expect(short.status).toBe(409);
    expect(db.read().swords.find((sword) => sword.id === 'sw-004')!.stock).toBe(3);

    const placed = await order([
      { swordId: 'sw-004', quantity: 1 },
      { swordId: 'sw-004', quantity: 2 },
    ]);
    expect(placed.status).toBe(201);
    const body = (await placed.json()) as Order;
    expect(body.lines).toHaveLength(1);
    expect(body.lines[0]).toMatchObject({ swordId: 'sw-004', quantity: 3 });
    // 영어 화면 영수증이 시드 목록 없이 이름을 고를 수 있게 영어 이름을 함께 남깁니다.
    expect(body.lines[0]!.nameEn).toBe(db.read().swords.find((sword) => sword.id === 'sw-004')!.nameEn);
    expect(db.read().swords.find((sword) => sword.id === 'sw-004')!.stock).toBe(0);
  });

  it('영어 이름을 남기기 전에 만든 주문은 조회할 때 지금 도검 목록에서 영어 이름을 채운다', async () => {
    const legacy: Order = {
      id: 'SNB-20261101-0099',
      createdAt: '2026-11-01T00:00:00.000Z',
      status: 'paid',
      destination: 'KR',
      customer,
      lines: [
        { swordId: 'sw-004', name: '우치가타나', origin: 'JP', unitPrice: 1, quantity: 1 },
        { swordId: 'sw-deleted', name: '지운 도검', origin: 'KR', unitPrice: 1, quantity: 1 },
      ],
      paymentMethod: 'card',
      permitConfirmed: true,
      amounts: { goods: 2, shipping: 0, duty: 0, vat: 0, total: 2 },
    };
    db.write((state) => ({ ...state, orders: [...state.orders, legacy] }));
    const body = (await (await fetch(`${BASE}/api/orders/${legacy.id}`)).json()) as Order;
    expect(body.lines[0]!.nameEn).toBe(db.read().swords.find((sword) => sword.id === 'sw-004')!.nameEn);
    // 목록에 없는 도검은 저장된 이름만 남습니다.
    expect(body.lines[1]!.nameEn).toBeUndefined();
  });

  it('주문번호의 날짜는 한국 시간이다', () => {
    // 2026-11-15 16:30 UTC는 한국 시간 2026-11-16 01:30입니다.
    expect(nextOrderId([], new Date('2026-11-15T16:30:00Z'))).toBe('SNB-20261116-0001');
  });

  it('할인 중인 도검은 할인가로 주문하고 정가를 함께 남긴다', async () => {
    db.write((state) => ({
      ...state,
      swords: state.swords.map((sword) =>
        sword.id === 'sw-003'
          ? { ...sword, discount: { rate: 20 } }
          : sword.id === 'sw-007'
            ? { ...sword, discount: { rate: 30, startsAt: '2999-01-01' } }
            : sword,
      ),
    }));
    const listPrice = (id: string) => db.read().swords.find((sword) => sword.id === id)!.price;
    const response = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      body: JSON.stringify({
        destination: 'KR',
        customer,
        lines: [
          { swordId: 'sw-003', quantity: 1 },
          { swordId: 'sw-007', quantity: 1 },
        ],
        paymentMethod: 'card',
        permitConfirmed: true,
      }),
    });
    expect(response.status).toBe(201);
    const order = (await response.json()) as Order;
    expect(order.lines[0]).toMatchObject({ unitPrice: 7_840_000, listPrice: 9_800_000 });
    // 시작 전인 할인은 적용하지 않습니다.
    expect(order.lines[1]?.unitPrice).toBe(listPrice('sw-007'));
    expect(order.lines[1]).not.toHaveProperty('listPrice');
    expect(order.amounts.goods).toBe(7_840_000 + listPrice('sw-007'));
  });

  it('고객이 확인한 금액과 서버가 다시 계산한 금액이 다르면 주문하지 않고 바뀐 금액을 알린다', async () => {
    const place = (expectedTotal: number) =>
      fetch(`${BASE}/api/orders`, {
        method: 'POST',
        body: JSON.stringify({
          destination: 'KR',
          customer,
          lines: [{ swordId: 'sw-004', quantity: 1 }],
          paymentMethod: 'card',
          permitConfirmed: true,
          expectedTotal,
        }),
      });
    const ordersBefore = db.read().orders.length;
    const changed = await place(5_000_000);
    expect(changed.status).toBe(409);
    expect(await changed.json()).toMatchObject({ code: 'price-changed', total: 5_446_980 });
    expect(db.read().orders).toHaveLength(ordersBefore);
    expect(db.read().swords.find((sword) => sword.id === 'sw-004')?.stock).toBe(4);
    // 바뀐 금액을 확인하고 다시 보내면 주문합니다.
    expect((await place(5_446_980)).status).toBe(201);
  });

  it('상품을 고칠 때 다른 상품과 같은 주소(slug)로 바꾸면 409, 이름이나 주소를 비우면 400', async () => {
    const [first, second] = db.read().swords;
    const put = (body: object) =>
      fetch(`${BASE}/api/swords/${first!.id}`, { method: 'PUT', body: JSON.stringify({ ...first, ...body }) });
    const conflict = await put({ slug: second!.slug });
    expect(conflict.status).toBe(409);
    expect(((await conflict.json()) as { fields: Record<string, string> }).fields.slug).toBeDefined();
    expect((await put({ name: '' })).status).toBe(400);
    // 자기 주소 그대로 저장하는 것은 됩니다.
    expect((await put({ stock: 9 })).status).toBe(200);
    expect(db.read().swords.find((sword) => sword.id === second!.id)?.slug).toBe(second!.slug);
  });

  it('할인 값이 맞지 않으면 상품을 저장하지 않고 422', async () => {
    const sword = db.read().swords.find((item) => item.id === 'sw-003')!;
    const save = (discount: unknown) =>
      fetch(`${BASE}/api/swords/${sword.id}`, { method: 'PUT', body: JSON.stringify({ ...sword, discount }) });
    const tooMuch = await save({ rate: 95 });
    expect(tooMuch.status).toBe(422);
    expect(((await tooMuch.json()) as { fields: Record<string, string> }).fields.discount).toMatch(/90/);
    expect((await save({ rate: 10, startsAt: '2027-02-01', endsAt: '2027-01-01' })).status).toBe(422);
    expect(db.read().swords.find((item) => item.id === 'sw-003')?.discount).toBeUndefined();
    expect((await save({ rate: 10, endsAt: '2027-01-31' })).status).toBe(200);
    expect(db.read().swords.find((item) => item.id === 'sw-003')?.discount).toEqual({ rate: 10, endsAt: '2027-01-31' });
  });

  it('주문 상태를 바꾼다', async () => {
    const response = await fetch(`${BASE}/api/orders/SNB-20261103-0002`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'shipped' }),
    });
    expect(((await response.json()) as Order).status).toBe('shipped');
  });
});

describe('상품 사진 Mock API', () => {
  it('어드민이 주문을 취소하면 재고가 돌아오고, 되살리면 다시 빠진다', async () => {
    const order = db.read().orders[0]!;
    const line = order.lines[0]!;
    const before = db.read().swords.find((s) => s.id === line.swordId)!.stock;
    const patch = (status: string) =>
      fetch(`${BASE}/api/orders/${order.id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    const stock = () => db.read().swords.find((s) => s.id === line.swordId)!.stock;

    await patch('cancelled');
    expect(stock()).toBe(before + line.quantity);
    await patch('cancelled');
    expect(stock()).toBe(before + line.quantity);
    await patch('paid');
    expect(stock()).toBe(before);
  });

  it('재고가 모자라면 취소한 주문을 되살리지 못한다', async () => {
    const order = db.read().orders[0]!;
    await fetch(`${BASE}/api/orders/${order.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'cancelled' }) });
    db.write((state) => ({ ...state, swords: state.swords.map((s) => ({ ...s, stock: 0 })) }));
    const response = await fetch(`${BASE}/api/orders/${order.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'paid' }),
    });
    expect(response.status).toBe(409);
  });

  it('사진을 올리면 주소를 돌려주고, 그 주소로 같은 바이트를 받는다', async () => {
    const bytes = new Uint8Array([137, 80, 78, 71, 1, 2, 3]);
    const form = new FormData();
    form.append('file', new Blob([bytes], { type: 'image/png' }), 'a.png');
    const response = await fetch(`${BASE}/api/images`, { method: 'POST', body: form });
    expect(response.status).toBe(201);
    const { url } = (await response.json()) as { url: string };
    expect(url).toMatch(/^\/api\/images\/[\w-]+$/);

    const image = await fetch(`${BASE}${url}`);
    expect(image.headers.get('content-type')).toBe('image/png');
    expect(new Uint8Array(await image.arrayBuffer())).toEqual(bytes);
  });

  it('이미지가 아닌 파일은 거절한다', async () => {
    const form = new FormData();
    form.append('file', new Blob(['hello'], { type: 'text/plain' }), 'a.txt');
    expect((await fetch(`${BASE}/api/images`, { method: 'POST', body: form })).status).toBe(415);
  });

  it('없는 사진은 404', async () => {
    expect((await fetch(`${BASE}/api/images/nope`)).status).toBe(404);
  });
});
