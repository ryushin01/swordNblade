'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { setApiAuthToken } from '@/shared/api';
import { SITE } from '@/shared/config';
import { safeJsonStorage } from '@/shared/lib/safe-storage';
import { syncAcrossTabs } from '@/shared/lib/sync-across-tabs';

interface SessionState {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => {
        setApiAuthToken(token);
        set({ token });
      },
    }),
    {
      name: SITE.sessionStorageKey,
      storage: safeJsonStorage,
      // 서버 렌더와 어긋나지 않게 마운트 뒤에 불러옵니다(useSessionHydrated).
      skipHydration: true,
      // 저장값이 없거나(다른 탭이 저장소를 비움) 모양이 맞지 않으면 로그아웃 상태로 봅니다.
      // 기본 merge는 지금 상태를 그대로 두어, 다른 탭이 저장소를 비워도 이 탭의 토큰이 남았습니다.
      merge: (persisted, current) => {
        const token = (persisted as { token?: unknown } | undefined)?.token;
        return { ...current, token: typeof token === 'string' && token ? token : null };
      },
      // 저장된 토큰을 되살리면 API 요청에도 붙도록 알려 줍니다.
      onRehydrateStorage: () => (state) => setApiAuthToken(state?.token ?? null),
    },
  ),
);

// 다른 탭에서 로그인·로그아웃하면 이 탭도 따릅니다(되살린 토큰은 onRehydrateStorage가 API 요청에 붙임).
syncAcrossTabs(useSessionStore, SITE.sessionStorageKey);
