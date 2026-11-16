import { expect, test } from '@playwright/test';

import { expectNoA11yViolations, fillCheckout, resetStorageEachTest, updateSwordAsAdmin } from './support';

resetStorageEachTest();

const cartTable = (page: import('@playwright/test').Page) => page.getByRole('table', { name: /장바구니에 담은 도검/ });

test('저장된 배송 국가가 깨져 있어도 장바구니·상세·주문서가 열리고 대한민국으로 계산한다', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'snb-cart-v1',
      JSON.stringify({ state: { lines: [{ swordId: 'sw-001', quantity: 1 }], destination: 'ZZ' }, version: 0 }),
    ),
  );

  await page.goto('/cart');
  await expect(cartTable(page)).toContainText('쌍수도');
  await expect(page.getByLabel('배송 국가')).toHaveValue('KR');

  await page.goto('/swords/ssangsudo');
  await expect(page.getByRole('heading', { level: 1, name: '쌍수도' })).toBeVisible();
  await expect(page.getByLabel('배송 국가')).toHaveValue('KR');

  await page.goto('/checkout');
  await expect(page.getByRole('heading', { level: 1, name: '주문서' })).toBeVisible();
  await expect(page.getByText(/배송 국가:\s*대한민국/)).toBeVisible();
});

test('두 탭에서 따로 담아도 앞 탭의 상품이 사라지지 않고, 머리글 개수도 함께 바뀐다', async ({ page, context }) => {
  await page.goto('/swords/ssangsudo');
  const other = await context.newPage();
  await other.goto('/swords/hwando');
  await expect(other.getByRole('heading', { level: 1, name: '환도' })).toBeVisible();

  await page.bringToFront();
  await page.getByRole('button', { name: '장바구니에 담기' }).click();
  await expect(page.getByText('쌍수도 1점을 장바구니에 담았습니다.')).toBeVisible();
  // 먼저 열어 둔 다른 탭의 머리글도 다시 불러온 장바구니를 보여 줍니다.
  await expect(other.getByRole('link', { name: /장바구니\s*1점/ })).toBeVisible();

  await other.bringToFront();
  await other.getByRole('button', { name: '장바구니에 담기' }).click();
  await expect(page.getByRole('link', { name: /장바구니\s*2점/ })).toBeVisible();

  await page.goto('/cart');
  await expect(cartTable(page)).toContainText('쌍수도');
  await expect(cartTable(page)).toContainText('환도');
});

test('담은 뒤 품절되면 장바구니가 글자로 알리고, 주문서 대신 장바구니로 안내한다', async ({ page }) => {
  await page.goto('/swords/hwando');
  await page.getByRole('button', { name: '장바구니에 담기' }).click();
  await expect(page.getByText('환도 1점을 장바구니에 담았습니다.')).toBeVisible();
  await updateSwordAsAdmin(page, 'hwando', { stock: 0 });

  await page.goto('/cart');
  await expect(cartTable(page)).toContainText('품절되었습니다. 장바구니에서 삭제해 주세요.');
  await expect(page.getByRole('link', { name: '주문서 작성하기' })).toHaveCount(0);
  await expect(page.getByText('품절되었거나 재고가 모자란 도검을 고친 뒤 주문할 수 있습니다.')).toBeVisible();
  await expectNoA11yViolations(page);

  await page.goto('/checkout');
  await expect(page.getByText(/장바구니에 품절되었거나 재고가 모자란 도검이 있습니다/)).toBeVisible();
  await page.getByRole('link', { name: '장바구니로 가기' }).click();
  await expect(page.getByRole('heading', { level: 1, name: '장바구니' })).toBeVisible();
});

test('주문서를 쓰는 사이 재고가 줄면 어느 도검이 몇 점 남았는지 알리고 장바구니로 안내한다', async ({ page }) => {
  await page.goto('/swords/hwando');
  await page.getByLabel('수량').selectOption('2');
  await page.getByRole('button', { name: '장바구니에 담기' }).click();
  await expect(page.getByText('환도 2점을 장바구니에 담았습니다.')).toBeVisible();

  await page.goto('/checkout');
  await expect(page.getByRole('heading', { level: 1, name: '주문서' })).toBeVisible();
  await fillCheckout(page);
  // 주문서를 쓰는 사이 어드민이 재고를 1점으로 줄입니다.
  await updateSwordAsAdmin(page, 'hwando', { stock: 1 });
  await page.getByRole('button', { name: '결제하기' }).click();

  const alert = page.getByRole('alert').filter({ hasText: '환도의 재고가 1점 남았습니다.' });
  await expect(alert).toBeFocused();
  await expect(page).toHaveURL(/\/checkout$/);
  await expectNoA11yViolations(page);
  await alert.getByRole('link', { name: '장바구니로 가기' }).click();
  await expect(cartTable(page)).toContainText('재고가 1점 남았습니다. 수량을 1점 이하로 줄여 주세요.');
});
