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
    const text = screen.getByRole('textbox', { name: '후기 내용' });
    // 초점이 닿는 순간 화면 낭독기가 읽을 상태를 기록합니다(초점을 옮긴 뒤에 오류가 붙으면 읽히지 않을 수 있음).
    const onFocus: { invalid: string | null; description: string | null }[] = [];
    text.addEventListener('focus', () =>
      onFocus.push({ invalid: text.getAttribute('aria-invalid'), description: text.getAttribute('aria-describedby') }),
    );
    await user.click(screen.getByRole('button', { name: '후기 등록' }));
    expect(text).toHaveAttribute('aria-invalid', 'true');
    expect(text).toHaveAccessibleDescription(/후기 내용을 입력해 주세요\./);
    expect(text).toHaveFocus();
    expect(onFocus.at(-1)).toEqual({ invalid: 'true', description: text.getAttribute('aria-describedby') });

    // 내용을 쓰면 오류가 사라집니다.
    await user.type(text, '좋은 칼입니다.');
    expect(text).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText('후기 내용을 입력해 주세요.')).not.toBeInTheDocument();
  });

  it('별점 오류도 첫 별점에 초점이 닿을 때 이미 묶음 설명으로 이어져 있다', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm slug="ssangsudo" />);
    const group = screen.getByRole('group', { name: '별점' });
    const first = screen.getAllByRole('radio')[0]!;
    const describedOnFocus: (string | null)[] = [];
    first.addEventListener('focus', () => describedOnFocus.push(group.getAttribute('aria-describedby')));
    await user.click(screen.getByRole('button', { name: '후기 등록' }));
    expect(first).toHaveFocus();
    expect(describedOnFocus.at(-1)).toBeTruthy();
  });
});
