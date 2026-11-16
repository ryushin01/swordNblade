'use client';

import { useLocale } from 'next-intl';

import {
  estimateCustoms,
  findCountryRule,
  type Locale,
  priceOf,
  requiresPossessionPermit,
  resolveDestination,
} from '@snb/domain';

import { useCartHydrated, useCartStore } from '@/entities/cart';
import { localizeForLocale, useSwords } from '@/entities/sword';
import { useCustomsConfig } from '@/entities/tariff';
import { useNow } from '@/shared/lib/use-now';

/** 담은 수량을 지금 재고로 채울 수 없는 줄. 품절이면 sold-out, 일부만 남았으면 short(남은 재고) */
export type StockIssue = { kind: 'sold-out' } | { kind: 'short'; stock: number };

export const stockIssueOf = (quantity: number, stock: number): StockIssue | undefined => {
  if (stock <= 0) return { kind: 'sold-out' };
  if (quantity > stock) return { kind: 'short', stock };
  return undefined;
};

/**
 * 장바구니 품목을 상품 정보와 합치고, 고른 배송지 기준으로 관세와 소지 허가 여부를 계산합니다.
 * 장바구니와 주문서가 함께 써서 두 화면의 금액이 늘 같습니다. 금액은 지금 시각의 판매가(할인 적용)입니다.
 * - loading: 기기에 저장한 장바구니, 상품 목록, 관세 표를 받는 중
 * - error: 상품 목록이나 관세 표를 받지 못함
 * - ready: 계산 결과(품목이 비었을 수 있음). 담은 뒤 품절되거나 재고가 줄어든 줄이 있으면 blocked
 */
export function useCartQuote() {
  const locale = useLocale() as Locale;
  const hydrated = useCartHydrated();
  const lines = useCartStore((state) => state.lines);
  const savedDestination = useCartStore((state) => state.destination);
  const swords = useSwords();
  const config = useCustomsConfig();
  const now = useNow();

  if (!hydrated || swords.isPending || config.isPending) return { status: 'loading' } as const;
  if (swords.isError || config.isError) return { status: 'error' } as const;

  // 관세 표에 없는 배송 국가(깨진 저장값 등)는 대한민국으로 계산해 화면이 멈추지 않게 합니다.
  const destination = resolveDestination(config.data, savedDestination);
  // 판매가 끝나 목록에 없는 상품은 뺍니다.
  const items = lines.flatMap((line) => {
    const sword = swords.data.find((item) => item.id === line.swordId);
    return sword
      ? [
          {
            line,
            sword: localizeForLocale(sword, locale),
            pricing: priceOf(sword, now),
            stockIssue: stockIssueOf(line.quantity, sword.stock),
          },
        ]
      : [];
  });
  const estimate = estimateCustoms(
    items.map(({ line, sword, pricing }) => ({
      origin: sword.origin,
      unitPrice: pricing.price,
      quantity: line.quantity,
    })),
    destination,
    config.data,
  );
  return {
    status: 'ready',
    destination,
    config: config.data,
    items,
    estimate,
    needsPermit: items.some(({ sword }) => requiresPossessionPermit(sword.specs)),
    rule: findCountryRule(config.data, destination),
    /** 품절·재고 부족 줄이 있어 이대로는 주문할 수 없음 */
    blocked: items.some(({ stockIssue }) => stockIssue !== undefined),
  } as const;
}
