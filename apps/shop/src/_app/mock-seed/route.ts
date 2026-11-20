import { SEED_BUNDLE } from '@snb/mocks/seed-bundle';

/**
 * 브라우저 Mock API가 시작할 때 받는 시드(도검·주문·들어온 버전 표).
 * 카탈로그 코드를 화면 자바스크립트에 싣지 않으려고 빌드할 때 JSON으로 만들어 둡니다.
 */
export function GET() {
  return Response.json(SEED_BUNDLE);
}
