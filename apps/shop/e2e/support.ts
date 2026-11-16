import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

/** 테스트마다 깨끗한 Mock DB, 장바구니, 로그인 상태로 시작합니다(탭마다 첫 이동에서 한 번 비움). */
export function resetStorageEachTest() {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      if (!sessionStorage.getItem('__e2e_reset__')) {
        localStorage.clear();
        sessionStorage.setItem('__e2e_reset__', '1');
      }
    });
  });
}

/** 화면 전환(SSGOI)이 끝날 때까지 기다립니다. 전환 중에는 떠나는 화면과 들어오는 화면이 겹치고 투명도가 바뀝니다. */
export async function waitForPageTransition(page: Page) {
  await expect(page.locator('[data-ssgoi-transition]')).toHaveCount(1);
  // SSGOI는 Element.animate로 움직입니다. 스크롤에 묶인 CSS 애니메이션(상세의 부조 연출 등)은 계속 도므로 세지 않습니다.
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .filter((a) => !(a instanceof CSSAnimation) && !(a instanceof CSSTransition))
      .every((a) => a.playState !== 'running'),
  );
}

export async function expectNoA11yViolations(page: Page) {
  await waitForPageTransition(page);
  // 화면 전환 직후에는 문서 제목이 잠시 비어 있어 document-title로 잘못 잡히므로 제목이 채워진 뒤에 검사합니다.
  await expect(page).toHaveTitle(/\S/);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
}

/** 어드민이 상품 값을 바꾼 상황을 만듭니다(브라우저 안 Mock API로 어드민 로그인 뒤 PUT). */
export async function updateSwordAsAdmin(page: Page, slug: string, patch: Record<string, unknown>) {
  await page.evaluate(
    async ({ slug, patch }) => {
      const login = await fetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@example.com', password: 'demo1234' }),
      });
      const { token } = (await login.json()) as { token: string };
      const sword = (await (await fetch(`/api/swords/${slug}`)).json()) as { id: string };
      const response = await fetch(`/api/swords/${sword.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...sword, ...patch }),
      });
      if (!response.ok) throw new Error(`상품을 바꾸지 못했습니다: ${response.status}`);
    },
    { slug, patch },
  );
}

/** 주문서 칸을 모두 맞게 채웁니다. 허가 안내가 있으면 확인합니다. */
export async function fillCheckout(page: Page) {
  await page.getByLabel(/^받는 분/).fill('김가상');
  await page.getByLabel(/^이메일/).fill('buyer@example.com');
  await page.getByLabel(/^연락처/).fill('010-0000-0000');
  await page.getByLabel(/^우편번호/).fill('03000');
  await page.getByLabel(/^주소/).fill('서울특별시 종로구 가상로 1');
  await page.getByRole('radio', { name: /신용카드/ }).check();
  const permit = page.getByRole('checkbox', { name: /허가를 받았거나/ });
  if (await permit.count()) await permit.check();
}
