import { describe, expect, it } from 'vitest';

import { isHistorical } from '@snb/domain';

import { seedAddedIn } from '../db';
import { SEED_SWORDS } from '../seed';
import { CATALOG_V11_IDS } from './index';

describe('시드 도검 목록', () => {
  it('id, 주소(slug), 이름이 겹치지 않는다', () => {
    for (const key of ['id', 'slug', 'name', 'nameEn'] as const) {
      const values = SEED_SWORDS.map((sword) => sword[key]);
      const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
      expect(duplicates, key).toEqual([]);
    }
  });

  it('역사 도검 122점, 신화·전설 112점, 판타지·게임 13점이 있다', () => {
    expect(SEED_SWORDS.filter((sword) => isHistorical(sword.category))).toHaveLength(122);
    expect(SEED_SWORDS.filter((sword) => sword.category === 'legend')).toHaveLength(112);
    expect(SEED_SWORDS.filter((sword) => sword.category === 'fantasy')).toHaveLength(13);
  });

  it('1.1.0에 더한 34점은 시드 버전 11에 들어온 도검으로 적혀 있다', () => {
    expect(CATALOG_V11_IDS).toHaveLength(34);
    for (const id of CATALOG_V11_IDS) {
      expect(
        SEED_SWORDS.some((sword) => sword.id === id),
        id,
      ).toBe(true);
      expect(seedAddedIn(id), id).toBe(11);
    }
  });

  it('판타지·게임 도검은 어느 작품의 검도 옮기지 않은 창작품이라고 한국어·영어로 밝힌다', () => {
    for (const sword of SEED_SWORDS.filter((item) => item.category === 'fantasy')) {
      expect(sword.description, sword.slug).toContain('특정 작품의 검을 옮기지 않고');
      expect(sword.translations?.en?.description, sword.slug).toContain('not a copy of any work');
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
