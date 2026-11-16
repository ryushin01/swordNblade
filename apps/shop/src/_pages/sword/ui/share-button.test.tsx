import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/shared/lib/test';

import { ShareButton } from './share-button';

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock('sonner', () => ({ toast }));

describe('ShareButton', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    Reflect.deleteProperty(navigator, 'share');
    toast.success.mockClear();
    toast.error.mockClear();
  });

  it('공유 시트가 있으면 도검 주소(검색 조건 없이)와 이름·소개로 연다', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    window.history.replaceState(null, '', '/swords/ssangsudo?from=wall');
    renderWithProviders(<ShareButton title="쌍수도" text="조선의 양손 도" />);
    await userEvent.click(screen.getByRole('button', { name: '공유하기' }));
    expect(share).toHaveBeenCalledWith({
      title: '쌍수도',
      text: '조선의 양손 도',
      url: `${window.location.origin}/swords/ssangsudo`,
    });
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('공유 시트를 닫으면 아무것도 하지 않고, 공유 시트가 없으면 주소를 복사해 알린다', async () => {
    Object.defineProperty(navigator, 'share', {
      value: vi.fn().mockRejectedValue(new DOMException('닫음', 'AbortError')),
      configurable: true,
    });
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    renderWithProviders(<ShareButton title="쌍수도" text="" />);
    await user.click(screen.getByRole('button', { name: '공유하기' }));
    expect(writeText).not.toHaveBeenCalled();

    Reflect.deleteProperty(navigator, 'share');
    await user.click(screen.getByRole('button', { name: '공유하기' }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('주소를 복사했습니다.'));
    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}${window.location.pathname}`);
  });

  it('복사하지 못하면 주소창에서 복사하라고 알린다', async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));
    renderWithProviders(<ShareButton title="쌍수도" text="" />);
    await user.click(screen.getByRole('button', { name: '공유하기' }));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('주소를 복사하지 못했습니다. 주소창의 주소를 복사해 주세요.'),
    );
  });
});
