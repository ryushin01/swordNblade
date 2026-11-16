import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/shared/lib/test';

import { RouteError } from './route-error';

const reportError = vi.hoisted(() => vi.fn());
vi.mock('../monitoring', () => ({ reportError }));

describe('RouteError', () => {
  it('화면 언어로 알리고, 다시 시도하면 retry를 부르며 오류를 모니터링으로 보낸다', async () => {
    const retry = vi.fn();
    const error = new Error('boom');
    renderWithProviders(<RouteError error={error} retry={retry} />);
    expect(screen.getByRole('heading', { level: 1, name: '화면을 그리지 못했습니다' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '도검 벽으로 돌아가기' })).toHaveAttribute('href', '/');
    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(retry).toHaveBeenCalledOnce();
    expect(reportError).toHaveBeenCalledWith(error);
  });

  it('영어 화면에서는 영어로 알린다', () => {
    renderWithProviders(<RouteError error="not an Error" retry={vi.fn()} />, { locale: 'en' });
    expect(screen.getByRole('heading', { level: 1, name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the wall' })).toHaveAttribute('href', '/en');
  });
});
