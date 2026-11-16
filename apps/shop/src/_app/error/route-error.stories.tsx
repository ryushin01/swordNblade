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

/** 화면을 그리다 오류가 나면 머리글·바닥글 안에 보이는 화면. 도구 막대에서 언어를 바꿔 볼 수 있습니다. */
export const Default: Story = {};
