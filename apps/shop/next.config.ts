import createNextIntlPlugin from 'next-intl/plugin';

import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/shared/i18n/request.ts');

/**
 * 어드민 앱 주소. /admin 요청을 이 주소로 넘겨 같은 출처에서 어드민을 엽니다(Next.js multi-zones).
 * 빌드할 때 정해지며, 로컬 E2E처럼 다른 어드민 서버를 쓸 때는 ADMIN_ORIGIN으로 바꿉니다.
 * 운영 어드민 주소는 Vercel에서 빌드할 때(VERCEL=1)만 씁니다. 로컬 빌드는 옆에서 띄운 어드민(`pnpm --filter @snb/admin start`, 3001)으로
 * 넘겨, 인터넷이 없어도 `/admin`이 열립니다.
 */
const ADMIN_ORIGIN =
  process.env.ADMIN_ORIGIN ??
  (process.env.VERCEL === '1' ? 'https://swordnblade-admin-ryushin01.vercel.app' : 'http://localhost:3001');

/**
 * 보안 헤더(두 앱이 같은 값을 씁니다). Storybook(/storybook)이 같은 출처의 iframe으로 스토리를 그리므로 같은 출처의 프레임만 허용합니다.
 * CSP는 Next 인라인 스크립트를 막지 않는 지시어(프레임·base·폼 대상·object)만 둡니다.
 */
const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
];

const nextConfig: NextConfig = {
  transpilePackages: ['@snb/domain', '@snb/mocks', '@snb/sword-art'],
  reactStrictMode: true,
  async headers() {
    // /admin은 어드민 앱으로 넘기고 어드민이 같은 헤더를 붙이므로 뺍니다(겹치면 X-Frame-Options가 두 번 붙음).
    return [{ source: '/((?!admin).*)', headers: SECURITY_HEADERS }];
  },
  async redirects() {
    // public/storybook 폴더 주소로 들어오면 Storybook 첫 화면으로 보냅니다.
    // 재작성(rewrite)하면 주소가 /storybook으로 남아 Storybook의 상대 경로 파일을 못 찾으므로 주소를 바꿉니다.
    return [{ source: '/storybook', destination: '/storybook/index.html', permanent: false }];
  },
  async rewrites() {
    return [
      { source: '/admin', destination: `${ADMIN_ORIGIN}/admin` },
      { source: '/admin/:path*', destination: `${ADMIN_ORIGIN}/admin/:path*` },
    ];
  },
};

export default withNextIntl(nextConfig);
