'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SITE } from '@/shared/config';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );
  // 같은 브라우저의 다른 탭(어드민·쇼핑몰)이 Mock 데이터를 바꾸면 이 탭이 띄워 둔 값(가격·재고·관세율·주문)을 다시 받습니다.
  // 다시 받지 않으면 이미 열린 탭은 캐시(staleTime)가 끝날 때까지 바뀌기 전 값으로 계산했습니다.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === SITE.mockStorageKey || event.key === null) void queryClient.invalidateQueries();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [queryClient]);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
