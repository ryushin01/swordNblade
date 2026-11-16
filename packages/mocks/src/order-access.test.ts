import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { createMockServer } from './node';
import { ADMIN_SESSION_TTL_MS, USER_SESSION_TTL_MS } from './sessions';

import type { Order } from '@snb/domain';

const { server, db } = createMockServer();
const BASE = 'http://localhost';

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => db.reset());
afterAll(() => server.close());

const customer = {
  name: '김가상',
  email: 'Guest@Example.com',
  phone: '010-1234-5678',
  postalCode: '04524',
  address: '서울 중구 세종대로 110',
};

async function placeOrder(headers: Record<string, string> = {}): Promise<Order> {
  const response = await fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      destination: 'KR',
      customer,
      lines: [{ swordId: 'sw-004', quantity: 1 }],
      paymentMethod: 'card',
      permitConfirmed: true,
    }),
  });
  expect(response.status).toBe(201);
  return (await response.json()) as Order;
}

const readOrder = (id: string, headers: Record<string, string> = {}) => fetch(`${BASE}/api/orders/${id}`, { headers });

async function signup(): Promise<string> {
  const response = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    body: JSON.stringify({ name: '회원', email: 'member@example.com', password: 'abcd1234' }),
  });
  return ((await response.json()) as { token: string }).token;
}

async function adminLogin(): Promise<string> {
  const response = await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@example.com', password: 'demo1234' }),
  });
  return ((await response.json()) as { token: string }).token;
}

const lookup = (body: object) => fetch(`${BASE}/api/orders/lookup`, { method: 'POST', body: JSON.stringify(body) });

describe('주문 확인 권한', () => {
  it('비회원 주문은 주문할 때 받은 주문 키로만 열고, 응답에는 키를 싣지 않는다', async () => {
    const order = await placeOrder();
    expect(order.accessKey).toMatch(/^[0-9a-f-]{36}$/);
    // 주문번호(날짜+순번)만 알아서는 열지 못하고, 있는지도 알리지 않습니다.
    expect((await readOrder(order.id)).status).toBe(404);
    expect((await readOrder(order.id, { 'X-Order-Key': 'wrong-key' })).status).toBe(404);

    const response = await readOrder(order.id, { 'X-Order-Key': order.accessKey! });
    expect(response.status).toBe(200);
    expect(((await response.json()) as Order).accessKey).toBeUndefined();
  });

  it('주문한 회원과 어드민은 키 없이 열고, 목록 응답에도 키를 싣지 않는다', async () => {
    const token = await signup();
    const order = await placeOrder({ Authorization: `Bearer ${token}` });
    expect((await readOrder(order.id, { Authorization: `Bearer ${token}` })).status).toBe(200);

    const admin = await adminLogin();
    expect((await readOrder(order.id, { Authorization: `Bearer ${admin}` })).status).toBe(200);

    const mine = (await (
      await fetch(`${BASE}/api/me/orders`, { headers: { Authorization: `Bearer ${token}` } })
    ).json()) as Order[];
    const all = (await (
      await fetch(`${BASE}/api/orders`, { headers: { Authorization: `Bearer ${admin}` } })
    ).json()) as Order[];
    expect([...mine, ...all].every((item) => item.accessKey === undefined)).toBe(true);
  });

  it('주문 키가 생기기 전에 만든 주문은 예전처럼 연다', async () => {
    const order = await placeOrder();
    db.write((state) => ({
      ...state,
      orders: state.orders.map((item) => {
        const legacy = { ...item };
        delete legacy.accessKey;
        return legacy;
      }),
    }));
    expect((await readOrder(order.id)).status).toBe(200);
  });
});

describe('비회원 주문 조회', () => {
  it('주문번호와 이메일이 맞으면(대소문자·앞뒤 공백 무시) 주문 키를 돌려준다', async () => {
    const order = await placeOrder();
    const response = await lookup({ id: ` ${order.id.toLowerCase()} `, email: ' guest@EXAMPLE.com ' });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: order.id, accessKey: order.accessKey });
  });

  it('하나라도 틀리면 무엇이 틀렸는지 밝히지 않고 404, 비운 칸은 422', async () => {
    const order = await placeOrder();
    const wrongEmail = await lookup({ id: order.id, email: 'other@example.com' });
    const wrongId = await lookup({ id: 'SNB-20000101-0001', email: customer.email });
    expect(wrongEmail.status).toBe(404);
    expect(wrongId.status).toBe(404);
    expect(await wrongEmail.json()).toEqual(await wrongId.json());

    const empty = await lookup({ id: '', email: '' });
    expect(empty.status).toBe(422);
    expect(((await empty.json()) as { fields: Record<string, string> }).fields).toEqual({
      id: 'required',
      email: 'required',
    });
  });

  it('키가 없던 예전 주문은 조회해도 키를 붙이지 않아, 예전처럼 주문번호로도 열린다', async () => {
    const order = await placeOrder();
    db.write((state) => ({
      ...state,
      orders: state.orders.map((item) => {
        const legacy = { ...item };
        delete legacy.accessKey;
        return legacy;
      }),
    }));
    const response = await lookup({ id: order.id, email: customer.email });
    expect(response.status).toBe(200);
    const { accessKey } = (await response.json()) as { accessKey: string };
    expect(accessKey).toMatch(/^[0-9a-f-]{36}$/);
    expect(db.read().orders.find((item) => item.id === order.id)?.accessKey).toBeUndefined();
    expect((await readOrder(order.id)).status).toBe(200);
    expect((await readOrder(order.id, { 'X-Order-Key': accessKey })).status).toBe(200);
  });
});

describe('세션 만료', () => {
  const age = (ms: number) => new Date(Date.now() - ms).toISOString();

  it('30일이 지난 회원 세션은 로그인 상태로 보지 않고, 새로 로그인하면 지난 세션을 지운다', async () => {
    const token = await signup();
    db.write((state) => ({
      ...state,
      sessions: state.sessions?.map((session) => ({ ...session, createdAt: age(USER_SESSION_TTL_MS + 1000) })),
    }));
    expect((await fetch(`${BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })).status).toBe(401);

    await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'member@example.com', password: 'abcd1234' }),
    });
    expect(db.read().sessions?.map((session) => session.token)).not.toContain(token);
    expect(db.read().sessions).toHaveLength(1);
  });

  it('어드민 세션은 하루가 지나거나, 만료를 두기 전의 토큰 문자열이면 무효다', async () => {
    const order = await placeOrder();
    const admin = await adminLogin();
    const asAdmin = { Authorization: `Bearer ${admin}` };
    expect((await readOrder(order.id, asAdmin)).status).toBe(200);

    db.write((state) => ({ ...state, adminSessions: [{ token: admin, createdAt: age(ADMIN_SESSION_TTL_MS + 1000) }] }));
    expect((await readOrder(order.id, asAdmin)).status).toBe(404);

    db.write((state) => ({ ...state, adminSessions: [admin] }));
    expect((await readOrder(order.id, asAdmin)).status).toBe(404);
  });
});
