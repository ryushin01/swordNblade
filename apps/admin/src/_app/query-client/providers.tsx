'use client';

import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App, ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';

import { ADMIN_THEME } from '@/shared/config';

import 'dayjs/locale/ko';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({ defaultOptions: { queries: { staleTime: 10_000, retry: 1, refetchOnWindowFocus: false } } }),
  );
  return (
    // 기본 테마에서 명도 대비(4.5:1)가 모자란 토큰만 진하게 바꾼 테마(Storybook과 같은 값)
    <ConfigProvider locale={koKR} theme={ADMIN_THEME}>
      <App>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </App>
    </ConfigProvider>
  );
}
