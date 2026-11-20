import type { SwordDiscount } from './discount';

/** ISO 3166-1 alpha-2 국가 코드 중 이 쇼핑몰에서 쓰는 것 */
export type CountryCode =
  | 'KR'
  | 'JP'
  | 'CN'
  | 'US'
  | 'GB'
  | 'DE'
  | 'FR'
  | 'IT'
  | 'NO'
  | 'GR'
  | 'AU'
  | 'CA'
  | 'IN'
  | 'ID'
  | 'NP'
  | 'PH'
  | 'TR'
  | 'IR'
  | 'EG'
  | 'ET'
  | 'SD'
  | 'YE'
  | 'SA'
  | 'ES'
  | 'CH'
  | 'RU'
  | 'MX'
  | 'AT'
  | 'RO'
  | 'HU'
  | 'IE'
  | 'VN'
  | 'CZ'
  | 'DK'
  | 'RW'
  | 'IQ';

export type CurrencyCode = 'KRW' | 'USD' | 'JPY' | 'CNY' | 'GBP' | 'EUR' | 'AUD' | 'CAD';

/**
 * 지역(나무위키 '고대~근세기 무기'의 구분을 따름). legend는 신화·전설 재현품,
 * fantasy는 판타지 소설·게임의 형식을 빌려 이 쇼핑몰이 새로 디자인한 창작품(특정 작품의 검은 옮기지 않음),
 * fiction은 게임·만화 등 작품 속 검을 원작 이름 그대로 본뜬 비공식 팬 재현품(나무위키 '가공의 도검')
 */
export type SwordCategory = 'east' | 'west' | 'middle' | 'americas' | 'legend' | 'fantasy' | 'fiction';

/** 형태: 곧은 검, 휜 도, 양손검·대도, 단검, 특수(물결·갈고리·카타르 등), 연습용(가검) */
export type SwordKind = 'straight' | 'curved' | 'great' | 'dagger' | 'exotic' | 'training';

/** 진검(날 있음) 또는 장식용(날 없음) */
export type EdgeKind = 'sharp' | 'blunt';

