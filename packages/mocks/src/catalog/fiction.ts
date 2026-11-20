import { GOLD, IRON, RUBY, SAPPHIRE, SILVER } from './legend-kit';

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
const STEEL_BLUNT = '스테인리스강(날 없음)';
const STEEL_BLUNT_EN = 'Stainless steel (unsharpened)';

interface FictionSpec {
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

/** 게임·작품 속 검: 분류는 fiction, 날은 무딤, 설명 끝에 비공식 팬 재현품 안내를 붙입니다. */
function fiction(spec: FictionSpec): CatalogEntry {
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

/**
 * 1.2.0 게임·작품 속 검 10점. 사용자 요청(2026-11-20, "원작 표기 대로")에 따라 나무위키 「가공의 도검」에 실린 게임 속 검을
 * 원작 이름 그대로 본떴습니다. 모두 비공식 팬 재현품이며, 그림은 부조 렌더러의 매개변수로 원작의 특징을 옮겼습니다.
 * Fate 시리즈의 검은 예전 결정대로 넣지 않습니다.
 */
export const FICTION_ENTRIES: CatalogEntry[] = [
  fiction({
    slug: 'buster-sword',
    name: ['버스터 소드', 'バスターソード', 'Buster Sword'],
    kind: 'great',
    work: ['파이널 판타지 VII · 1997', 'Final Fantasy VII · 1997'],
    summary: [
      '클라우드가 등에 지고 다니던, 사람 키만 한 넓적한 대검.',
      'The huge, slab-like greatsword Cloud carries on his back.',
    ],
    description: [
      '칼날 너비가 한 뼘을 훌쩍 넘는 외날 대검으로, 칼끝은 날 쪽을 비스듬히 깎아 등에서 끝나고 밑동의 쇠 블록 위로 둥근 구멍 두 개가 나란히 뚫려 있습니다.',
      'A single-edged greatsword far wider than a hand-span, its point cut at an angle from the edge to the spine, with two round holes in a row above the steel block at its base.',
    ],
    story: [
      '크라이시스 코어',
      'Crisis Core',
      '솔저 앤질이 아끼던 검으로 잭스에게 넘어갔고, 잭스가 마지막에 클라우드에게 맡겼습니다. 클라우드는 「파이널 판타지 VII」 내내 이 검을 듭니다.',
      'Treasured by the SOLDIER Angeal, it passed to Zack, who in the end entrusted it to Cloud; Cloud wields it throughout Final Fantasy VII.',
    ],
    material: [`${STEEL_BLUNT}, 강철 블록, 가죽`, `${STEEL_BLUNT_EN}, steel block, leather`],
    specs: [1300, 1700, 6000],
    price: 8_800_000,
    art: {
      blade: { length: 1300, width: 260, curve: 0, edge: 'single', tip: 'angled', holes: 2 },
      collar: { color: '#7d7f84' },
      guard: { type: 'none', width: 0, color: '#5a5c60' },
      grip: { length: 380, color: '#2a2622', wrap: 'leather' },
      pommel: { type: 'ball', color: '#6a6c70' },
    },
  }),
  fiction({
    slug: 'fusion-swords',
    name: ['합체검', '合体剣', 'Fusion Swords'],
    kind: 'great',
    work: ['파이널 판타지 VII 어드벤트 칠드런 · 2005', 'Final Fantasy VII Advent Children · 2005'],
    summary: [
      '여섯 자루를 하나로 합쳐 쓰는 클라우드의 대검.',
      'Cloud’s greatsword made of six blades that lock together into one.',
    ],
    description: [
      '메인 블레이드에 할로우 블레이드, 백 블레이드 두 자루, 사이드 블레이드 두 자루를 맞물린 최종 형태를 칼날 판의 이음선과 볼트로 새기고, 메인 블레이드의 붉은 긴 손잡이와 큰 코등이를 달았습니다. 실제로 나뉘지는 않습니다.',
      'The final form—the main blade locked together with the hollow blade, two back blades and two side blades—is carved as plate seams and bolts, with the main blade’s long red grip and large guard. It does not actually come apart.',
    ],
    story: [
      '제작',
      'Production',
      '정식 이름이 없어 제작진은 기믹에서 따온 「합체검」으로 부릅니다(「퍼스트 츠루기」는 잘못 퍼진 이름). 바이크 펜리르를 디자인한 피규어 조형사 타케야 타카유키가 맡아, 합치면 버스터 소드의 뒤를 잇는 모습이 되게 했습니다.',
      'It has no official name; the staff simply call it the “fusion sword” after its gimmick (“First Tsurugi” is a mistaken name that spread). Figure sculptor Takayuki Takeya, who also designed the motorcycle Fenrir, shaped it so the combined form reads as the Buster Sword’s successor.',
    ],
    extraStories: [
      [
        '어드벤트 칠드런',
        'Advent Children',
        '클라우드는 펜리르 좌우 수납칸에 세 자루씩 나눠 싣고 다니다가, 상대에 따라 몇 자루를 뽑아 쓰거나 모두 합쳐 버스터 소드처럼 휘두릅니다. 세피로스와의 결전에서는 다섯 자루를 띄워 차례로 베는 초구무신패참 Ver.5를 씁니다.',
        'Cloud stows three blades in each side compartment of Fenrir, drawing some apart or locking all six together to swing like the Buster Sword; against Sephiroth he floats five of them for the consecutive strikes of Omnislash Version 5.',
      ],
    ],
    material: [`${STEEL_BLUNT}, 강철 볼트, 가죽`, `${STEEL_BLUNT_EN}, steel bolts, leather`],
    specs: [1300, 1760, 5200],
    price: 9_500_000,
    art: {
      blade: { length: 1300, width: 200, curve: 0, edge: 'single', tip: 'angled', segments: 4 },
      guard: { type: 'block', width: 250, color: '#3a3a40' },
      grip: { length: 400, color: '#7a1f1f', wrap: 'ribbed' },
      pommel: { type: 'cap', color: '#3a3a40' },
    },
  }),
  fiction({
    slug: 'masamune-ff7',
    name: ['마사무네(파이널 판타지 VII)', '正宗', 'Masamune (Final Fantasy VII)'],
    kind: 'curved',
    work: ['파이널 판타지 VII · 1997', 'Final Fantasy VII · 1997'],
    summary: ['세피로스가 든, 사람 키를 훌쩍 넘는 긴 칼.', 'Sephiroth’s blade, far taller than a man.'],
    description: [
      '가는 외날을 길게 뽑아 살짝 휘게 하고 물결 무늬를 넣었으며, 작은 원형 코등이와 긴 손잡이를 달았습니다. 이름은 실제 명공 마사무네에서 왔습니다.',
      'A slender single edge drawn out to great length with a gentle curve and a temper line, a small round guard and a long grip. Its name comes from the real master smith Masamune.',
    ],
    story: [
      '파이널 판타지 VII',
      'Final Fantasy VII',
      '전설의 솔저 세피로스를 상징하는 긴 칼로, 니블헤임 사건 뒤 클라우드 앞에 거듭 나타납니다.',
      'The long blade that marks the legendary SOLDIER Sephiroth, which appears before Cloud again and again after the Nibelheim incident.',
    ],
    material: [`${STEEL_BLUNT}, 철 코등이, 면 끈`, `${STEEL_BLUNT_EN}, iron guard, cotton cord`],
    specs: [1800, 2150, 2000],
    price: 7_700_000,
    art: {
      blade: { length: 1800, width: 30, curve: 34, edge: 'single', tip: 'kissaki', hamon: true },
      guard: { type: 'disc', width: 62, color: '#2a2a2e', accent: SILVER },
      grip: { length: 300, color: '#2a2a2e', wrap: 'diamond', wrapColor: '#6a6c72' },
      pommel: { type: 'cap', color: '#2a2a2e' },
    },
  }),
  fiction({
    slug: 'gunblade',
    name: ['건블레이드(리볼버)', 'ガンブレード', 'Gunblade (Revolver)'],
    kind: 'exotic',
    work: ['파이널 판타지 VIII · 1999', 'Final Fantasy VIII · 1999'],
    summary: ['권총의 방아쇠와 실린더를 단 스콜의 검.', 'Squall’s sword, built on a revolver’s trigger and cylinder.'],
    description: [
      '곧은 외날을 리볼버 몸체에 이어 붙이고 칼등 밑동에 총열을 두었으며, 손잡이 끝에 사자 장식 줄을 늘어뜨렸습니다. 총열은 막힌 장식입니다.',
      'A straight single edge joined to a revolver body, a barrel along the base of the spine and a lion charm hanging from the pommel. The barrel is a blocked decoration.',
    ],
    story: [
      '파이널 판타지 VIII',
      'Final Fantasy VIII',
      '벨 때 방아쇠를 당기면 탄약의 진동이 칼날에 실려 위력이 커진다는 설정으로, 스콜의 맞수 사이퍼도 다른 모델을 씁니다.',
      'Pulling the trigger at the moment of the strike sends a cartridge’s shock through the blade; Squall’s rival Seifer wields another model.',
    ],
    material: [
      `${STEEL_BLUNT}, 철 총열·실린더 장식, 가죽`,
      `${STEEL_BLUNT_EN}, decorative iron barrel and cylinder, leather`,
    ],
    specs: [820, 1100, 2600],
    price: 5_900_000,
    art: {
      blade: {
        length: 820,
        width: 56,
        curve: 0,
        edge: 'single',
        tip: 'angled',
        barrel: { length: 220, color: '#4a4a50' },
      },
      guard: { type: 'block', width: 90, color: '#4a4a50' },
      grip: { length: 130, color: '#1f1c1a', wrap: 'ribbed' },
      pommel: { type: 'ring', color: '#4a4a50' },
      tassel: '#b4b4b8',
    },
  }),
  fiction({
    slug: 'master-sword',
    name: ['마스터 소드', 'マスターソード', 'Master Sword'],
    work: ['젤다의 전설 신들의 트라이포스 · 1991', 'The Legend of Zelda: A Link to the Past · 1991'],
    summary: [
      '숲속 받침돌에서 링크가 뽑아 드는, 마를 물리치는 검.',
      'The evil-banishing blade Link draws from its pedestal in the woods.',
    ],
    description: [
      '곧은 양날에 가운데 능선을 세우고, 날개처럼 펼친 푸른빛 코등이 가운데에 노란 보석을 박았으며, 손잡이를 푸른 끈으로 감았습니다.',
      'A straight double-edged blade with a central ridge, a blue-violet guard spread like wings with a yellow gem at its center, and a grip bound in blue.',
    ],
    story: [
      '신들의 트라이포스',
      'A Link to the Past',
      '잃어버린 숲의 받침돌에 꽂혀 있던 「마를 물리치는 검」으로, 링크가 이 검을 뽑아 마왕 가논에 맞섭니다. 뒤 시리즈에도 거듭 나옵니다.',
      'The “blade of evil’s bane” rested in a pedestal in the Lost Woods; Link draws it to face Ganon, and it returns throughout the series.',
    ],
    specs: [800, 1030, 1500],
    price: 4_900_000,
    stock: 2,
    art: {
      blade: { length: 800, width: 46, curve: 0, edge: 'double', tip: 'spear', ridge: true },
      guard: { type: 'crescent', width: 170, color: '#4b4fa6', accent: '#e0c050' },
      grip: { length: 160, color: '#3b3f8a', wrap: 'helix', wrapColor: '#2b2f6a' },
      pommel: { type: 'cap', color: '#4b4fa6' },
    },
  }),
  fiction({
    slug: 'erdricks-sword',
    name: ['로토의 검', 'ロトのつるぎ', "Erdrick's Sword"],
    work: ['드래곤 퀘스트 · 1986', 'Dragon Quest · 1986'],
    summary: ['전설의 용사 로토가 지녔던 검.', 'The sword once borne by the legendary hero Erdrick.'],
    description: [
      '곧은 양날에 금빛 코등이와 붉은 보석 자루 머리, 푸른 손잡이를 맞춰 용사의 검다운 차림으로 꾸몄습니다.',
      'A straight double-edged blade with a golden guard, a red-gem pommel and a blue grip—dressed as a hero’s sword.',
    ],
    story: [
      '드래곤 퀘스트',
      'Dragon Quest',
      '「드래곤 퀘스트」에서 로토의 후손이 찾아내는 검으로, 그 내력은 「드래곤 퀘스트 III」(1988)에서 밝혀집니다.',
      'In Dragon Quest, Erdrick’s descendant recovers the sword; its origins are revealed in Dragon Quest III (1988).',
    ],
    specs: [800, 1030, 1400],
    price: 5_300_000,
    stock: 2,
    art: {
      blade: { length: 800, width: 48, curve: 0, edge: 'double', tip: 'spear', ridge: true },
      guard: { type: 'cross', width: 190, color: GOLD, accent: RUBY },
      grip: { length: 170, color: '#2f4f8a', wrap: 'wire', wrapColor: GOLD },
      pommel: { type: 'gem', color: GOLD, gem: RUBY },
    },
  }),
  fiction({
    slug: 'soul-calibur',
    name: ['소울 칼리버', 'ソウルキャリバー', 'Soul Calibur'],
    work: ['소울칼리버 · 1998', 'Soulcalibur · 1998'],
    summary: [
      '사검 소울 엣지에 맞서는 수정 칼날의 영검.',
      'The crystal-bladed spirit sword that opposes the cursed Soul Edge.',
    ],
    description: [
      '수정처럼 푸른 칼날에 면 경계를 새기고, 은빛 코등이 끝을 말아 푸른 보석을 박았습니다.',
      'A crystal-blue blade cut with facets, and a silver guard with scrolled ends set with a blue gem.',
    ],
    story: [
      '소울칼리버',
      'Soulcalibur',
      '사검 소울 엣지에 맞서려고 만들어진 영검으로, 시리즈 내내 두 검을 둘러싼 싸움이 이어집니다.',
      'A spirit sword made to stand against the cursed Soul Edge; the struggle over the two blades runs through the series.',
    ],
    material: [
      '아크릴 칼날(날 없음), 은도금 황동, 유리 보석',
      'Acrylic blade (unsharpened), silver-plated brass, glass gems',
    ],
    specs: [900, 1150, 1300],
    price: 6_400_000,
    art: {
      blade: { length: 900, width: 52, curve: 0, edge: 'double', tip: 'spear', material: 'crystal' },
      guard: { type: 'quillon', width: 220, color: SILVER, accent: SAPPHIRE },
      grip: { length: 180, color: '#2a3a5a', wrap: 'wire', wrapColor: SILVER },
      pommel: { type: 'gem', color: SILVER, gem: SAPPHIRE },
    },
  }),
  fiction({
    slug: 'rebellion',
    name: ['리벨리온', 'Rebellion', 'Rebellion'],
    kind: 'great',
    work: ['데빌 메이 크라이 2 · 2003', 'Devil May Cry 2 · 2003'],
    summary: ['단테가 아버지 스파다에게서 물려받은 큰 칼.', 'The great sword Dante inherited from his father, Sparda.'],
    description: [
      '넓은 양날에 가운데 능선을 세우고, 해골을 본뜬 흰 코등이와 붉은 손잡이를 달았습니다.',
      'A broad double-edged blade with a central ridge, a white skull-shaped guard and a red grip.',
    ],
    story: [
      '데빌 메이 크라이 3',
      'Devil May Cry 3',
      '전설의 마검사 스파다가 아들 단테에게 남긴 검으로, 단테는 시리즈 내내 이 검을 등에 멥니다.',
      'The sword the legendary dark knight Sparda left to his son Dante, who carries it on his back throughout the series.',
    ],
    material: [`${STEEL_BLUNT}, 도장한 금속 장식, 가죽`, `${STEEL_BLUNT_EN}, painted metal fittings, leather`],
    specs: [1100, 1450, 3200],
    price: 6_900_000,
    art: {
      blade: { length: 1100, width: 76, curve: 0, edge: 'double', tip: 'spear', ridge: true },
      guard: { type: 'block', width: 190, color: '#d6d0c2', accent: '#3a3a3a' },
      grip: { length: 260, color: '#5a1a1a', wrap: 'leather' },
      pommel: { type: 'spike', color: '#9a9a96' },
    },
  }),
  fiction({
    slug: 'greatsword-of-artorias',
    name: ['아르토리우스의 대검', 'アルトリウスの大剣', 'Greatsword of Artorias'],
    kind: 'great',
    work: ['다크 소울 · 2011', 'Dark Souls · 2011'],
    summary: [
      '심연을 걸었던 기사 아르토리우스의 곧은 대검.',
      'The straight greatsword of Artorias, the knight who walked the Abyss.',
    ],
    description: [
      '꾸밈 없는 곧은 양날에 홈을 파고, 곧은 쇠 코등이와 가죽 손잡이를 단 단정한 대검입니다.',
      'A plain, straight double-edged greatsword with a fuller, an iron crossguard and a leather grip.',
    ],
    story: [
      '다크 소울',
      'Dark Souls',
      '아르토리우스의 무덤 앞에서는 그의 벗이었던 큰 늑대 시프가 이 검을 입에 물고 무덤을 지킵니다.',
      'Before Artorias’s grave, his companion, the great wolf Sif, stands guard with this sword held in its jaws.',
    ],
    material: [`${STEEL_BLUNT}, 철 장식, 가죽`, `${STEEL_BLUNT_EN}, iron fittings, leather`],
    specs: [1350, 1750, 3300],
    price: 6_200_000,
    art: {
      blade: { length: 1350, width: 62, curve: 0, edge: 'double', tip: 'spear', fuller: true },
      guard: { type: 'cross', width: 260, color: IRON },
      grip: { length: 330, color: '#2a2420', wrap: 'leather' },
      pommel: { type: 'cap', color: IRON },
    },
  }),
  fiction({
    slug: 'falchion-fire-emblem',
    name: ['팔시온', 'ファルシオン', 'Falchion (Fire Emblem)'],
    work: ['파이어 엠블렘 암흑룡과 빛의 검 · 1990', 'Fire Emblem: Shadow Dragon and the Blade of Light · 1990'],
    summary: ['마르스가 암흑룡을 쓰러뜨린 신검.', 'The divine blade with which Marth struck down the Shadow Dragon.'],
    description: [
      '곧은 양날에 가운데 능선을 세우고, 끝이 말린 금빛 코등이와 푸른 손잡이, 푸른 보석 자루 머리를 달았습니다.',
      'A straight double-edged blade with a central ridge, gold quillons with scrolled ends, a blue grip and a blue-gem pommel.',
    ],
    story: [
      '암흑룡과 빛의 검',
      'Shadow Dragon and the Blade of Light',
      '아리티아 왕자 마르스가 이 검으로 암흑룡 메디우스를 쓰러뜨렸고, 뒤 시리즈에서는 그 후손 크롬이 같은 이름의 검을 씁니다.',
      'Prince Marth of Altea slew the Shadow Dragon Medeus with this sword; in a later game his descendant Chrom wields a blade of the same name.',
    ],
    specs: [850, 1080, 1300],
    price: 5_600_000,
    stock: 2,
    art: {
      blade: { length: 850, width: 44, curve: 0, edge: 'double', tip: 'spear', ridge: true },
      guard: { type: 'quillon', width: 200, color: GOLD },
      grip: { length: 170, color: '#2a4a8a', wrap: 'wire', wrapColor: GOLD },
      pommel: { type: 'gem', color: GOLD, gem: SAPPHIRE },
    },
  }),
];
