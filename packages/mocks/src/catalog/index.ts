import { buildCatalog, type CatalogEntry } from './build';
import { DAGGER_ENTRIES } from './daggers';
import { EAST_ENTRIES } from './east';
import { FANTASY_ENTRIES } from './fantasy';
import { FICTION_ENTRIES } from './fiction';
import { FATE_ENTRIES } from './fiction-fate';
import { WORKS_ENTRIES } from './fiction-works';
import { WORKS2_ENTRIES } from './fiction-works-2';
import { WORKS3_ENTRIES } from './fiction-works-3';
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
 * 시드 16점 뒤에 더하는 도검 목록(역사 도검 111점, 신화·전설 107점, 판타지 창작 12점, 게임·작품 속 검 10점).
 * 나무위키 「고대~근세기 무기」「전설의 무기」의 도검류 목록을 바탕으로, 이미 있는 16점과 겹치는 것은 뺐습니다.
 * 1.1.0에 더한 역사 도검은 같은 지역 묶음 뒤에, 판타지 창작과 게임·작품 속 검(1.2.0)은 맨 뒤에 둡니다('추천' 정렬이 이 순서).
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
  ...FICTION_ENTRIES,
  ...FATE_ENTRIES,
  ...WORKS_ENTRIES,
  ...WORKS2_ENTRIES,
  ...WORKS3_ENTRIES,
]);

const V11_SLUGS = new Set([...V11_HISTORICAL, ...FANTASY_ENTRIES].map((entry) => entry.slug));

/** 시드 버전 11에 들어온 도검 id(시드 순서). 예전 데이터를 옮길 때 이 도검들을 뒤에 더합니다. */
export const CATALOG_V11_IDS: readonly string[] = CATALOG_SWORDS.filter((sword) => V11_SLUGS.has(sword.slug)).map(
  (sword) => sword.id,
);

const V12_SLUGS = new Set(FICTION_ENTRIES.map((entry) => entry.slug));

/** 시드 버전 12에 들어온 도검 id(게임·작품 속 검, 시드 순서). */
export const CATALOG_V12_IDS: readonly string[] = CATALOG_SWORDS.filter((sword) => V12_SLUGS.has(sword.slug)).map(
  (sword) => sword.id,
);

const V13_SLUGS = new Set([...FATE_ENTRIES, ...WORKS_ENTRIES].map((entry) => entry.slug));

/** 시드 버전 13에 들어온 도검 id(Fate 시리즈와 다른 작품의 검 1차, 시드 순서). */
export const CATALOG_V13_IDS: readonly string[] = CATALOG_SWORDS.filter((sword) => V13_SLUGS.has(sword.slug)).map(
  (sword) => sword.id,
);

const V14_SLUGS = new Set(WORKS2_ENTRIES.map((entry) => entry.slug));

/** 시드 버전 14에 들어온 도검 id(「가공의 도검」 3단계 1차, 시드 순서). */
export const CATALOG_V14_IDS: readonly string[] = CATALOG_SWORDS.filter((sword) => V14_SLUGS.has(sword.slug)).map(
  (sword) => sword.id,
);

const V15_SLUGS = new Set(WORKS3_ENTRIES.map((entry) => entry.slug));

/** 시드 버전 15에 들어온 도검 id(「가공의 도검」 3단계 2차, 사용자가 고른 목록과 봉뢰검, 시드 순서). */
export const CATALOG_V15_IDS: readonly string[] = CATALOG_SWORDS.filter((sword) => V15_SLUGS.has(sword.slug)).map(
  (sword) => sword.id,
);
