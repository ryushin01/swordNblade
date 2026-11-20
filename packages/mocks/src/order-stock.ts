import type { DbState } from './db';
import type { Order, Sword } from '@snb/domain';

/** 영어 이름을 남기기 전에 만든 주문은 지금 도검 목록에서 영어 이름을 채웁니다. 목록에 없는 도검은 그대로 둡니다. */
export function withEnglishNames(order: Order, swords: readonly Sword[]): Order {
  if (order.lines.every((line) => line.nameEn)) return order;
  return {
    ...order,
    lines: order.lines.map((line) => {
      if (line.nameEn) return line;
      const nameEn = swords.find((sword) => sword.id === line.swordId)?.nameEn;
      return nameEn ? { ...line, nameEn } : line;
    }),
  };
}

/** 응답에 실을 주문. 주문 키는 주문할 때와 비회원 주문 조회 응답에만 싣습니다. */
export function withoutAccessKey(order: Order): Order {
  const copy = { ...order };
  delete copy.accessKey;
  return copy;
}

/** 주문 수량만큼 재고를 되돌립니다(sign 1) 또는 다시 뺍니다(sign -1). 지워진 도검은 건너뜁니다. */
function moveStock(state: DbState, order: Order, sign: 1 | -1): DbState {
  return {
    ...state,
    swords: state.swords.map((sword) => {
      const quantity = order.lines
        .filter((line) => line.swordId === sword.id)
        .reduce((sum, line) => sum + line.quantity, 0);
      return quantity ? { ...sword, stock: sword.stock + sign * quantity } : sword;
    }),
  };
}

/** 주문을 취소하면서 재고를 되돌립니다. */
export function cancelOrderInState(state: DbState, order: Order): DbState {
  return {
    ...moveStock(state, order, 1),
    orders: state.orders.map((item) => (item.id === order.id ? { ...item, status: 'cancelled' } : item)),
  };
}

/** 취소한 주문을 되살릴 때 재고가 모자란 도검의 이름. 충분하면 undefined */
export function reviveShortage(state: DbState, order: Order): string | undefined {
  return order.lines.find((line) => {
    const sword = state.swords.find((item) => item.id === line.swordId);
    return sword && sword.stock < line.quantity;
  })?.name;
}

/** 취소한 주문을 되살리면서 재고를 다시 뺍니다. */
export function reviveOrderInState(state: DbState, order: Order, status: Order['status']): DbState {
  return {
    ...moveStock(state, order, -1),
    orders: state.orders.map((item) => (item.id === order.id ? { ...item, status } : item)),
  };
}
