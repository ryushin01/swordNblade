import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const alias = { '@': fileURLToPath(new URL('./src', import.meta.url)) };

export default defineConfig({
  test: {
    // pnpm test:coverage(CI)는 단위 테스트(unit)만 잽니다. 하한은 2026-11-16에 잰 값보다 조금 낮게 둡니다.
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/**/*.test.*', 'src/**/*.stories.tsx', 'src/app/**'],
      reporter: ['text-summary'],
      thresholds: { statements: 51, branches: 48, functions: 45, lines: 51 },
    },
    projects: [
      /** 단위·컴포넌트 테스트 (pnpm test, 커밋 전 검사) */
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: 'unit',
          environment: 'jsdom',
          env: { NEXT_PUBLIC_API_MOCKING: 'off' },
          globals: true,
          setupFiles: ['./vitest.setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
          // next-intl이 next/navigation을 확장자 없이 불러와 Node가 못 찾으므로 Vite가 풀게 합니다.
          server: { deps: { inline: ['next-intl'] } },
        },
      },
      /**
       * 스토리 테스트 (pnpm test:storybook, CI)
       * 모든 스토리를 실제 브라우저(Chromium)에서 렌더링하고 접근성 검사(axe)를 실행합니다.
       */
      {
        plugins: [storybookTest({ configDir: '.storybook' })],
        resolve: { alias },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['./.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
