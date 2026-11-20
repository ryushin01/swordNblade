import { type CustomsConfig, DEFAULT_CUSTOMS_CONFIG, type Order, type Sword, type User } from '@snb/domain';

export interface DbState {
  swords: Sword[];
  orders: Order[];
  customs: CustomsConfig;
  /** 이 데이터를 만든 시드 버전. 없으면 1(버전을 두기 전 데이터) */
  seedVersion?: number;
  /** 회원(비밀번호는 SHA-256 해시). 예전 데이터에는 없을 수 있음 */
  users?: StoredUser[];
  /** 로그인 세션(USER_SESSION_TTL_MS가 지나면 무효) */
  sessions?: Session[];
  /** 어드민 데모 로그인 세션(ADMIN_SESSION_TTL_MS가 지나면 무효). 만료를 두기 전 데이터에는 토큰 문자열만 있어 무효로 봅니다. */
  adminSessions?: Array<AdminSession | string>;
  /** 구매한 회원의 후기 */
  reviews?: StoredReview[];
}

export interface StoredUser extends User {
  passwordHash: string;
  /** 찜한 도검 id */
  wishlist?: string[];
}

export interface StoredReview {
  id: string;
  swordId: string;
  userId: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  createdAt: string;
}

export interface AdminSession {
  token: string;
  createdAt: string;
}

export interface Db {
  read: () => DbState;
  write: (update: (state: DbState) => DbState) => DbState;
  reset: () => void;
}

/**
 * 시드 데이터 묶음. 서버(시드 JSON 라우트·Node Mock 서버·테스트)는 seed-bundle.ts에서 모듈로 받고,
 * 브라우저 Mock API는 카탈로그 코드를 화면 묶음에 싣지 않으려고 시드 JSON 라우트(/mock-seed.json)에서 받습니다.
 */
export interface SeedBundle {
  /** 시드 버전(seed.ts의 SEED_VERSION). 저장된 데이터가 이보다 낮으면 migrateSeed로 맞춥니다. */
  version: number;
  swords: Sword[];
  orders: Order[];
  /** 처음 16점(1)·도검 목록 확장(3) 뒤에 더한 도검이 들어온 시드 버전 */
  addedIn: Record<string, number>;
}

/** 도검이 처음 들어온 시드 버전. 처음 16점은 1, 도검 목록 확장은 3이고, 그 뒤에 더한 것은 addedIn에 적혀 있습니다. */
export function seedAddedInFrom(addedIn: Record<string, number>, id: string): number {
  return addedIn[id] ?? (/^sw-\d{3}$/.test(id) ? 1 : 3);
}

/**
 * 시드 가격을 바꾼 도검(옛 기본값 → 새 값). before 버전보다 낮은 데이터에만 적용합니다.
 * 그 뒤의 데이터에서 어드민이 옛 기본값과 같은 가격을 정했으면 그대로 둡니다(시드 버전이 오를 때마다 다시 바꾸지 않음).
 */
const PRICE_FIXES: Record<string, { from: number; to: number; before: number }> = {
  'sw-001': { from: 6_800_000, to: 17_600_000, before: 9 },
};

/**
 * 출처 대조로 원어·영어 이름과 출고국을 바로잡은 도검과 바로잡은 시드 버전. 그보다 낮은 데이터에서만 새 값으로 바꿉니다
 * (한국어 이름·가격은 둠, 그 뒤 어드민이 고친 값은 둠).
 */
const IDENTITY_FIXED_IN: Record<string, number> = { 'sw-kuruchi': 7 };

/** 출처를 확인하지 못했거나 다른 도검으로 바꿔 시드에서 뺀 도검. 예전 데이터에서도 지웁니다. */
const REMOVED_SEED_IDS = [
  'sw-ings-sword',
  'sw-hwer',
  'sw-ecke-king',
  'sw-samingeom',
  // 1.2.0: 원작의 합체검(fusion-swords)으로 바꾼 창작 대검
  'sw-threefold-greatsword',
];

const clone = <T>(value: T): T => structuredClone(value);

const seedState = (seed: SeedBundle): DbState => ({
  swords: clone(seed.swords),
  orders: clone(seed.orders),
  customs: clone(DEFAULT_CUSTOMS_CONFIG),
  seedVersion: seed.version,
});

/**
 * 예전 시드로 저장된 데이터를 새 시드에 맞춥니다.
 * - 시드 도검: 그림·형태·설명·이야기·번역·제원은 새 시드로 바꾸고, 이름·가격·재고 같은 판매 정보는 그대로 둡니다.
 * - 새 시드에만 있는 도검은 뒤에 더하고, 어드민에서 만든 도검과 주문은 건드리지 않습니다.
 */
