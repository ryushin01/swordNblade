import { useQuery } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SITE } from '@/shared/config';

import { Providers } from './providers';

function Probe({ load }: { load: () => Promise<number> }) {
  const { data } = useQuery({ queryKey: ['probe'], queryFn: load });
  return <p>{`value ${data ?? '-'}`}</p>;
}

describe('Providers', () => {
  it('다른 탭이 Mock 데이터를 바꾸면 띄워 둔 쿼리를 다시 받고, 다른 키는 무시한다', async () => {
    let calls = 0;
    const load = vi.fn(async () => ++calls);
    render(
      <Providers>
        <Probe load={load} />
      </Providers>,
    );
    await waitFor(() => expect(screen.getByText('value 1')).toBeInTheDocument());

    act(() => void window.dispatchEvent(new StorageEvent('storage', { key: 'snb-cart-v1' })));
    act(() => void window.dispatchEvent(new StorageEvent('storage', { key: SITE.mockStorageKey })));
    await waitFor(() => expect(screen.getByText('value 2')).toBeInTheDocument());
    expect(load).toHaveBeenCalledTimes(2);
  });
});
