import { fn } from 'storybook/test';

import { RouteError } from './route-error';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'app/RouteError',
  component: RouteError,
  args: { error: new Error('스토리 예시 오류'), retry: fn() },
} satisfies Meta<typeof RouteError>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 화면을 그리다 오류가 나면 관리 메뉴 안에 보이는 화면 */
export const Default: Story = {};