export function migrateSeed(state: DbState, seed: SeedBundle): DbState {
  if ((state.seedVersion ?? 1) >= seed.version) return state;
  const byId = new Map(state.swords.map((sword) => [sword.id, sword]));
  const storedVersion = state.seedVersion ?? 1;
  const swords = state.swords.map((sword) => {
    const seeded = seed.swords.find((item) => item.id === sword.id);
    if (!seeded) return sword;
    return {
      ...sword,
      ...(storedVersion < (IDENTITY_FIXED_IN[sword.id] ?? 0)
        ? { nameOriginal: seeded.nameOriginal, nameEn: seeded.nameEn, origin: seeded.origin }
        : {}),
      kind: seeded.kind,
      category: seeded.category,
      era: seeded.era,
      summary: seeded.summary,
      description: seeded.description,
      stories: clone(seeded.stories),
      specs: { ...clone(seeded.specs) },
      art: clone(seeded.art),
      ...(seeded.translations ? { translations: clone(seeded.translations) } : {}),
      // 할인은 판매 정보라 어드민 값을 지키고, 할인이 생기기 전(버전 10 미만) 데이터에만 시드 할인을 채웁니다.
      ...(storedVersion < 10 && seeded.discount && sword.discount === undefined
        ? { discount: clone(seeded.discount) }
        : {}),
    };
  });
  // 저장된 데이터보다 나중 시드 버전에 들어온 도검만 더합니다. 어드민에서 지운 예전 시드 도검은 되살리지 않습니다.
  // 삼인검이 남아 있으면 본국검으로 바꾸기 전 데이터라, 그때 없던 본국검을 채웁니다(지운 것이 아님).
  const beforeBongukgeom = byId.has('sw-samingeom');
  const added = seed.swords
    .filter(
      (item) =>
        !byId.has(item.id) &&
        (seedAddedInFrom(seed.addedIn, item.id) > storedVersion || (beforeBongukgeom && item.id === 'sw-bongukgeom')),
    )
    .map(clone);
  const kept = swords.filter((sword) => !REMOVED_SEED_IDS.includes(sword.id));
  // 시드 가격을 바꾼 도검은, 저장된 가격이 옛 기본값 그대로일 때만 새 가격으로 맞춥니다(어드민에서 고친 가격은 둠).
  const repriced = kept.map((sword) => {
    const fix = PRICE_FIXES[sword.id];
    return fix && storedVersion < fix.before && sword.price === fix.from ? { ...sword, price: fix.to } : sword;
  });
  return { ...state, swords: [...repriced, ...added], seedVersion: seed.version };
}

/**
 * 번역 속성이 없는 시드 도검(번역을 두기 전에 저장된 데이터)에 시드 번역을 채웁니다.
 * 화면이 번역 보정표를 따로 싣지 않도록 Mock API가 돌려주기 전에 맞춥니다.
 * 어드민에서 비운 번역({})과 어드민에서 만든 도검은 그대로 두고, 채운 것이 없으면 같은 상태를 돌려줍니다.
 */
function withSeedTranslations(state: DbState, seed: SeedBundle): DbState {
  let filled = false;
  const swords = state.swords.map((sword) => {
    if (sword.translations !== undefined) return sword;
    const translations = seed.swords.find((item) => item.id === sword.id)?.translations;
    if (!translations) return sword;
    filled = true;
    return { ...sword, translations: clone(translations) };
  });
  return filled ? { ...state, swords } : state;
}

/**
 * 메모리 DB. storageKey를 주면 브라우저 localStorage에 저장해 새로고침 후에도 유지합니다.
 * 저장소에 접근할 수 없는 환경(사생활 보호 모드 등)에서는 메모리로만 동작합니다.
 * 시드는 인자로 받습니다(브라우저는 시드 JSON, 서버·테스트는 seed-bundle.ts의 createDb).
 */
export function createDbWithSeed(seed: SeedBundle, options: { storageKey?: string } = {}): Db {
  const { storageKey } = options;

  let needsSave = false;

  /**
   * 저장된 값이 없거나, 저장소를 못 쓰거나, 모양이 맞지 않으면 null.
   * 읽을 때마다 다시 불러오므로 깨진 값 하나가 모든 요청을 막지 않게 모양을 확인합니다.
   */
  const loadStored = (): DbState | null => {
    if (!storageKey) return null;
    try {
      const raw = globalThis.localStorage?.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<DbState> | null;
      if (parsed && Array.isArray(parsed.swords) && Array.isArray(parsed.orders) && parsed.customs) {
        const stored = parsed as DbState;
        if ((stored.seedVersion ?? 1) < seed.version) {
          // 예전 시드로 저장된 데이터는 새 시드에 맞추고, 저장은 persist가 준비된 뒤에 합니다.
          needsSave = true;
          return migrateSeed(stored, seed);
        }
        const filled = withSeedTranslations(stored, seed);
        if (filled !== stored) needsSave = true;
        return filled;
      }
    } catch {
      // 저장소를 못 쓰거나 JSON이 깨졌으면 메모리 상태를 씁니다.
    }
    return null;
  };

  let state = loadStored() ?? seedState(seed);

  /** 저장된 값이 있을 때만 메모리 상태를 바꿉니다. 없으면 지금 상태를 유지합니다. */
  const refresh = () => {
    const stored = loadStored();
    if (stored) state = stored;
  };

  const persist = () => {
    if (!storageKey) return;
    try {
      globalThis.localStorage?.setItem(storageKey, JSON.stringify(state));
    } catch {
      // 저장 실패는 무시하고 메모리 상태를 유지합니다.
    }
  };
  const saveIfMigrated = () => {
    if (!needsSave) return;
    needsSave = false;
    persist();
  };
  saveIfMigrated();

  return {
    // 같은 출처의 다른 앱(쇼핑몰·어드민)이 바꾼 내용을 보도록 읽을 때마다 저장소에서 다시 불러옵니다.
    read: () => {
      refresh();
      saveIfMigrated();
      return state;
    },
    write: (update) => {
      refresh();
      state = update(clone(state));
      persist();
      return state;
    },
    reset: () => {
      state = seedState(seed);
      persist();
    },
  };
}
