import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/shared/lib/test';

import { ReviewForm } from './reviews';

describe('ReviewForm', () => {
  it('별점을 고르지 않으면 별점 묶음에 오류를 잇고 첫 별점으로 초점을 옮긴다', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm slug="ssangsudo" />);
    await user.click(screen.getByRole('button', { name: '후기 등록' }));
    expect(screen.getByRole('group', { name: '별점' })).toHaveAccessibleDescription('별점을 골라 주세요.');
    expect(screen.getAllByRole('radio')[0]).toHaveFocus();
    // 별점을 고르면 오류가 사라집니다.
    await user.click(screen.getAllByRole('radio')[1]!);
    expect(screen.queryByText('별점을 골라 주세요.')).not.toBeInTheDocument();
  });

  it('내용이 비면 내용 칸을 틀린 칸으로 표시하고 오류를 이어 읽게 한 뒤 초점을 옮긴다', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm slug="ssangsudo" />);
    await user.click(screen.getAllByRole('radio')[0]!);
    await user.click(screen.getByRole('button', { name: '후기 등록' }));
    const text = screen.getByRole('textbox', { name: '후기 내용' });
    expect(text).toHaveAttribute('aria-invalid', 'true');
    expect(text).toHaveAccessibleDescription(/후기 내용을 입력해 주세요\./);
    expect(text).toHaveFocus();
  });
});
