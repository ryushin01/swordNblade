import { CATALOG_V11_IDS, CATALOG_V12_IDS, CATALOG_V13_IDS } from './catalog';
import { createDbWithSeed, type Db, seedAddedInFrom, type SeedBundle } from './db';
import { SEED_ORDERS, SEED_SWORDS, SEED_VERSION } from './seed';

/** 처음 16점(1)·도검 목록 확장(3) 뒤에 더한 도검이 들어온 시드 버전 */
const ADDED_IN: Record<string, number> = {
  'sw-sajingeom': 4,
  'sw-chilseonggeom': 4,
  'sw-byeorungeom': 4,
  'sw-yedo': 4,
  'sw-bongukgeom': 4,
  'sw-egeking': 6,
  'sw-dojigiri': 6,
  'sw-wallace-sword': 6,
  // 1.1.0: 단검·대검 보충, 게임에 자주 나오는 이름의 실제 칼, 판타지·게임 분류
  ...Object.fromEntries(CATALOG_V11_IDS.map((id) => [id, 11])),
  // 1.2.0: 게임·작품 속 검(원작 이름 그대로 본뜬 팬 재현품)
  ...Object.fromEntries(CATALOG_V12_IDS.map((id) => [id, 12])),
  // 1.3.0: Fate 시리즈와 다른 작품의 검 1차(사용자 지시 "모든 시리즈를 다 원작대로")
  ...Object.fromEntries(CATALOG_V13_IDS.map((id) => [id, 13])),
};

/**
 * 시드 전체. 서버(시드 JSON 라우트·Node Mock 서버·테스트)만 이 모듈을 불러옵니다.
 * 브라우저 Mock API는 카탈로그 코드를 화면 묶음에 싣지 않으려고 이 값을 JSON(/mock-seed.json)으로 받습니다.
 */
export const SEED_BUNDLE: SeedBundle = {
  version: SEED_VERSION,
  swords: SEED_SWORDS,
  orders: SEED_ORDERS,
  addedIn: ADDED_IN,
};

/** 도검이 처음 들어온 시드 버전 */
export const seedAddedIn = (id: string): number => seedAddedInFrom(ADDED_IN, id);

/** 시드로 메모리 DB를 만듭니다(서버·테스트용). */
export const createDb = (options: { storageKey?: string } = {}): Db => createDbWithSeed(SEED_BUNDLE, options);
