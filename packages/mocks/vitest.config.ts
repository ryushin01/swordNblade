import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // pnpm test:coverage(CI). 하한은 2026-11-16에 잰 값보다 조금 낮게 두어, 테스트가 줄면 실패합니다.
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/**/*.test.*'],
      reporter: ['text-summary'],
      thresholds: { statements: 76, branches: 74, functions: 71, lines: 80 },
    },
  },
});
