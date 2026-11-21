import { expect, test } from '@playwright/test';

import { expectNoA11yViolations, resetStorageEachTest } from './support';

/*
 * 오프라인 검사: 사이트 밖으로 나가는 요청을 모두 끊은 채 쇼핑몰과 어드민(/admin)이 내용과 함께 뜨는지 봅니다.
 * 도검 자료는 브라우저 Mock API(MSW)와 시드 JSON, 일러스트는 코드(SVG), 글꼴은 저장소 파일이라 바깥 요청이 없어야 합니다.
 * 테스트용 빌드에는 .env가 없어 Sentry도 켜지지 않습니다.
 * 운영 주소를 검사할 때(E2E_BASE_URL)는 그 주소만 열어 둡니다.
 */

resetStorageEachTest();

let blocked: string[] = [];

test.beforeEach(async ({ context, baseURL }) => {
  const allowed = new Set(['localhost', '127.0.0.1', new URL(baseURL ?? 'http://localhost').hostname]);
  blocked = [];
  await context.route(
    (url) => !allowed.has(url.hostname),
    (route) => {
      blocked.push(route.request().url());
      return route.abort('internetdisconnected');
    },
  );
});

test.afterEach(() => {
  expect(blocked).toEqual([]);
});

test('오프라인: 쇼핑몰 도검의 벽·상세·영어 화면이 내용과 함께 뜬다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: '도검의 벽' })).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: '334점 가운데 1–24번째' })).toBeVisible();
  await expectNoA11yViolations(page);

  await page.goto('/swords/ssangsudo');
  await expect(page.getByRole('heading', { level: 1, name: '쌍수도' })).toBeVisible();
  await expect(page.getByRole('img', { name: /쌍수도 부조 일러스트/ })).toBeVisible();
  await expectNoA11yViolations(page);

  await page.goto('/en');
  await expect(page.getByRole('heading', { level: 1, name: 'The Wall of Blades' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Excalibur.*₩12,000,000/ })).toBeVisible();
  await expectNoA11yViolations(page);
});

test('오프라인: 어드민(/admin) 데모 로그인·대시보드·상품·주문이 내용과 함께 뜬다', async ({ page }) => {
  await page.goto('/admin/login');
  await page.getByRole('button', { name: '데모 계정으로 로그인' }).click();
  await expect(page.getByRole('heading', { level: 1, name: '대시보드' })).toBeVisible();
  await expect(page.getByText('334', { exact: true })).toBeVisible();

  await page.goto('/admin/products');
  await expect(page.getByRole('heading', { level: 1, name: '상품' })).toBeVisible();
  await expect(page.getByRole('link', { name: '환도 수정' })).toBeVisible();

  await page.goto('/admin/orders');
  await expect(page.getByRole('heading', { level: 1, name: '주문' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'SNB-20261103-0002' })).toBeVisible();
});
