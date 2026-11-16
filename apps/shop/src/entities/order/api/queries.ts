'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiFetch, ApiRequestError } from '@/shared/api';

import { orderKeyFor, rememberOrderKey } from '../model/order-keys';

import type { Order } from '@snb/domain';
import type { CreateOrderBody } from '@snb/mocks';

/** 주문 확인. 이 기기에서 주문했거나 비회원 주문 조회로 찾은 주문은 주문 키를 함께 보냅니다(회원은 로그인으로 엽니다). */
export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => {
      const key = orderKeyFor(id);
      return apiFetch<Order>(
        `/api/orders/${encodeURIComponent(id)}`,
        key ? { headers: { 'X-Order-Key': key } } : undefined,
      );
    },
  });
}

/** 비회원 주문 조회: 주문번호와 주문할 때 쓴 이메일이 맞으면 주문 키를 받아 이 기기에 남깁니다. */
export function useLookupOrder() {
  return useMutation({
    mutationFn: (body: { id: string; email: string }) =>
      apiFetch<{ id: string; accessKey: string }>('/api/orders/lookup', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: ({ id, accessKey }) => rememberOrderKey(id, accessKey),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateOrderBody) =>
      apiFetch<Order>('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: (order) => {
      // 주문 확인을 이 기기에서 다시 열 수 있게 주문 키를 남깁니다.
      if (order.accessKey) rememberOrderKey(order.id, order.accessKey);
      queryClient.setQueryData(['orders', order.id], order);
      // 재고가 바뀌었으므로 상품 목록을 새로 받습니다.
      void queryClient.invalidateQueries({ queryKey: ['swords'] });
    },
    onError: (error) => {
      // 주문하는 사이 금액이 바뀌었으면 가격과 관세율을 새로 받아 주문서에 바뀐 금액을 보여 줍니다.
      if (error instanceof ApiRequestError && error.code === 'price-changed') {
        void queryClient.invalidateQueries({ queryKey: ['swords'] });
        void queryClient.invalidateQueries({ queryKey: ['customs-config'] });
      }
      // 재고가 줄었으면 상품을 새로 받아 장바구니가 품절·재고 부족을 알리게 합니다.
      if (error instanceof ApiRequestError && error.code === 'out-of-stock') {
        void queryClient.invalidateQueries({ queryKey: ['swords'] });
      }
    },
  });
}

export type { CreateOrderBody };
