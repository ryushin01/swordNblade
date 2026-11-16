'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App, ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';

import { ADMIN_THEME, SITE } from '@/shared/config';

import 'dayjs/locale/ko';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({ defaultOptions: { queries: { staleTime: 10_000, retry: 1, refetchOnWindowFocus: false } } }),
  );
  // 같은 브라우저의 쇼핑몰 탭이 주문하거나 회원이 가입하면(Mock 데이터 변경) 이 탭의 목록·통계를 다시 받습니다.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === SITE.mockStorageKey || event.key === null) void queryClient.invalidateQueries();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [queryClient]);
  return (
    // 기본 테마에서 명도 대비(4.5:1)가 모자란 토큰만 진하게 바꾼 테마(Storybook과 같은 값)
    <ConfigProvider locale={koKR} theme={ADMIN_THEME}>
      <App>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </App>
    </ConfigProvider>
  );
}
