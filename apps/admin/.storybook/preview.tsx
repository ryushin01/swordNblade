import { App, ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';

import { ADMIN_THEME } from '../src/shared/config';

import type { Preview } from '@storybook/nextjs-vite';

const preview: Preview = {
  // 접근성 위반이 있으면 스토리 테스트를 실패로 처리합니다.
  parameters: { layout: 'centered', nextjs: { appDirectory: true }, a11y: { test: 'error' } },
  decorators: [
    (Story) => (
      // 앱과 같은 테마(명도 대비를 맞춘 토큰)로 그려 접근성 검사가 실제 화면과 같게 합니다.
      <ConfigProvider locale={koKR} theme={ADMIN_THEME}>
        <App>
          <div lang="ko">
            <Story />
          </div>
        </App>
      </ConfigProvider>
    ),
  ],
};

export default preview;
