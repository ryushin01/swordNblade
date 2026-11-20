/**
 * 어드민 데모 계정. 로그인 화면에 공개하는 값이며 실제 비밀이 아닙니다.
 * 로그인 화면이 Mock API 처리기(msw)까지 싣지 않도록 따로 둡니다(@snb/mocks/admin-account).
 */
export const ADMIN_DEMO_ACCOUNT = { email: 'admin@example.com', password: 'demo1234' };
