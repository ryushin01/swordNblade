import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

/*
 * 오프라인 검사: 사이트 밖으로 나가는 요청을 모두 끊은 채 어드민 주요 화면이 내용과 함께 뜨는지 봅니다.
 * 자료는 브라우저 Mock API(MSW)와 시드 JSON, 일러스트는 코드(SVG)라 바깥 요청이 없어야 합니다.
 * 테스트용 빌드에는 .env가 없어 Sentry도 켜지지 않습니다. 운영 주소를 검사할 때(E2E_BASE_URL)는 그 주소만 열어 둡니다.
 */

async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
}

let blocked: string[] = [];

test.beforeEach(async ({ page, context, baseURL }) => {
  const allowed = new Set(['localhost', '127.0.0.1', new URL(baseURL ?? 'http://localhost').hostname]);
  blocked = [];
  await context.route(
    (url) => !allowed.has(url.hostname),
    (route) => {
      blocked.push(route.request().url());
      return route.abort('internetdisconnected');
    },
  );
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('__e2e_reset__')) {
      localStorage.clear();
      sessionStorage.setItem('__e2e_reset__', '1');
    }
  });
});

test.afterEach(() => {
  expect(blocked).toEqual([]);
});

test('오프라인: 데모 로그인 뒤 대시보드·상품·상품 수정·주문이 내용과 함께 뜬다', async ({ page }) => {
  await page.goto('/admin/login');
  await expectNoA11yViolations(page);
  await page.getByRole('button', { name: '데모 계정으로 로그인' }).click();
  await expect(page.getByRole('heading', { level: 1, name: '대시보드' })).toBeVisible();
  await expect(page.getByText('334', { exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'SNB-20261103-0002' })).toBeVisible();
  await expectNoA11yViolations(page);

  await page.goto('/admin/products');
  await expect(page.getByRole('heading', { level: 1, name: '상품' })).toBeVisible();
  await page.getByRole('link', { name: '환도 수정' }).click();
  await expect(page.getByRole('heading', { level: 1, name: '환도 수정' })).toBeVisible();
  await expect(page.getByRole('img', { name: /환도 일러스트 미리보기/ })).toBeVisible();
  await expectNoA11yViolations(page);

  await page.goto('/admin/orders');
  await expect(page.getByRole('heading', { level: 1, name: '주문' })).toBeVisible();
  await expectNoA11yViolations(page);
});
