export const SITE = {
  /** 운영 주소. hreflang·canonical 같은 메타데이터를 절대 주소로 만들 때 씁니다(NEXT_PUBLIC_SITE_URL로 바꿀 수 있음). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://swordnblade-ryushin01.vercel.app',
  name: 'Sword & Blade',
  /** 공유 미리보기와 구조화 데이터에 쓰는 대표 이미지 */
  ogImage: '/og.jpg',
  nameKo: '소드 앤 블레이드',
  description: '동양 도검부터 신화 속 검까지, 석고 벽에 새긴 도검 쇼핑몰 (포트폴리오용 가상 쇼핑몰)',
  /** Mock API 데이터를 저장하는 localStorage 키 */
  /** 어드민(/admin)과 같은 키를 써서 Mock 데이터를 함께 씁니다. */
  mockStorageKey: 'snb-db-v1',
  cartStorageKey: 'snb-cart-v1',
  wishlistStorageKey: 'snb-wishlist-v1',
  recentStorageKey: 'snb-recent-v1',
  /** 로그인 세션 토큰을 두는 localStorage 키 */
  sessionStorageKey: 'snb-session-v1',
  /** 이 기기에서 연 주문의 주문 키(주문번호 → 키). 비회원이 주문 확인을 다시 열 때 씁니다. */
  orderKeysStorageKey: 'snb-order-keys-v1',
} as const;
