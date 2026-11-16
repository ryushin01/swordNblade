import { expect, type Page, test } from '@playwright/test';

/**
 * README 화면과 사이트 공유 그림 촬영 (pnpm --dir apps/shop screenshots, 먼저 pnpm build).
 * 결과: 저장소 루트의 docs/images/*.jpg와 public/og.jpg. 상품·주문·회원은 모두 브라우저 안 Mock 데이터(가상)입니다.
 * 평소 E2E에는 들어가지 않습니다(SCREENSHOTS=1일 때만 프로젝트가 생김).
 */
const OUT = '../../docs/images';

async function shoot(page: Page, name: string, wait = 800, dir = OUT) {
  await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => {});
  // 한국어 화면은 화면 글자만 담은 KoPub바탕(SnbBatang)을 실제로 받은 뒤 찍습니다. 받지 못했으면 기존 화면을 덮어쓰지 않고 멈춥니다.
  await page.evaluate(() => document.fonts.ready);
  const fallback = await page.evaluate(
    () =>
      document.documentElement.lang === 'ko' &&
      ![...document.fonts].some((face) => face.family.includes('SnbBatang') && face.status === 'loaded'),
  );
  if (fallback) throw new Error('KoPub바탕(SnbBatang)을 받지 못해 화면을 바꾸지 않았습니다.');
  await page.waitForTimeout(wait);
  await page.screenshot({ path: `${dir}/${name}.jpg`, type: 'jpeg', quality: 82 });
}

async function addToCart(page: Page, slug: string) {
  await page.goto(`/swords/${slug}`);
  await page.getByRole('button', { name: '장바구니에 담기' }).click();
  await expect(page.getByText(/장바구니에 담았습니다/)).toBeVisible();
}

// 사이트 공유 그림(1200×630): 첫 화면을 그대로 찍어, 로고·글꼴이 바뀌면 README 화면과 함께 새로 찍힙니다.
test.describe('공유 그림', () => {
  test.use({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

  test('도검의 벽 첫 화면(public/og.jpg)', async ({ page }) => {
    // 배포되는 파일이라, 오류 화면이 뜨면 찍지 않고 멈춰 기존 그림을 지킵니다.
    const response = await page.goto('/');
    expect(response?.ok(), `첫 화면 응답 ${response?.status()}`).toBe(true);
    await expect(page.getByRole('heading', { level: 1, name: '도검의 벽' })).toBeVisible();
    await shoot(page, 'og', 1500, 'public');
  });
});

test.describe('데스크톱', () => {
  test.use({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

  test('도검의 벽·상세·비교·영어 상세', async ({ page }) => {
    await page.goto('/');
    await shoot(page, 'shop-home', 1500);
    await page.goto('/swords/ssangsudo');
    await shoot(page, 'shop-detail', 1500);
    await page.goto('/compare?a=ssangsudo&b=claymore&c=wakizashi');
    await expect(page.getByRole('table', { name: '고른 도검의 제원 비교' })).toBeVisible();
    await shoot(page, 'shop-compare', 1500);
    await page.goto('/en/swords/ssangsudo');
    await shoot(page, 'shop-en-detail', 1500);
  });

  test('장바구니·주문서 오류·찜 목록·회원가입·어드민', async ({ page }) => {
    test.setTimeout(180_000);
    // 국내 출고와 영국 출고 상품을 함께 담습니다.
    await addToCart(page, 'ssangsudo');
    await addToCart(page, 'longsword');
    await page.goto('/cart');
    await shoot(page, 'shop-cart');

    await page.goto('/checkout');
    await page.getByRole('button', { name: /결제/ }).first().click();
    await expect(page.getByRole('alert').first()).toBeVisible();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await shoot(page, 'shop-checkout-errors');

    for (const slug of ['ssangsudo', 'hwando', 'uchigatana', 'longsword']) {
      await page.goto(`/swords/${slug}`);
      await page.getByRole('button', { name: '찜하기' }).click();
      await page.waitForTimeout(300);
    }
    await page.goto('/wishlist');
    await expect(page.getByRole('heading', { level: 1, name: '찜 목록' })).toBeVisible();
    await shoot(page, 'shop-wishlist');

    await page.goto('/signup');
    await page.getByLabel(/^이름/).fill('홍길동');
    await page.getByLabel(/^이메일/).fill('demo@example.com');
    await shoot(page, 'shop-signup');
    await page
      .getByLabel(/^비밀번호/)
      .first()
      .fill('demo-pass-1234');
    const confirm = page.getByLabel(/비밀번호 확인/);
    if (await confirm.count()) await confirm.fill('demo-pass-1234');
    await page.getByRole('button', { name: /가입/ }).last().click();
    await page.waitForTimeout(1500);

    await page.goto('/admin/login');
    await page.getByRole('button', { name: '데모 계정으로 로그인' }).click();
    await expect(page.getByRole('heading', { level: 1, name: '대시보드' })).toBeVisible();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/admin-dashboard.jpg`, type: 'jpeg', quality: 82 });
    await page.goto('/admin/users');
    await expect(page.getByRole('row').filter({ hasText: 'demo@example.com' })).toBeVisible();
    await page.screenshot({ path: `${OUT}/admin-users.jpg`, type: 'jpeg', quality: 82 });
    await page.goto('/admin/products/sw-001');
    await expect(page.getByRole('heading', { level: 1, name: /수정$/ })).toBeVisible();
    await expect(page.getByRole('textbox').first()).not.toHaveValue('');
    await page.screenshot({ path: `${OUT}/admin-product-edit.jpg`, type: 'jpeg', quality: 82 });
  });
});

test.describe('모바일', () => {
  test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  test('영어 첫 화면·상세·전설 분류', async ({ page }) => {
    await page.goto('/en');
    await shoot(page, 'shop-en-mobile', 1500);
    await page.goto('/swords/ssangsudo');
    await shoot(page, 'shop-mobile-detail', 1500);
    await page.goto('/?category=legend');
    await page.getByLabel(/이름으로 찾기/).scrollIntoViewIfNeeded();
    await page.getByLabel(/이름으로 찾기/).evaluate((el) => {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: 'instant' });
    });
    await shoot(page, 'shop-mobile-legend', 1200);
  });
});
