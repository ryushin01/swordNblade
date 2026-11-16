interface PersistedStore {
  persist: {
    hasHydrated: () => boolean;
    rehydrate: () => Promise<void> | void;
  };
}

/**
 * 같은 브라우저의 다른 탭이 저장값(localStorage의 key)을 바꾸면 이 탭의 persist 저장소를 다시 불러옵니다.
 * zustand persist는 다른 탭의 변경을 듣지 않아, 두 탭에서 각각 바꾸면 나중에 저장한 탭이 앞 탭의 변경을 지웠습니다.
 * 아직 불러오기 전(서버 렌더와 맞추는 중)이면 건너뜁니다. 탭 하나에 저장소마다 한 번만 듣습니다.
 * 같은 값으로 저장하면 storage 이벤트가 나지 않으므로 탭끼리 서로를 계속 깨우지 않습니다.
 */
export function syncAcrossTabs(store: PersistedStore, key: string): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const onStorage = (event: StorageEvent) => {
    // key가 null이면 다른 탭이 저장소 전체를 비운 것입니다.
    if (event.key !== null && event.key !== key) return;
    if (!store.persist.hasHydrated()) return;
    void store.persist.rehydrate();
  };
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
}
