import { SEED_SWORDS } from '@snb/mocks';

import { localizeForLocale, orderLineName } from './localize';

const seed = SEED_SWORDS[0]!;

describe('localizeForLocale', () => {
  it('영어 화면은 도검에 담긴 영어 글을 쓴다', () => {
    expect(localizeForLocale(seed, 'en').summary).toBe(seed.translations?.en?.summary);
  });

  it('어드민에서 영어 글을 비운 도검(빈 translations)은 한국어 원문을 쓴다', () => {
    const cleared = { ...seed, translations: {} };
    const sword = localizeForLocale(cleared, 'en');
    expect(sword.name).toBe('Ssangsudo');
    expect(sword.summary).toBe(seed.summary);
  });
});

describe('orderLineName', () => {
  it('영어 화면은 주문할 때 남긴 영어 이름을 쓴다', () => {
    expect(orderLineName({ name: '쌍수도', nameEn: 'Ssangsudo' }, 'en')).toBe('Ssangsudo');
  });

  it('영어 이름이 없는 예전 주문 줄과 한국어 화면은 저장된 이름을 쓴다', () => {
    expect(orderLineName({ name: '쌍수도' }, 'en')).toBe('쌍수도');
    expect(orderLineName({ name: '쌍수도', nameEn: 'Ssangsudo' }, 'ko')).toBe('쌍수도');
  });
});
