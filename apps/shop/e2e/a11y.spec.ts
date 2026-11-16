import { expect, test } from '@playwright/test';

import { resetStorageEachTest } from './support';

resetStorageEachTest();

test('장바구니 줄을 지우면 다음 줄의 삭제 버튼으로, 모두 지우면 빈 장바구니 안내로 초점이 간다', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, '키보드 검사는 데스크톱에서만');
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'snb-cart-v1',
      JSON.stringify({
        state: {
          lines: [
            { swordId: 'sw-001', quantity: 1 },
            { swordId: 'sw-002', quantity: 1 },
          ],
          destination: 'KR',
        },
        version: 0,
      }),
    ),
  );
  await page.goto('/cart');
  await page.getByRole('button', { name: /^삭제\s*:\s*쌍수도$/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /^삭제\s*:\s*환도$/ })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('장바구니가 비어 있습니다.')).toBeFocused();
});

test('찜을 빼면 다음 칸의 빼기 버튼으로, 모두 빼면 빈 찜 목록 안내로 초점이 간다', async ({ page, isMobile }) => {
  test.skip(isMobile, '키보드 검사는 데스크톱에서만');
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem('snb-wishlist-v1', JSON.stringify({ state: { ids: ['sw-001', 'sw-002'] }, version: 0 })),
  );
  await page.goto('/wishlist');
  await page.getByRole('button', { name: '쌍수도 찜 해제' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: '환도 찜 해제' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('아직 찜한 도검이 없습니다.')).toBeFocused();
});

test('404 화면은 제목으로 다른 화면과 구분된다', async ({ page }) => {
  await page.goto('/no-such-page');
  await expect(page).toHaveTitle('이 자리에는 아무것도 새겨져 있지 않습니다 · Sword & Blade');
  await page.goto('/en/no-such-page');
  await expect(page).toHaveTitle('Nothing is carved in this spot · Sword & Blade');
});

test('시드에 없는 도검 주소(서버 HTML이 빈 화면)는 검색 엔진이 색인하지 않는다', async ({ request }) => {
  const missing = await (await request.get('/swords/no-such-sword')).text();
  expect(missing).toMatch(/<meta name="robots" content="noindex"/);
  const seed = await (await request.get('/swords/ssangsudo')).text();
  expect(seed).not.toMatch(/<meta name="robots"/);
});

test('보안 헤더가 쇼핑몰·어드민·Storybook 응답에 한 번씩 붙고, Storybook은 같은 출처 iframe으로 열린다', async ({
  page,
  request,
}) => {
  for (const path of ['/', '/swords/ssangsudo', '/en/cart', '/admin', '/admin/login', '/storybook/index.html']) {
    const headers = (await request.get(path)).headers();
    expect(headers['x-content-type-options'], path).toBe('nosniff');
    // 쇼핑몰이 /admin을 어드민 앱으로 넘길 때 두 앱의 헤더가 겹치면 'SAMEORIGIN, SAMEORIGIN'이 됩니다.
    expect(headers['x-frame-options'], path).toBe('SAMEORIGIN');
    expect(headers['referrer-policy'], path).toBe('strict-origin-when-cross-origin');
    expect(headers['content-security-policy'], path).toBe(
      "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
    );
    expect(headers['permissions-policy'], path).toContain('camera=()');
  }
  await page.goto('/storybook/index.html');
  await expect(page.frameLocator('#storybook-preview-iframe').locator('#storybook-root')).not.toBeEmpty({
    timeout: 30_000,
  });
});
