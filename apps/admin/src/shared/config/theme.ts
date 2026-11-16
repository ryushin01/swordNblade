import type { ThemeConfig } from 'antd';

/**
 * 어드민 테마. 기본 테마에서 명도 대비(4.5:1)가 모자란 토큰만 Ant Design 팔레트 안의 진한 색으로 바꿉니다.
 * 앱(_app/query-client)과 Storybook이 같은 값을 써서 스토리의 접근성 검사가 실제 화면과 같게 됩니다.
 */
export const ADMIN_THEME: ThemeConfig = {
  token: {
    colorPrimary: '#0958d9',
    colorLink: '#0958d9',
    colorError: '#cf1322',
    colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
    colorTextDescription: 'rgba(0, 0, 0, 0.65)',
    colorTextPlaceholder: 'rgba(0, 0, 0, 0.6)',
  },
};
