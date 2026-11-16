import { expect, test } from '@playwright/test';

import { expectNoA11yViolations, fillCheckout, resetStorageEachTest } from './support';

resetStorageEachTest();

test('비회원 주문 확인은 주문한 기기에서만 열리고, 다른 기기에서는 주문번호와 이메일로 찾는다', async ({
  page,
  browser,
  baseURL,
}) => {
  await page.goto('/swords/uchigatana');
  await page.getByRole('button', { name: '장바구니에 담기' }).click();
  await expect(page.getByText('우치가타나 1점을 장바구니에 담았습니다.')).toBeVisible();
  await page.goto('/checkout');
  await fillCheckout(page);
  await page.getByRole('button', { name: '결제하기' }).click();
  await expect(page).toHaveURL(/\/orders\/SNB-\d{8}-\d{4}$/);
  const orderId = page.url().split('/').pop()!;
  // 새로고침해도 이 기기에 남긴 주문 키로 열립니다.
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: '주문이 벽에 새겨졌습니다' })).toBeVisible();

  // 주문 키가 없는 다른 기기(같은 Mock 데이터를 옮겨 둠)에서는 주문번호만으로 열리지 않습니다.
  const mockData = await page.evaluate(() => localStorage.getItem('snb-db-v1'));
  const other = await browser.newContext({ baseURL, locale: 'ko-KR' });
  const otherPage = await other.newPage();
  await otherPage.addInitScript((data) => {
    if (data && !localStorage.getItem('snb-db-v1')) localStorage.setItem('snb-db-v1', data);
  }, mockData);
  await otherPage.goto(`/orders/${orderId}`);
  await expect(otherPage.getByRole('heading', { level: 1, name: '주문을 찾을 수 없습니다' })).toBeVisible();
  await otherPage.getByRole('link', { name: '비회원 주문 조회' }).first().click();
  await expect(otherPage.getByRole('heading', { level: 1, name: '비회원 주문 조회' })).toBeVisible();
  await expectNoA11yViolations(otherPage);

  await otherPage.getByRole('textbox', { name: /^주문번호/ }).fill(orderId.toLowerCase());
  await otherPage.getByRole('textbox', { name: /^이메일/ }).fill('wrong@example.com');
  await otherPage.getByRole('button', { name: '주문 찾기' }).click();
  await expect(
    otherPage.getByRole('alert').filter({ hasText: '주문번호와 이메일이 맞는 주문이 없습니다.' }),
  ).toBeFocused();

  await otherPage.getByRole('textbox', { name: /^이메일/ }).fill('BUYER@example.com');
  await otherPage.getByRole('button', { name: '주문 찾기' }).click();
  await expect(otherPage).toHaveURL(new RegExp(`/orders/${orderId}$`));
  await expect(otherPage.getByRole('heading', { level: 1, name: '주문이 벽에 새겨졌습니다' })).toBeVisible();
  await other.close();
});

test('주문 확인을 인쇄하면 머리글·바닥글·버튼 없이 영수증만 남는다', async ({ page }) => {
  await page.goto('/swords/uchigatana');
  await page.getByRole('button', { name: '장바구니에 담기' }).click();
  await expect(page.getByText('우치가타나 1점을 장바구니에 담았습니다.')).toBeVisible();
  await page.goto('/checkout');
  await fillCheckout(page);
  await page.getByRole('button', { name: '결제하기' }).click();
  await expect(page.getByRole('heading', { level: 1, name: '주문이 벽에 새겨졌습니다' })).toBeVisible();
  await expect(page.getByRole('button', { name: '인쇄' })).toBeVisible();

  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('banner')).toBeHidden();
  await expect(page.getByRole('contentinfo')).toBeHidden();
  await expect(page.getByRole('button', { name: '인쇄' })).toBeHidden();
  await expect(page.getByRole('heading', { level: 1, name: '주문이 벽에 새겨졌습니다' })).toBeVisible();
  await expect(page.getByRole('region', { name: '주문 내역' })).toBeVisible();
});

test('상세의 공유하기: 공유 시트가 없으면 도검 주소를 복사하고 알린다', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', '클립보드 권한은 Chromium에서만');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  // 공유 시트가 없는 브라우저로 만듭니다(데스크톱 Chrome 등).
  await page.addInitScript(() => Object.defineProperty(Navigator.prototype, 'share', { value: undefined }));
  await page.goto('/swords/ssangsudo?from=wall');
  await page.getByRole('button', { name: '공유하기' }).click();
  await expect(page.getByText('주소를 복사했습니다.')).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(new URL(copied).pathname).toBe('/swords/ssangsudo');
  expect(new URL(copied).search).toBe('');
});

test('최근 본 도검 기록을 지우면 지웠다는 안내로 초점이 가고, 다시 열어도 기록이 없다', async ({ page }) => {
  await page.goto('/swords/ssangsudo');
  await expect(page.getByRole('heading', { level: 1, name: '쌍수도' })).toBeVisible();
  // 제목은 서버 HTML이라 hydrate 전에도 보이므로, 본 기록이 저장된 뒤에 다음 도검으로 갑니다.
  await page.waitForFunction(() => localStorage.getItem('snb-recent-v1')?.includes('sw-001') ?? false);
  await page.goto('/swords/hwando');
  const recent = page.getByRole('region', { name: '최근 본 도검' });
  await expect(recent.getByRole('link', { name: /쌍수도/ })).toBeVisible();

  await recent.getByRole('button', { name: '기록 지우기' }).click();
  await expect(page.getByText('최근 본 도검 기록을 지웠습니다.')).toBeFocused();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: '환도' })).toBeVisible();
  await expect(page.getByRole('region', { name: '최근 본 도검' })).toHaveCount(0);
});
