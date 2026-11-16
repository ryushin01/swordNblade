import { pushRecent, useRecentStore } from './recent-store';

describe('pushRecent', () => {
  it('맨 앞에 넣고 중복을 없애며 개수를 제한한다', () => {
    expect(pushRecent(['a', 'b'], 'b')).toEqual(['b', 'a']);
    expect(pushRecent(['a', 'b', 'c'], 'd', 3)).toEqual(['d', 'a', 'b']);
  });
});

describe('useRecentStore', () => {
  it('기록을 모두 지운다', () => {
    useRecentStore.getState().record('sw-001');
    useRecentStore.getState().record('sw-002');
    useRecentStore.getState().clear();
    expect(useRecentStore.getState().ids).toEqual([]);
  });
});
