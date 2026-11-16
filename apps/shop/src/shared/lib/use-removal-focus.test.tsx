import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { REMOVE_CONTROL_ATTRIBUTE, useRemovalFocus } from './use-removal-focus';

function List() {
  const [items, setItems] = useState(['가', '나', '다']);
  const { fallbackRef, beforeRemove } = useRemovalFocus<HTMLParagraphElement>();
  if (items.length === 0) {
    return (
      <p ref={fallbackRef} tabIndex={-1}>
        비었습니다
      </p>
    );
  }
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>
          <button
            type="button"
            {...{ [REMOVE_CONTROL_ATTRIBUTE]: '' }}
            onClick={(event) => {
              beforeRemove(event.currentTarget);
              setItems((current) => current.filter((value) => value !== item));
            }}
          >
            {item} 빼기
          </button>
        </li>
      ))}
    </ul>
  );
}

describe('useRemovalFocus', () => {
  it('지우면 다음 항목, 마지막이면 앞 항목, 모두 지우면 빈 목록 안내로 초점을 옮긴다', async () => {
    const user = userEvent.setup();
    render(<List />);
    await user.click(screen.getByRole('button', { name: '가 빼기' }));
    expect(screen.getByRole('button', { name: '나 빼기' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: '다 빼기' }));
    expect(screen.getByRole('button', { name: '나 빼기' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: '나 빼기' }));
    expect(screen.getByText('비었습니다')).toHaveFocus();
  });
});
