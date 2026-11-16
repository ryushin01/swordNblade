import { afterEach, describe, expect, it } from 'vitest';

import { SITE } from '@/shared/config';

import { useSessionStore } from './store';

describe('session store', () => {
  afterEach(() => {
    localStorage.clear();
    useSessionStore.setState({ token: null });
  });

  it('저장된 토큰을 되살린다', async () => {
    localStorage.setItem(SITE.sessionStorageKey, JSON.stringify({ state: { token: 'abc' }, version: 0 }));
    await useSessionStore.persist.rehydrate();
    expect(useSessionStore.getState().token).toBe('abc');
  });

  it('저장값이 없어지면(다른 탭이 저장소를 비움) 로그아웃 상태가 된다', async () => {
    useSessionStore.setState({ token: 'abc' });
    localStorage.removeItem(SITE.sessionStorageKey);
    await useSessionStore.persist.rehydrate();
    expect(useSessionStore.getState().token).toBeNull();
  });

  it('토큰 모양이 맞지 않으면 로그아웃 상태로 본다', async () => {
    localStorage.setItem(SITE.sessionStorageKey, JSON.stringify({ state: { token: 42 }, version: 0 }));
    await useSessionStore.persist.rehydrate();
    expect(useSessionStore.getState().token).toBeNull();
  });
});
