import type { NextConfig } from 'next';

/**
 * 어드민은 쇼핑몰 주소의 /admin 아래에서 열립니다(Next.js multi-zones).
 * 쇼핑몰이 /admin 요청을 이 앱으로 넘기므로, 두 앱이 같은 출처(origin)를 써서
 * 브라우저에 저장한 Mock 데이터와 MSW 서비스 워커를 함께 씁니다.
 */
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
  basePath: '/admin',
  transpilePackages: ['@snb/domain', '@snb/mocks', '@snb/sword-art'],
  reactStrictMode: true,
  async headers() {
    // 어드민만 따로 열렸을 때 워커가 /admin(끝 슬래시 없음) 화면까지 맡을 수 있게 범위를 넓힙니다.
    return [
      { source: '/mockServiceWorker.js', headers: [{ key: 'Service-Worker-Allowed', value: '/admin' }] },
      { source: '/:path*', headers: SECURITY_HEADERS },
    ];
  },
  async redirects() {
    // 어드민 단독 주소로 들어오면 /admin으로 보냅니다.
    return [
      { source: '/', destination: '/admin', basePath: false, permanent: false },
      // public/storybook 폴더 주소(/admin/storybook)로 들어오면 Storybook 첫 화면으로 보냅니다(상대 경로 파일 때문).
      { source: '/storybook', destination: '/storybook/index.html', permanent: false },
    ];
  },
};

export default nextConfig;
