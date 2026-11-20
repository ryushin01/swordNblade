import { buildCatalog, type CatalogEntry } from './build';
import { DAGGER_ENTRIES } from './daggers';
import { EAST_ENTRIES } from './east';
import { FANTASY_ENTRIES } from './fantasy';
import { GAME_ORIGIN_ENTRIES } from './game-origins';
import { GREATSWORD_ENTRIES } from './greatswords';
import { LEGEND_A } from './legend-a';
import { LEGEND_B } from './legend-b';
import { LEGEND_C } from './legend-c';
import { MIDDLE_ENTRIES } from './middle';
import { TRAINING_ENTRIES } from './training';
import { WEST_ENTRIES } from './west';

import type { SwordCategory } from '@snb/domain';

/** 1.1.0(시드 버전 11)에 더한 역사 도검: 단검·대검 보충과 게임 속 검의 실제 원형 */
const V11_HISTORICAL: readonly CatalogEntry[] = [...DAGGER_ENTRIES, ...GREATSWORD_ENTRIES, ...GAME_ORIGIN_ENTRIES];
const addedIn = (category: SwordCategory) => V11_HISTORICAL.filter((entry) => entry.category === category);

/**
 * 시드 16점 뒤에 더하는 도검 목록(역사 도검 111점, 신화·전설 107점, 판타지·게임 13점).
 * 나무위키 「고대~근세기 무기」「전설의 무기」의 도검류 목록을 바탕으로, 이미 있는 16점과 겹치는 것은 뺐습니다.
 * 1.1.0에 더한 역사 도검은 같은 지역 묶음 뒤에, 판타지·게임은 맨 뒤에 둡니다('추천' 정렬이 이 순서).
 */
export const CATALOG_SWORDS = buildCatalog([
  ...EAST_ENTRIES,
  ...addedIn('east'),
  ...MIDDLE_ENTRIES,
  ...addedIn('middle'),
  ...addedIn('americas'),
  ...WEST_ENTRIES,
  ...addedIn('west'),
  ...TRAINING_ENTRIES,
  ...LEGEND_A,
  ...LEGEND_B,
  ...LEGEND_C,
  ...FANTASY_ENTRIES,
]);

const V11_SLUGS = new Set([...V11_HISTORICAL, ...FANTASY_ENTRIES].map((entry) => entry.slug));

/** 시드 버전 11에 들어온 도검 id(시드 순서). 예전 데이터를 옮길 때 이 도검들을 뒤에 더합니다. */
export const CATALOG_V11_IDS: readonly string[] = CATALOG_SWORDS.filter((sword) => V11_SLUGS.has(sword.slug)).map(
  (sword) => sword.id,
);
