import { SITE } from '@/shared/config';

/** 기억해 둘 주문 키 수. 오래된 것부터 지웁니다. */
const MAX_KEYS = 30;

type OrderKeys = Record<string, string>;

function readKeys(): OrderKeys {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SITE.orderKeysStorageKey) ?? '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([, key]) => typeof key === 'string')) as OrderKeys;
  } catch {
    return {};
  }
}

/**
 * 주문 키를 이 기기에 남깁니다. 주문번호는 날짜+순번이라 짐작하기 쉬워, Mock API는 주문한 기기의 키·주문한 회원·어드민에게만
 * 주문 확인을 엽니다. 저장소를 못 쓰면 이번 화면에서만 열리고, 다른 기기에서는 비회원 주문 조회(주문번호 + 이메일)로 엽니다.
 */
export function rememberOrderKey(id: string, key: string) {
  try {
    const entries = Object.entries(readKeys()).filter(([orderId]) => orderId !== id);
    entries.push([id, key]);
    localStorage.setItem(SITE.orderKeysStorageKey, JSON.stringify(Object.fromEntries(entries.slice(-MAX_KEYS))));
  } catch {
    // 저장하지 못해도 주문은 끝났습니다.
  }
}

export const orderKeyFor = (id: string): string | undefined => readKeys()[id];
