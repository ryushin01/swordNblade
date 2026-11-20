import { describe, expect, it } from 'vitest';

import { isHistorical } from '@snb/domain';

import { SEED_SWORDS } from '../seed';
import { seedAddedIn } from '../seed-bundle';
import { CATALOG_V11_IDS, CATALOG_V12_IDS, CATALOG_V13_IDS } from './index';

describe('시드 도검 목록', () => {
  it('id, 주소(slug), 이름이 겹치지 않는다', () => {
    for (const key of ['id', 'slug', 'name', 'nameEn'] as const) {
      const values = SEED_SWORDS.map((sword) => sword[key]);
      const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
      expect(duplicates, key).toEqual([]);
    }
  });

  it('역사 도검 122점, 신화·전설 112점, 판타지 창작 12점, 게임·작품 속 검 37점이 있다', () => {
    expect(SEED_SWORDS.filter((sword) => isHistorical(sword.category))).toHaveLength(122);
    expect(SEED_SWORDS.filter((sword) => sword.category === 'legend')).toHaveLength(112);
    expect(SEED_SWORDS.filter((sword) => sword.category === 'fantasy')).toHaveLength(12);
    expect(SEED_SWORDS.filter((sword) => sword.category === 'fiction')).toHaveLength(37);
  });

  it('원작의 합체검으로 바꾼 삼합 대검은 시드에서 뺐다', () => {
    expect(SEED_SWORDS.some((sword) => sword.id === 'sw-threefold-greatsword')).toBe(false);
  });

  it('1.2.0에 더한 게임·작품 속 검 10점은 시드 버전 12에 들어온 도검으로 적혀 있다', () => {
    expect(CATALOG_V12_IDS).toHaveLength(10);
    for (const id of CATALOG_V12_IDS) {
      expect(SEED_SWORDS.find((sword) => sword.id === id)?.category, id).toBe('fiction');
      expect(seedAddedIn(id), id).toBe(12);
    }
  });

  it('1.3.0에 더한 Fate 시리즈와 다른 작품의 검 27점은 시드 버전 13에 들어온 게임·작품 속 검으로 적혀 있다', () => {
    expect(CATALOG_V13_IDS).toHaveLength(27);
    for (const id of CATALOG_V13_IDS) {
      expect(SEED_SWORDS.find((sword) => sword.id === id)?.category, id).toBe('fiction');
      expect(seedAddedIn(id), id).toBe(13);
    }
  });

  it('1.1.0에 더한 33점(삼합 대검 뺌)은 시드 버전 11에 들어온 도검으로 적혀 있다', () => {
    expect(CATALOG_V11_IDS).toHaveLength(33);
    for (const id of CATALOG_V11_IDS) {
      expect(
        SEED_SWORDS.some((sword) => sword.id === id),
        id,
      ).toBe(true);
      expect(seedAddedIn(id), id).toBe(11);
    }
  });

  it('판타지 창작 도검은 어느 작품의 검도 옮기지 않은 창작품이라고 한국어·영어로 밝힌다', () => {
    for (const sword of SEED_SWORDS.filter((item) => item.category === 'fantasy')) {
      expect(sword.description, sword.slug).toContain('특정 작품의 검을 옮기지 않고');
      expect(sword.translations?.en?.description, sword.slug).toContain('not a copy of any work');
    }
  });

  it('게임·작품 속 검은 원작과 출전을 밝히고, 권리자와 관계없는 비공식 팬 재현품이라고 한국어·영어로 적는다', () => {
    for (const sword of SEED_SWORDS.filter((item) => item.category === 'fiction')) {
      expect(sword.description, sword.slug).toContain('비공식 팬 재현품');
      expect(sword.translations?.en?.description, sword.slug).toContain('unofficial fan replica');
      expect(sword.era, sword.slug).toMatch(/·\s*\d{4}$/);
    }
  });

  it('모든 도검에 영어 글이 있고, 제원과 그림의 칼날 길이가 같다', () => {
    for (const sword of SEED_SWORDS) {
      expect(sword.translations?.en?.summary, sword.slug).toBeTruthy();
      expect(sword.specs.totalLength, sword.slug).toBeGreaterThan(sword.specs.bladeLength);
      expect(sword.art.blade.length, sword.slug).toBe(sword.specs.bladeLength);
    }
  });

  it('신화·전설 재현품과 판타지·게임 창작품은 날을 세우지 않는다', () => {
    expect(SEED_SWORDS.filter((sword) => !isHistorical(sword.category) && sword.specs.edge === 'sharp')).toEqual([]);
  });
});