export interface SwordArt {
  blade: {
    /** mm */
    length: number;
    /** 날 밑동 너비, mm */
    width: number;
    /** 휘어짐(sori), mm. 0이면 직검, 음수면 날 쪽으로 휨(쿠크리·팔카타) */
    curve: number;
    edge: 'single' | 'double';
    /**
     * kissaki 휜 칼끝, spear 뾰족, round 둥긂, sickle 낫, square 사각(처형검), clip 클립 포인트, hook 갈고리(구),
     * needle 바늘(찌르기 검), fork 두 갈래(줄피카르), angled 날 쪽을 곧게 깎아 등에서 끝나는 각진 칼끝(버스터 소드)
     */
    tip: 'kissaki' | 'spear' | 'round' | 'sickle' | 'square' | 'clip' | 'hook' | 'needle' | 'fork' | 'angled';
    fuller?: boolean;
    ridge?: boolean;
    hamon?: boolean;
    inscription?: 'stars' | 'runes';
    /** 물결 칼날의 진폭(mm). 크리스·플랑베르주·우르미 */
    wave?: number;
    /** 물결 수. 기본 7 */
    waves?: number;
    /** 칼끝 쪽 너비 배율(1보다 크면 넓어짐). 펄션·팔카타·대도 */
    flare?: number;
    /** 칼날 중간이 불룩한 정도(0~1). 비파형 동검 */
    bulge?: number;
    /** 칼날 재질. 기본 steel. crystal은 옅은 청색에 능선과 면 경계를 새깁니다(판타지). */
    material?: 'steel' | 'bronze' | 'wood' | 'bamboo' | 'foam' | 'crystal';
    /** 재질 색을 바꿀 때(스펀지 검 등) */
    color?: string;
    /** 양쪽 날에 흑요석 조각을 박음(마쿠아후이틀) */
    teeth?: boolean;
    /** 칼날 밑동을 감싼 덧쇠(쌍수도의 구리 덧쇠). 리벳 네 개 */
    sleeve?: { length: number; color: string };
    /** 합체 칼날: 길이 방향으로 맞물린 칼날 판 수(2~4). 판 사이 이음선과 판마다 볼트를 새깁니다. */
    segments?: number;
    /** 마디 칼날(사복검): 칼날 마디를 잇는 이음매 수(2~16, 마디는 하나 더 많음). 이음매마다 V자 이음선과 핀을 새깁니다. */
    links?: number;
    /** 권총 검: 칼등을 따라 붙인 총열 장식(밑동부터 length mm, 칼날의 6할까지)과 총구 */
    barrel?: { length: number; color: string };
    /** 칼날 밑동 가운데에 길이 방향으로 뚫은 둥근 구멍 수(1~4, 버스터 소드) */
    holes?: number;
    /**
     * 칼날에 박은 둥근 메달리온(파멸의 인도자). at은 밑동에서 칼끝까지의 위치(0~1), size는 그 자리 칼날 너비에 대한 지름 비율(0.15~2),
     * across는 너비 방향 위치(0 등 ~ 1 날, 기본 0.5)입니다. 칼등 밖으로 조금 나와도 됩니다.
     */
    medallion?: {
      at: number;
      size: number;
      color: string;
      across?: number;
      /** 메달리온 가운데 돋을새김 문양. hand 편 손바닥(파멸의 인도자), cross 십자, star 별 */
      emblem?: 'hand' | 'cross' | 'star';
    };
    /**
     * 한 코등이에 나란히 붙은 두 번째 칼날(바라기). 칼등 쪽으로 gap mm 떨어져 width mm 너비로 붙고,
     * length는 큰 칼날 길이에 대한 비율(기본 0.9)입니다. 끝은 뾰족합니다.
     */
    twin?: { width: number; gap: number; length?: number };
    /** 열쇠 이빨(키블레이드): 칼끝 날 쪽에 홈이 셋 진 열쇠 이빨을 붙입니다. 칼날 너비의 1.8배만큼 날 쪽으로 나옵니다. */
    keyBit?: boolean;
    /** 날을 따라 덧댄 밝은 띠(합체검의 할로우 블레이드 날). width는 칼날 너비에 대한 비율(0.05~0.5)입니다. */
    edgeBand?: { width: number; color: string };
    /** 칼날 판 이음매를 따라 판 네모 홈(합체검의 백 블레이드). count는 1~12, at은 너비 방향 위치(0 등 ~ 1 날, 기본 0.72)입니다. */
    notches?: { count: number; at?: number };
  };
  collar?: { color: string };
  guard: {
    /** dguard 손등 보호대, swept 스웹트 힐트, cup 컵 힐트, basket 바구니 힐트, katar 카타르 H자 틀, crescent 초승달(구), ring 총구 고리(대검), ganja 비대칭 받침(크리스), plate 두툼한 민무늬 원판(쌍수도) */
    type:
      | 'disc'
      | 'cross'
      | 'quillon'
      | 'jian'
      | 'block'
      | 'none'
      | 'dguard'
      | 'swept'
      | 'cup'
      | 'basket'
      | 'katar'
      | 'crescent'
      | 'ring'
      | 'ganja'
      | 'plate';
    width: number;
    color: string;
    accent?: string;
  };
  grip: {
    length: number;
    color: string;
    /** helix 촘촘한 나선 끈, plain 민무늬, split 둘로 나뉜 손잡이(발리송), katar 가로 손잡이(카타르) */
    wrap: 'diamond' | 'cord' | 'wire' | 'leather' | 'ribbed' | 'helix' | 'plain' | 'split' | 'katar';
    wrapColor?: string;
    /** 코등이 바로 뒤의 원통형 쇠 깃(쌍수도의 황동 깃). length는 mm */
    ferrule?: { length: number; color: string };
  };
  pommel: {
    /** none 없음, crook 굽은 지팡이 머리, beak 새부리(세이버), spike 뾰족한 끝(구) */
    type: 'cap' | 'wheel' | 'lobed' | 'ball' | 'ring' | 'jian' | 'gem' | 'none' | 'crook' | 'beak' | 'spike';
    color: string;
    gem?: string;
  };
  tassel?: string;
}

/** 어드민에서 올린 상품 사진. url은 Mock API(/api/images/:id)가 돌려줍니다. */
export interface SwordImage {
  url: string;
  /** 대체 텍스트(필수) */
  alt: string;
  /** 영어 화면의 대체 텍스트. 없으면 alt를 씁니다. */
  altEn?: string;
}

export interface SwordStory {
  /** 연도나 시기 표기, 예: "1598" 또는 "6세기" */
  when: string;
  text: string;
}

/** 쇼핑몰이 지원하는 언어 */
export type Locale = 'ko' | 'en';

