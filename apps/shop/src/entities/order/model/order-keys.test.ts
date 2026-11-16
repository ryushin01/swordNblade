import { afterEach, describe, expect, it, vi } from 'vitest';

import { SITE } from '@/shared/config';

import { orderKeyFor, rememberOrderKey } from './order-keys';

describe('order keys', () => {
  afterEach(() => localStorage.clear());

  it('주문 키를 기억하고, 같은 주문은 새 키로 바꾼다', () => {
    rememberOrderKey('SNB-20261116-0001', 'a');
    rememberOrderKey('SNB-20261116-0001', 'b');
    expect(orderKeyFor('SNB-20261116-0001')).toBe('b');
    expect(orderKeyFor('SNB-20261116-0002')).toBeUndefined();
  });

  it('30개를 넘으면 오래된 것부터 지운다', () => {
    for (let n = 1; n <= 31; n++) rememberOrderKey(`SNB-${n}`, `key-${n}`);
    expect(orderKeyFor('SNB-1')).toBeUndefined();
    expect(orderKeyFor('SNB-31')).toBe('key-31');
  });

  it('저장값이 깨져 있으면 없는 것으로 본다', () => {
    localStorage.setItem(SITE.orderKeysStorageKey, '{oops');
    expect(orderKeyFor('SNB-1')).toBeUndefined();
    localStorage.setItem(SITE.orderKeysStorageKey, JSON.stringify({ 'SNB-1': 42 }));
    expect(orderKeyFor('SNB-1')).toBeUndefined();
  });

  it('저장소를 쓸 수 없으면 새로고침 전까지 메모리에 둔다(비회원 주문 조회 뒤 주문 확인)', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('저장소를 쓸 수 없습니다.', 'SecurityError');
    });
    try {
      rememberOrderKey('SNB-20261116-0003', 'memory-key');
      expect(localStorage.getItem(SITE.orderKeysStorageKey)).toBeNull();
      expect(orderKeyFor('SNB-20261116-0003')).toBe('memory-key');
    } finally {
      setItem.mockRestore();
    }
  });
});
