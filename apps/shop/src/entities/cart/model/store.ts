'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DESTINATION_CODES, MAX_ORDER_QUANTITY } from '@snb/domain';

import { SITE } from '@/shared/config';
import { safeJsonStorage } from '@/shared/lib/safe-storage';
import { syncAcrossTabs } from '@/shared/lib/sync-across-tabs';

import type { CartLine, CountryCode } from '@snb/domain';

export const MAX_QUANTITY = MAX_ORDER_QUANTITY;

/** 저장된 배송 국가. 관세 표에 없는 값(깨진 저장값)이면 지금 값을 둡니다. */
export const toValidDestination = (value: unknown, fallback: CountryCode): CountryCode =>
  typeof value === 'string' && (DESTINATION_CODES as string[]).includes(value) ? (value as CountryCode) : fallback;

interface CartState {
  lines: CartLine[];
  destination: CountryCode;
  add: (swordId: string, quantity?: number) => void;
  setQuantity: (swordId: string, quantity: number) => void;
  remove: (swordId: string) => void;
  setDestination: (destination: CountryCode) => void;
  clear: () => void;
}

const clamp = (value: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.round(value)));

export function toValidLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  // 같은 도검이 여러 줄로 저장돼 있으면(깨진 저장값) 한 줄로 합칩니다. 줄마다 따로 재고를 확인하면 주문 때에야 거절됩니다.
  const quantities = new Map<string, number>();
  for (const line of value as Array<Partial<CartLine> | null>) {
    if (typeof line?.swordId !== 'string' || !Number.isFinite(line.quantity) || !(line.quantity! > 0)) continue;
    quantities.set(line.swordId, (quantities.get(line.swordId) ?? 0) + line.quantity!);
  }
  // 저장값이 1~MAX_QUANTITY를 벗어나도 담기·바꾸기와 같은 범위로 맞춥니다.
  return [...quantities].map(([swordId, quantity]) => ({ swordId, quantity: clamp(quantity) }));
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      destination: 'KR',
      add: (swordId, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((line) => line.swordId === swordId);
          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.swordId === swordId ? { ...line, quantity: clamp(line.quantity + quantity) } : line,
              ),
            };
          }
          return { lines: [...state.lines, { swordId, quantity: clamp(quantity) }] };
        }),
      setQuantity: (swordId, quantity) =>
        set((state) => ({
          lines: state.lines.map((line) => (line.swordId === swordId ? { ...line, quantity: clamp(quantity) } : line)),
        })),
      remove: (swordId) => set((state) => ({ lines: state.lines.filter((line) => line.swordId !== swordId) })),
      setDestination: (destination) => set({ destination }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: SITE.cartStorageKey,
      storage: safeJsonStorage,
      skipHydration: true,
      // 저장값 형태가 어긋나도 머리글(모든 화면)과 관세를 계산하는 화면이 멈추지 않게 맞는 값만 받습니다.
      merge: (persisted, current) => {
        const saved = persisted as Partial<CartState> | undefined;
        return {
          ...current,
          lines: toValidLines(saved?.lines),
          destination: toValidDestination(saved?.destination, current.destination),
        };
      },
    },
  ),
);

// 다른 탭에서 장바구니를 바꾸면 이 탭도 다시 불러옵니다(나중에 저장한 탭이 앞 탭의 상품을 지우지 않게).
syncAcrossTabs(useCartStore, SITE.cartStorageKey);

export const selectItemCount = (state: CartState) => state.lines.reduce((sum, line) => sum + line.quantity, 0);
