import { delay, http, HttpResponse } from 'msw';

import {
  type CountryCode,
  type Customer,
  type CustomsConfig,
  estimateCustoms,
  MAX_ORDER_QUANTITY,
  type Order,
  type OrderStatus,
  priceOf,
  requiresPossessionPermit,
  type Sword,
  type SwordCategory,
  validateDiscount,
} from '@snb/domain';

import { createAdminHandlers, isAdmin } from './admin-handlers';
import { createAuthHandlers, findSessionUser } from './auth-handlers';
import { createMemoryImageStore, type ImageStore } from './image-store';
import { cancelOrderInState, reviveOrderInState, reviveShortage, withoutAccessKey } from './order-stock';
import { createReviewHandlers } from './review-handlers';

import type { Db } from './db';

export interface CreateOrderBody {
  destination: CountryCode;
  customer: Customer;
  lines: Array<{ swordId: string; quantity: number }>;
  paymentMethod: Order['paymentMethod'];
  permitConfirmed: boolean;
  /** 고객이 주문서에서 확인한 결제 금액. 서버가 다시 계산한 금액과 다르면 주문하지 않고 409(price-changed)로 알립니다. */
  expectedTotal?: number;
}

export interface ApiError {
  message: string;
  fields?: Record<string, string>;
  /**
   * 화면이 따로 안내해야 하는 오류.
   * - price-changed: 주문하는 사이 결제 금액이 바뀜
   * - out-of-stock: 품절됐거나(판매 종료 포함) 재고가 담은 수량보다 적음
   */
  code?: 'price-changed' | 'out-of-stock';
  /** price-changed일 때 서버가 다시 계산한 결제 금액 */
  total?: number;
  /** out-of-stock일 때 재고가 모자란 도검과 남은 재고(판매가 끝났으면 0) */
  swordId?: string;
  stock?: number;
}

export interface DashboardStats {
  swordCount: number;
  lowStock: number;
  orderCount: number;
  revenue: number;
  pendingPermits: number;
}

const ORDER_STATUSES: OrderStatus[] = ['paid', 'permit-review', 'preparing', 'shipped', 'delivered', 'cancelled'];

const error = (status: number, body: ApiError) => HttpResponse.json(body, { status });

/** 할인 값이 있으면 확인하고, 맞지 않으면 칸 오류로 돌려줍니다. */
const discountError = (body: Pick<Sword, 'discount'>) => {
  if (body.discount === undefined) return null;
  const message = validateDiscount(body.discount);
  return message ? error(422, { message, fields: { discount: message } }) : null;
};

const pad = (value: number, length: number) => String(value).padStart(length, '0');

