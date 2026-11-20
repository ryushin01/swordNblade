import type { CatalogEntry, Pair, StoryRow } from './build';
import type { CountryCode, SwordArt, SwordKind } from '@snb/domain';

const NOTE_KO =
  '원작의 검을 본뜬 비공식 팬 재현품입니다. 원작의 이름과 디자인에 대한 권리는 각 권리자에게 있으며, 이 쇼핑몰은 권리자와 관계가 없습니다. 날은 세우지 않았습니다.';
const NOTE_EN =
  'An unofficial fan replica of the sword from the original work. All rights to its name and design belong to their respective owners, who are not affiliated with this shop. No edge.';
const MATERIAL: Pair = [
  '스테인리스강(날 없음), 도금 황동, 유리 보석',
  'Stainless steel (unsharpened), plated brass, glass gems',
];
export const STEEL_BLUNT = '스테인리스강(날 없음)';
export const STEEL_BLUNT_EN = 'Stainless steel (unsharpened)';

export interface FictionSpec {
  slug: string;
  /** [원작 한국어 표기, 원작 원어 표기, 영어 표기] */
  name: readonly [ko: string, original: string, en: string];
  kind?: SwordKind;
  /** 만들어 보내는 곳. 기본은 이 쇼핑몰의 공방(대한민국) */
  origin?: CountryCode;
  /** [작품 · 처음 나온 해] 한국어·영어. 시대 칸에 보입니다. */
  work: Pair;
  summary: Pair;
  /** 팬 재현품 안내 문구는 자동으로 붙습니다. */
  description: Pair;
  /** 원작 속 이야기 */
  story: StoryRow;
  /** 더 적을 이야기(제작 뒷이야기 등) */
  extraStories?: readonly StoryRow[];
  specs: readonly [blade: number, total: number, weight: number];
  price: number;
  stock?: number;
  material?: Pair;
  art: SwordArt;
}

/**
 * 게임·작품 속 검(나무위키 「가공의 도검」)을 적는 도우미. 작품별 파일(fiction*.ts)이 함께 씁니다.
 * 분류는 fiction, 날은 무딤, 설명 끝에 비공식 팬 재현품 안내를 붙입니다.
 */
export function fiction(spec: FictionSpec): CatalogEntry {
  return {
    slug: spec.slug,
    name: spec.name,
    category: 'fiction',
    kind: spec.kind ?? 'straight',
    origin: spec.origin ?? 'KR',
    era: spec.work,
    summary: spec.summary,
    description: [`${spec.description[0]} ${NOTE_KO}`, `${spec.description[1]} ${NOTE_EN}`],
    material: spec.material ?? MATERIAL,
    stories: [spec.story, ...(spec.extraStories ?? [])],
    specs: spec.specs,
    edge: 'blunt',
    price: spec.price,
    stock: spec.stock ?? 1,
    art: spec.art,
  };
}
