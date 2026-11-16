import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RouteError } from './route-error';

describe('RouteError', () => {
  it('오류를 알리고 다시 시도하거나 대시보드로 갈 수 있다', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const retry = vi.fn();
    render(<RouteError error={new Error('boom')} retry={retry} />);
    expect(screen.getByRole('heading', { level: 1, name: '화면을 그리지 못했습니다' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '대시보드로 가기' })).toHaveAttribute('href', '/');
    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
