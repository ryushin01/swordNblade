import { afterEach, describe, expect, it, vi } from 'vitest';

import { syncAcrossTabs } from './sync-across-tabs';

const fakeStore = (hydrated = true) => ({
  persist: { hasHydrated: () => hydrated, rehydrate: vi.fn() },
});

const fire = (key: string | null) => window.dispatchEvent(new StorageEvent('storage', { key }));

describe('syncAcrossTabs', () => {
  const stops: Array<() => void> = [];
  afterEach(() => stops.splice(0).forEach((stop) => stop()));

  it('다른 탭이 같은 키를 바꾸거나 저장소를 비우면 다시 불러온다', () => {
    const store = fakeStore();
    stops.push(syncAcrossTabs(store, 'snb-cart-v1'));
    fire('snb-cart-v1');
    fire(null);
    expect(store.persist.rehydrate).toHaveBeenCalledTimes(2);
  });

  it('다른 키는 무시한다', () => {
    const store = fakeStore();
    stops.push(syncAcrossTabs(store, 'snb-cart-v1'));
    fire('snb-wishlist-v1');
    expect(store.persist.rehydrate).not.toHaveBeenCalled();
  });

  it('아직 불러오기 전(서버 렌더와 맞추는 중)이면 건너뛴다', () => {
    const store = fakeStore(false);
    stops.push(syncAcrossTabs(store, 'snb-cart-v1'));
    fire('snb-cart-v1');
    expect(store.persist.rehydrate).not.toHaveBeenCalled();
  });
});