/** 한국어 원문을 다른 언어로 옮긴 글. 이름은 nameEn을 씁니다. */
export interface SwordTranslation {
  summary: string;
  description: string;
  era: string;
  material: string;
  stories: SwordStory[];
}

export interface Sword {
  id: string;
  slug: string;
  name: string;
  nameOriginal: string;
  nameEn: string;
  category: SwordCategory;
  kind: SwordKind;
  /** 제작·출고 국가. 관세 계산의 출발지 */
  origin: CountryCode;
  era: string;
  summary: string;
  description: string;
  stories: SwordStory[];
  specs: {
    bladeLength: number;
    totalLength: number;
    weight: number;
    material: string;
    edge: EdgeKind;
  };
  /** 원화 정가 */
  price: number;
  /** 기간 할인. 지금 판매가는 priceOf로 계산합니다. */
  discount?: SwordDiscount;
  stock: number;
  art: SwordArt;
  /** 상세 갤러리에서 부조 그림 뒤에 보여 줄 사진 */
  images?: SwordImage[];
  /** 언어별 번역. 없으면 한국어 원문을 보여 줍니다. */
  translations?: Partial<Record<Exclude<Locale, 'ko'>, SwordTranslation>>;
}

export interface CartLine {
  swordId: string;
  quantity: number;
}

export type OrderStatus = 'paid' | 'permit-review' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderLine {
  swordId: string;
  name: string;
  /** 영어 이름(영어 화면 영수증). 주문할 때 남기며, 남기기 전 주문은 Mock API가 돌려줄 때 지금 도검 목록에서 채웁니다. */
  nameEn?: string;
  origin: CountryCode;
  /** 실제로 받은 1점 가격(할인 적용 뒤) */
  unitPrice: number;
  /** 할인이 적용된 줄의 1점 정가 */
  listPrice?: number;
  quantity: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  postalCode: string;
  address: string;
}

/** 쇼핑몰 회원(비밀번호는 Mock 서버에만 해시로 둡니다) */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  /** 프로필 사진 주소(Mock API의 /api/images/:id) */
  avatarUrl?: string;
}

/** 구매한 회원이 쓴 후기. 이름은 가려서 내보냅니다. */
export interface Review {
  id: string;
  swordId: string;
  userId: string;
  authorName: string;
  avatarUrl?: string;
  /** 1~5 */
  rating: number;
  text: string;
  createdAt: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  /** 로그인한 채 주문했으면 회원 id */
  userId?: string;
  /**
   * 주문 키. 비회원이 주문 확인을 열 때 씁니다(주문번호는 날짜+순번이라 짐작하기 쉬워 그것만으로는 열지 않음).
   * 주문할 때의 응답과 비회원 주문 조회 응답에만 실리고, 다른 응답에서는 빠집니다. 키가 생기기 전 주문에는 없습니다.
   */
  accessKey?: string;
  destination: CountryCode;
  customer: Customer;
  lines: OrderLine[];
  paymentMethod: 'card' | 'transfer';
  permitConfirmed: boolean;
  amounts: {
    goods: number;
    shipping: number;
    duty: number;
    vat: number;
    total: number;
  };
}

export interface CountryRule {
  code: CountryCode;
  name: string;
  currency: CurrencyCode;
  /** 관세율(0~1) */
  dutyRate: number;
  /** 부가세·소비세·GST율(0~1) */
  vatRate: number;
  /** 관세 면제 한도. 물품가격 기준, limitCurrency 단위 */
  dutyFreeLimit: number;
  /** 부가세 면제 한도. 물품가격 기준, limitCurrency 단위 */
  vatFreeLimit: number;
  limitCurrency: CurrencyCode;
  /** 특정 출발국에 다른 면세 한도를 적용할 때(예: 한국의 미국발 200달러) */
  originLimits?: Partial<Record<CountryCode, number>>;
  /** 과세가격 기준. CIF는 물품가격+운임, FOB는 물품가격만 */
  valuation: 'CIF' | 'FOB';
  /** 수입·소지 관련 안내 */
  permitNote: string;
  /** 영어 안내. 없으면 한국어 안내를 씁니다. */
  permitNoteEn?: string;
}

export interface CustomsConfig {
  /** 1 단위 외화당 원화 */
  exchangeRates: Record<CurrencyCode, number>;
  /** 출고지 한 곳당 배송비(원) */
  shipping: { domestic: number; international: number };
  countries: CountryRule[];
  updatedAt: string;
}
