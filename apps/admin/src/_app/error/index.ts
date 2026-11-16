// 오류 경계는 클라이언트 컴포넌트라, 서버 전용 코드(루트 레이아웃)를 내보내는 _app/index.ts와 나눠 둡니다.
export { GlobalError } from './global-error';
export { type ErrorScreenProps, RouteError } from './route-error';