/** 한국 시간 날짜(YYYYMMDD). 할인 기간과 화면 시각처럼 주문번호 날짜도 브라우저 시간대가 아닌 한국 시간을 씁니다. */
const kstDay = (now: Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(now)
    .replace(/-/g, '');

export function nextOrderId(orders: Order[], now: Date): string {
  const day = kstDay(now);
  const max = orders.reduce((acc, order) => Math.max(acc, Number(order.id.split('-')[2] ?? 0)), 0);
  return `SNB-${day}-${pad(max + 1, 4)}`;
}

function validateCustomer(customer: Partial<Customer> | undefined): Record<string, string> {
  const fields: Record<string, string> = {};
  if (!customer?.name?.trim()) fields.name = '받는 분 이름을 입력해 주세요.';
  if (!customer?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    fields.email = '이메일 형식을 확인해 주세요.';
  if (!customer?.phone || customer.phone.replace(/\D/g, '').length < 7) fields.phone = '연락처를 확인해 주세요.';
  if (!customer?.postalCode?.trim()) fields.postalCode = '우편번호를 입력해 주세요.';
  if (!customer?.address?.trim()) fields.address = '주소를 입력해 주세요.';
  return fields;
}

export interface HandlerOptions {
  /** 응답 지연(ms). 테스트에서는 0 */
  latency?: number;
  /** 상품 사진 저장소. 기본은 메모리 */
  images?: ImageStore;
  /** 어드민 API에 어드민 로그인을 요구합니다. 브라우저에서 켜고, 단위 테스트는 끄고 씁니다. */
  requireAdmin?: boolean;
}

/** 올릴 수 있는 사진 크기(어드민이 미리 줄여 보내므로 넉넉히) */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** '*'로 시작해 브라우저(상대 경로)와 Node(절대 경로) 모두에서 맞습니다. */
export function createHandlers(db: Db, options: HandlerOptions = {}) {
  const wait = () => (options.latency ? delay(options.latency) : Promise.resolve());
  const images = options.images ?? createMemoryImageStore();
  const requireAdmin = options.requireAdmin ?? false;
  const adminDenied = (request: Request) =>
    requireAdmin && !isAdmin(db, request) ? error(401, { message: '어드민 로그인이 필요합니다.' }) : null;
  /**
   * 주문 확인을 열 수 있는지. 주문번호는 날짜+순번이라 짐작하기 쉬우므로, 주문한 기기의 주문 키(X-Order-Key)·주문한 회원·어드민만 엽니다.
   * 주문 키가 생기기 전에 만든 주문은 예전처럼 엽니다.
   */
  const canReadOrder = (request: Request, order: Order) =>
    !order.accessKey ||
    request.headers.get('X-Order-Key') === order.accessKey ||
    (order.userId !== undefined && findSessionUser(db, request)?.id === order.userId) ||
    isAdmin(db, request);

  return [
    ...createAuthHandlers(db, wait, requireAdmin),
    ...createAdminHandlers(db, wait),
    ...createReviewHandlers(db, wait),

    http.post('*/api/images', async ({ request }) => {
      await wait();
      if (requireAdmin && !isAdmin(db, request) && !findSessionUser(db, request)) {
        return error(401, { message: '로그인이 필요합니다.' });
      }
      const form = await request.formData().catch(() => null);
      const file = form?.get('file');
      if (!(file instanceof Blob)) return error(400, { message: '사진 파일이 없습니다.' });
      if (!file.type.startsWith('image/')) return error(415, { message: '이미지 파일만 올릴 수 있습니다.' });
      if (file.size > MAX_IMAGE_BYTES) return error(413, { message: '사진은 5MB 이하만 올릴 수 있습니다.' });
      const id = crypto.randomUUID();
      try {
        await images.put(id, { type: file.type, data: await file.arrayBuffer() });
      } catch {
        // 저장하지 못한 사진의 주소를 돌려주면 상품에 깨진 사진이 남으므로 실패로 알립니다.
        return error(507, { message: '사진을 저장하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.' });
      }
      return HttpResponse.json({ url: `/api/images/${id}` }, { status: 201 });
    }),

    http.get<{ id: string }>('*/api/images/:id', async ({ params }) => {
      const image = await images.get(params.id);
      if (!image) return new HttpResponse(null, { status: 404 });
      return HttpResponse.arrayBuffer(image.data, {
        headers: { 'Content-Type': image.type, 'Cache-Control': 'private, max-age=31536000, immutable' },
      });
    }),

    http.get('*/api/swords', async ({ request }) => {
      await wait();
      const category = new URL(request.url).searchParams.get('category') as SwordCategory | null;
      const swords = db.read().swords.filter((sword) => !category || sword.category === category);
      return HttpResponse.json(swords);
    }),

    http.get<{ slug: string }>('*/api/swords/:slug', async ({ params }) => {
      await wait();
      const sword = db.read().swords.find((item) => item.slug === params.slug || item.id === params.slug);
      return sword ? HttpResponse.json(sword) : error(404, { message: '상품을 찾을 수 없습니다.' });
    }),

    http.post('*/api/swords', async ({ request }) => {
      const denied = adminDenied(request);
      if (denied) return denied;
      await wait();
      const body = (await request.json()) as Omit<Sword, 'id'>;
      if (!body.slug || !body.name) return error(400, { message: '이름과 주소(slug)는 필수입니다.' });
      const invalidDiscount = discountError(body);
      if (invalidDiscount) return invalidDiscount;
      if (db.read().swords.some((sword) => sword.slug === body.slug)) {
        return error(409, {
          message: '같은 주소(slug)의 상품이 있습니다.',
          fields: { slug: '다른 값을 입력해 주세요.' },
        });
      }
      const id = `sw-${pad(db.read().swords.length + 1, 3)}-${Date.now().toString(36)}`;
      const created: Sword = { ...body, id };
      db.write((state) => ({ ...state, swords: [...state.swords, created] }));
      return HttpResponse.json(created, { status: 201 });
    }),

    http.put<{ id: string }>('*/api/swords/:id', async ({ params, request }) => {
      const denied = adminDenied(request);
      if (denied) return denied;
      await wait();
      const body = (await request.json()) as Sword;
      if (!body.slug || !body.name) return error(400, { message: '이름과 주소(slug)는 필수입니다.' });
      const invalidDiscount = discountError(body);
      if (invalidDiscount) return invalidDiscount;
      const { swords } = db.read();
      if (!swords.some((sword) => sword.id === params.id)) return error(404, { message: '상품을 찾을 수 없습니다.' });
      // 다른 상품과 같은 주소로 바꾸면 그 상품이 상세 화면에서 가려지므로 막습니다(등록과 같은 규칙).
      if (swords.some((sword) => sword.slug === body.slug && sword.id !== params.id)) {
        return error(409, {
          message: '같은 주소(slug)의 상품이 있습니다.',
          fields: { slug: '다른 값을 입력해 주세요.' },
        });
      }
      const updated: Sword = { ...body, id: params.id };
      db.write((state) => ({
        ...state,
        swords: state.swords.map((sword) => (sword.id === params.id ? updated : sword)),
      }));
      return HttpResponse.json(updated);
    }),

    http.delete<{ id: string }>('*/api/swords/:id', async ({ params, request }) => {
      const denied = adminDenied(request);
      if (denied) return denied;
      await wait();
      db.write((state) => ({ ...state, swords: state.swords.filter((sword) => sword.id !== params.id) }));
      return new HttpResponse(null, { status: 204 });
    }),

    http.get('*/api/customs-config', async () => {
      await wait();
      return HttpResponse.json(db.read().customs);
    }),

    http.put('*/api/customs-config', async ({ request }) => {
      const denied = adminDenied(request);
      if (denied) return denied;
      await wait();
      const body = (await request.json()) as CustomsConfig;
      const invalid = Object.entries(body.exchangeRates).find(([, rate]) => !(rate > 0));
      if (invalid) return error(400, { message: `환율은 0보다 커야 합니다: ${invalid[0]}` });
      const next = { ...body, updatedAt: new Date().toISOString() };
      db.write((state) => ({ ...state, customs: next }));
      return HttpResponse.json(next);
    }),

    http.get('*/api/orders', async ({ request }) => {
      const denied = adminDenied(request);
      if (denied) return denied;
      await wait();
      const orders = [...db.read().orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return HttpResponse.json(orders.map(withoutAccessKey));
    }),

    http.get<{ id: string }>('*/api/orders/:id', async ({ params, request }) => {
      await wait();
      const order = db.read().orders.find((item) => item.id === params.id);
      // 열 수 없는 주문은 있는지도 알리지 않습니다.
      if (!order || !canReadOrder(request, order)) return error(404, { message: '주문을 찾을 수 없습니다.' });
      return HttpResponse.json(withoutAccessKey(order));
    }),

    // 비회원 주문 조회: 주문번호와 주문할 때 쓴 이메일이 맞으면 주문 키를 돌려줍니다. 무엇이 틀렸는지는 알리지 않습니다.
    http.post('*/api/orders/lookup', async ({ request }) => {
      await wait();
      const body = (await request.json().catch(() => null)) as { id?: unknown; email?: unknown } | null;
      const id = typeof body?.id === 'string' ? body.id.trim().toUpperCase() : '';
      const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
      if (!id || !email) {
        return error(422, {
          message: '주문번호와 이메일을 입력해 주세요.',
          fields: { ...(id ? {} : { id: 'required' }), ...(email ? {} : { email: 'required' }) },
        });
      }
      const order = db
        .read()
        .orders.find((item) => item.id === id && item.customer.email.trim().toLowerCase() === email);
      if (!order) return error(404, { message: '주문번호와 이메일이 맞는 주문이 없습니다.' });
      // 키가 생기기 전 주문은 예전처럼 주문번호로 열리므로 키를 새로 붙이지 않습니다(붙이면 그 주문을 키 없이 열던 기기가 막힘).
      // 화면이 같은 흐름으로 다루도록 이번 응답에만 쓰는 키를 돌려주고, 그 주문을 열 때는 키를 확인하지 않습니다.
      return HttpResponse.json({ id: order.id, accessKey: order.accessKey ?? crypto.randomUUID() });
    }),

    http.post('*/api/orders', async ({ request }) => {
      await wait();
      const body = (await request.json()) as Partial<CreateOrderBody>;
      const state = db.read();
      const fields = validateCustomer(body.customer);

      if (!body.destination || !state.customs.countries.some((country) => country.code === body.destination)) {
        fields.destination = '배송 국가를 선택해 주세요.';
      }
      if (!body.paymentMethod) fields.paymentMethod = '결제 수단을 선택해 주세요.';
      if (!Array.isArray(body.lines) || body.lines.length === 0) {
        return error(400, { message: '장바구니가 비어 있습니다.' });
      }

      // 수량은 도검마다 1~최대 수량의 정수입니다. 같은 도검이 여러 줄이면 합쳐서 재고를 확인하고 뺍니다.
      const quantities = new Map<string, number>();
      for (const line of body.lines as unknown[]) {
        const { swordId, quantity } = (line ?? {}) as { swordId?: unknown; quantity?: unknown };
        if (typeof swordId !== 'string' || !Number.isInteger(quantity) || (quantity as number) < 1) {
          return error(422, { message: '주문 수량을 확인해 주세요.', fields: { lines: 'quantity' } });
        }
        quantities.set(swordId, (quantities.get(swordId) ?? 0) + (quantity as number));
      }
      if ([...quantities.values()].some((quantity) => quantity > MAX_ORDER_QUANTITY)) {
        return error(422, {
          message: `한 도검은 ${MAX_ORDER_QUANTITY}점까지 주문할 수 있습니다.`,
          fields: { lines: 'quantity' },
        });
      }
      const lines = [...quantities].map(([swordId, quantity]) => ({
        line: { swordId, quantity },
        sword: state.swords.find((sword) => sword.id === swordId),
      }));
      const missing = lines.find(({ sword }) => !sword);
      if (missing) {
        return error(409, {
          message: '판매가 끝난 상품이 장바구니에 있습니다.',
          code: 'out-of-stock',
          swordId: missing.line.swordId,
          stock: 0,
        });
      }

      const shortage = lines.find(({ line, sword }) => sword && sword.stock < line.quantity);
      if (shortage?.sword) {
        return error(409, {
          message: `${shortage.sword.name}의 재고가 ${shortage.sword.stock}점 남았습니다.`,
          code: 'out-of-stock',
          swordId: shortage.sword.id,
          stock: Math.max(0, shortage.sword.stock),
        });
      }

      const needsPermit = lines.some(({ sword }) => sword && requiresPossessionPermit(sword.specs));
      if (needsPermit && !body.permitConfirmed) fields.permitConfirmed = '허가 안내를 확인해 주세요.';

      if (Object.keys(fields).length > 0) return error(422, { message: '입력 내용을 확인해 주세요.', fields });

      // 주문하는 순간의 판매가(할인 적용)로 계산합니다. 화면에서 보낸 금액은 믿지 않습니다.
      const pricedAt = Date.now();
      const orderLines = lines.map(({ line, sword }) => {
        const { price, listPrice, rate } = priceOf(sword!, pricedAt);
        return {
          swordId: sword!.id,
          name: sword!.name,
          origin: sword!.origin,
          unitPrice: price,
          ...(rate > 0 ? { listPrice } : {}),
          quantity: line.quantity,
        };
      });
      const estimate = estimateCustoms(orderLines, body.destination!, state.customs);
      // 고객이 확인한 금액과 다르면(할인이 끝났거나 가격·관세율이 바뀜) 주문하지 않고 바뀐 금액을 알려 다시 확인받습니다.
      if (body.expectedTotal !== undefined && body.expectedTotal !== estimate.totals.total) {
        return error(409, {
          message: '주문하는 사이 결제 금액이 바뀌었습니다. 바뀐 금액을 확인한 뒤 다시 결제해 주세요.',
          code: 'price-changed',
          total: estimate.totals.total,
        });
      }
      const buyer = findSessionUser(db, request);
      const now = new Date();
      const order: Order = {
        id: nextOrderId(state.orders, now),
        createdAt: now.toISOString(),
        // 이 기기에서 주문 확인을 열 때 씁니다(응답에만 싣고, 화면이 기기에 남김).
        accessKey: crypto.randomUUID(),
        status: needsPermit ? 'permit-review' : 'paid',
        destination: body.destination!,
        // 로그인한 채 주문하면 내 주문 내역에 남도록 회원 id를 붙입니다.
        ...(buyer ? { userId: buyer.id } : {}),
        customer: body.customer as Customer,
        lines: orderLines,
        paymentMethod: body.paymentMethod!,
        permitConfirmed: Boolean(body.permitConfirmed),
        amounts: estimate.totals,
      };

      db.write((current) => ({
        ...current,
        orders: [...current.orders, order],
        swords: current.swords.map((sword) => {
          const ordered = orderLines.find((line) => line.swordId === sword.id);
          return ordered ? { ...sword, stock: sword.stock - ordered.quantity } : sword;
        }),
      }));

      return HttpResponse.json(order, { status: 201 });
    }),

    http.patch<{ id: string }>('*/api/orders/:id', async ({ params, request }) => {
      const denied = adminDenied(request);
      if (denied) return denied;
      await wait();
      const { status } = (await request.json()) as { status: OrderStatus };
      if (!ORDER_STATUSES.includes(status)) return error(400, { message: '알 수 없는 주문 상태입니다.' });
      const order = db.read().orders.find((item) => item.id === params.id);
      if (!order) return error(404, { message: '주문을 찾을 수 없습니다.' });
      // 취소하면 재고를 돌려주고, 취소를 되살리면 재고를 다시 뺍니다.
      const cancelling = status === 'cancelled' && order.status !== 'cancelled';
      const reviving = status !== 'cancelled' && order.status === 'cancelled';
      if (reviving) {
        const short = reviveShortage(db.read(), order);
        if (short) return error(409, { message: `${short}의 재고가 모자라 주문을 되살릴 수 없습니다.` });
      }
      const next = db.write((state) => {
        if (cancelling) return cancelOrderInState(state, order);
        if (reviving) return reviveOrderInState(state, order, status);
        return { ...state, orders: state.orders.map((item) => (item.id === params.id ? { ...item, status } : item)) };
      });
      const updated = next.orders.find((item) => item.id === params.id);
      return HttpResponse.json(updated && withoutAccessKey(updated));
    }),

    http.get('*/api/stats', async ({ request }) => {
      const denied = adminDenied(request);
      if (denied) return denied;
      await wait();
      const { swords, orders } = db.read();
      const active = orders.filter((order) => order.status !== 'cancelled');
      const stats: DashboardStats = {
        swordCount: swords.length,
        lowStock: swords.filter((sword) => sword.stock <= 2).length,
        orderCount: active.length,
        revenue: active.reduce((sum, order) => sum + order.amounts.goods, 0),
        pendingPermits: orders.filter((order) => order.status === 'permit-review').length,
      };
      return HttpResponse.json(stats);
    }),
  ];
}
