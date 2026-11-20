import { AMBER, AMETHYST, EMERALD, FLAME, GOLD, GOLD_LIGHT, NIGHT, RUBY, SAPPHIRE, SILVER } from './legend-kit';

import type { CatalogEntry, Pair } from './build';
import type { CountryCode, SwordArt, SwordKind } from '@snb/domain';

const NOTE_KO = '특정 작품의 검을 옮기지 않고 이 쇼핑몰이 새로 디자인한 장식용 창작품이며, 날은 세우지 않았습니다.';
const NOTE_EN = 'An original display piece designed by this shop—not a copy of any work’s sword—with no edge.';
const MATERIAL: Pair = [
  '스테인리스강(날 없음), 금도금 황동, 유리 보석',
  'Stainless steel (unsharpened), gilt brass, glass gems',
];
const STEEL_BLUNT = '스테인리스강(날 없음)';
const STEEL_BLUNT_EN = 'Stainless steel (unsharpened)';

interface FantasySpec {
  slug: string;
  name: readonly [ko: string, original: string, en: string];
  kind?: SwordKind;
  /** 만들어 보내는 곳. 기본은 이 쇼핑몰의 공방(대한민국) */
  origin?: CountryCode;
  /** 계열(시대 칸에 보입니다) */
  style: Pair;
  summary: Pair;
  /** 창작품 안내 문구는 자동으로 붙습니다. */
  description: Pair;
  /** 설정 이야기 */
  lore: Pair;
  specs: readonly [blade: number, total: number, weight: number];
  price: number;
  stock?: number;
  material?: Pair;
  art: SwordArt;
}

/** 판타지·게임 창작품: 분류는 fantasy, 날은 무딤, 설명 끝에 창작품 안내를, 이야기에 '설정'을 붙입니다. */
function fantasy(spec: FantasySpec): CatalogEntry {
  return {
    slug: spec.slug,
    name: spec.name,
    category: 'fantasy',
    kind: spec.kind ?? 'straight',
    origin: spec.origin ?? 'KR',
    era: spec.style,
    summary: spec.summary,
    description: [`${spec.description[0]} ${NOTE_KO}`, `${spec.description[1]} ${NOTE_EN}`],
    material: spec.material ?? MATERIAL,
    stories: [['설정', 'Lore', spec.lore[0], spec.lore[1]]],
    specs: spec.specs,
    edge: 'blunt',
    price: spec.price,
    stock: spec.stock ?? 2,
    art: spec.art,
  };
}

/**
 * 1.1.0 판타지·게임 13점. 판타지 소설과 게임에 흔한 형식(요정의 검·마검·합체검·사복검 등)을 빌려 새로 디자인했고,
 * 특정 작품의 검(이름·모양)은 옮기지 않습니다(Fate 시리즈를 넣지 않은 것과 같은 이유).
 * 계열 이름(마검·성검·마법의 검·용살검·합체검·사복검)은 나무위키 「가공의 도검」과 그 관련 문서에서 가져왔습니다.
 */
export const FANTASY_ENTRIES: CatalogEntry[] = [
  fantasy({
    slug: 'sylvan-leafblade',
    name: ['숲요정의 잎검', 'Sylvan Leafblade', 'Sylvan Leafblade'],
    style: ['하이 판타지 · 숲요정', 'High fantasy · wood elves'],
    summary: ['나뭇잎처럼 가운데가 불룩한 가볍고 가는 검.', 'A slender, light sword whose blade swells like a leaf.'],
    description: [
      '나뭇잎 모양 칼날에 잎맥처럼 가는 등줄을 세우고, 덩굴처럼 감은 은빛 손잡이와 초록 보석 자루 머리를 달았습니다.',
      'A leaf-shaped blade with a fine midrib like a leaf vein, a silver-wound grip like a climbing vine and a green gem in the pommel.',
    ],
    lore: [
      '숲요정들은 쇠를 나무처럼 길러서 벼린다는 설정으로, 달빛 아래서는 칼날의 결이 잎맥처럼 떠오른다고 합니다.',
      'In its lore, wood elves grow their steel like trees before forging it, and under moonlight the grain of the blade rises like leaf veins.',
    ],
    material: [
      '스테인리스강(날 없음), 은도금 황동, 유리 보석',
      'Stainless steel (unsharpened), silver-plated brass, glass gem',
    ],
    specs: [720, 960, 900],
    price: 2_900_000,
    stock: 3,
    art: {
      blade: {
        length: 720,
        width: 34,
        curve: 0,
        edge: 'double',
        tip: 'spear',
        bulge: 0.45,
        ridge: true,
        color: '#c6cfc4',
      },
      guard: { type: 'crescent', width: 120, color: SILVER, accent: EMERALD },
      grip: { length: 170, color: '#3f5a46', wrap: 'helix', wrapColor: SILVER },
      pommel: { type: 'gem', color: SILVER, gem: EMERALD },
    },
  }),
  fantasy({
    slug: 'rimecrystal-sword',
    name: ['서리 수정검', 'Rimecrystal Sword', 'Rimecrystal Sword'],
    style: ['판타지 · 마법의 검(얼음)', 'Fantasy · magic sword (ice)'],
    summary: ['얼음처럼 맑은 수정을 깎아 만들었다는 검.', 'A sword imagined as cut from crystal as clear as ice.'],
    description: [
      '칼날에 수정을 깎은 듯한 면 경계를 새기고 옅은 청색을 입혔으며, 은 코등이와 푸른 보석으로 차갑게 맞췄습니다.',
      'The blade is cut with crystal-like facets in a pale blue tint, matched with a silver guard and blue gems for a cold finish.',
    ],
    lore: [
      '만년설 속에서만 자라는 수정을 녹이지 않고 깎아 냈다는 설정으로, 칼자루를 쥐면 손끝에 서리가 앉는다고 합니다.',
      'Its lore says it was cut, never melted, from a crystal that grows only in eternal snow, and frost gathers on the hand that grips it.',
    ],
    material: [
      '아크릴 칼날(날 없음), 은도금 황동, 유리 보석',
      'Acrylic blade (unsharpened), silver-plated brass, glass gems',
    ],
    specs: [800, 1030, 900],
    price: 3_800_000,
    art: {
      blade: { length: 800, width: 42, curve: 0, edge: 'double', tip: 'spear', material: 'crystal' },
      guard: { type: 'cross', width: 190, color: SILVER, accent: SAPPHIRE },
      grip: { length: 180, color: '#2f4a6a', wrap: 'wire', wrapColor: SILVER },
      pommel: { type: 'gem', color: SILVER, gem: SAPPHIRE },
    },
  }),
  fantasy({
    slug: 'emberwave-sword',
    name: ['홍염 물결검', 'Emberwave Sword', 'Emberwave Sword'],
    style: ['판타지 · 마법의 검(불)', 'Fantasy · magic sword (fire)'],
    summary: ['불길처럼 굽이치는 붉은빛 칼날의 검.', 'A sword whose reddish blade ripples like flame.'],
    description: [
      '굽이치는 칼날에 붉은 담금 빛을 입히고 룬처럼 보이는 새김을 넣었으며, 금빛 코등이 끝을 불꽃처럼 말았습니다.',
      'A rippling blade with a red temper glow and rune-like engravings, its gold quillons curling like flames.',
    ],
    lore: [
      '화산 속 대장간에서 용암으로 담금질했다는 설정으로, 칼집에서 뽑을 때마다 칼날의 물결이 한 번씩 일렁인다고 합니다.',
      'In its lore it was quenched in lava in a volcano forge, and its ripples stir each time it leaves the scabbard.',
    ],
    specs: [880, 1130, 1500],
    price: 4_200_000,
    art: {
      blade: {
        length: 880,
        width: 46,
        curve: 0,
        edge: 'double',
        tip: 'spear',
        wave: 5,
        waves: 8,
        color: FLAME,
        inscription: 'runes',
      },
      guard: { type: 'quillon', width: 200, color: GOLD, accent: RUBY },
      grip: { length: 190, color: '#5a1f1a', wrap: 'helix', wrapColor: GOLD },
      pommel: { type: 'gem', color: GOLD, gem: RUBY },
    },
  }),
  fantasy({
    slug: 'wyrmbone-greatsword',
    name: ['용골 대검', 'Wyrmbone Greatsword', 'Wyrmbone Greatsword'],
    kind: 'great',
    style: ['다크 판타지 · 용살검', 'Dark fantasy · dragon-slaying sword'],
    summary: [
      '쓰러뜨린 용의 뼈를 깎아 만들었다는 대검.',
      'A greatsword imagined as carved from a slain dragon’s bone.',
    ],
    description: [
      '뼈처럼 누런 흰빛의 넓은 칼날에 등줄을 굵게 세우고, 칼끝 쪽을 넓혀 무게를 앞에 실었습니다. 손잡이는 가죽을 거칠게 감았습니다.',
      'A broad blade in bone-white with a heavy central ridge, widened toward the point to carry its weight forward, and a roughly leather-wrapped grip.',
    ],
    lore: [
      '용을 쓰러뜨린 사냥꾼이 그 뼈로 다음 사냥에 쓸 칼을 깎았다는 설정입니다.',
      'In its lore, a hunter who felled a dragon carved the blade for the next hunt from its bone.',
    ],
    material: [
      '스테인리스강(날 없음, 뼈빛 도장), 황동, 가죽',
      'Stainless steel (unsharpened, bone-white finish), brass, leather',
    ],
    specs: [1250, 1650, 3800],
    price: 6_800_000,
    stock: 1,
    art: {
      blade: {
        length: 1250,
        width: 92,
        curve: 0,
        edge: 'double',
        tip: 'spear',
        flare: 1.15,
        ridge: true,
        color: '#dcc9a0',
      },
      guard: { type: 'block', width: 230, color: '#9a8a6a' },
      grip: { length: 330, color: '#4a3424', wrap: 'leather' },
      pommel: { type: 'spike', color: '#dcc9a0' },
    },
  }),
  fantasy({
    slug: 'starvow-sword',
    name: ['별빛 성검', 'Starvow Holy Sword', 'Starvow Holy Sword'],
    style: ['하이 판타지 · 성검', 'High fantasy · holy sword'],
    summary: ['칼날에 별자리를 새기고 금으로 꾸민 성검.', 'A holy sword with constellations inlaid along its blade.'],
    description: [
      '곧은 양날 칼날에 금빛 별자리를 상감하고, 끝이 말린 금 코등이와 흰 손잡이, 붉은 보석 자루 머리를 맞췄습니다.',
      'A straight double-edged blade inlaid with golden constellations, with scrolled gold quillons, a white grip and a red gem in the pommel.',
    ],
    lore: [
      '기사단에 들어온 이가 별 아래에서 맹세할 때 받는다는 설정으로, 맹세를 어길 때마다 별이 하나씩 빛을 잃는다고 합니다.',
      'In its lore, initiates of the order receive it while swearing under the stars, and a star dims for every broken vow.',
    ],
    specs: [900, 1150, 1450],
    price: 5_200_000,
    art: {
      blade: { length: 900, width: 50, curve: 0, edge: 'double', tip: 'spear', fuller: true, inscription: 'stars' },
      guard: { type: 'quillon', width: 230, color: GOLD_LIGHT, accent: RUBY },
      grip: { length: 200, color: '#ece6d6', wrap: 'wire', wrapColor: GOLD },
      pommel: { type: 'gem', color: GOLD, gem: RUBY },
    },
  }),
  fantasy({
    slug: 'nightshade-blade',
    name: ['밤그림자 마검', 'Nightshade Blade', 'Nightshade Blade'],
    kind: 'curved',
    style: ['다크 판타지 · 마검', 'Dark fantasy · demon blade'],
    summary: ['빛을 빨아들이는 듯한 검은 칼날의 마검.', 'A cursed sword whose black blade seems to drink the light.'],
    description: [
      '살짝 휜 외날을 짙은 보랏빛 검정으로 칠하고 룬처럼 보이는 새김을 넣었으며, 비대칭 코등이에 자수정을 박고 자루 끝을 뾰족하게 마감했습니다.',
      'A gently curved single edge in deep violet-black with rune-like engravings, an asymmetric guard set with amethyst and a spiked pommel.',
    ],
    lore: [
      '지닌 이의 그림자를 먹고 자란다는 설정으로, 오래 지닐수록 한낮에도 그림자가 옅어진다고 합니다.',
      'Its lore says it feeds on its bearer’s shadow; the longer it is carried, the paler that shadow grows, even at noon.',
    ],
    material: [
      '흑색 도장 스테인리스강(날 없음), 철, 유리 보석',
      'Black-finished stainless steel (unsharpened), iron, glass gem',
    ],
    specs: [780, 1040, 1100],
    price: 4_600_000,
    art: {
      blade: {
        length: 780,
        width: 34,
        curve: 14,
        edge: 'single',
        tip: 'kissaki',
        color: '#3a3346',
        inscription: 'runes',
      },
      guard: { type: 'ganja', width: 90, color: NIGHT, accent: AMETHYST },
      grip: { length: 230, color: NIGHT, wrap: 'diamond', wrapColor: AMETHYST },
      pommel: { type: 'spike', color: NIGHT },
    },
  }),
  fantasy({
    slug: 'thunderfork-sword',
    name: ['뇌명 쌍갈래검', 'Thunderfork Sword', 'Thunderfork Sword'],
    style: ['판타지 · 마법의 검(번개)', 'Fantasy · magic sword (lightning)'],
    summary: ['칼끝이 번개처럼 두 갈래로 갈라진 검.', 'A sword whose point splits in two like forked lightning.'],
    description: [
      '두 갈래 칼끝과 굽이치는 칼날로 번개 줄기를 그리고, 푸른빛 칼날에 은 코등이와 사파이어를 맞췄습니다.',
      'A forked point and rippling blade trace a bolt of lightning, in blue-tinted steel with a silver guard and sapphires.',
    ],
    lore: [
      '폭풍의 탑 꼭대기에 꽂아 두고 벼락으로 벼렸다는 설정으로, 천둥이 치는 밤이면 칼이 혼자 운다고 합니다.',
      'Its lore says it was forged by lightning atop a storm tower, and on thundering nights it hums by itself.',
    ],
    material: [
      '청색 도장 스테인리스강(날 없음), 은도금 황동, 유리 보석',
      'Blue-finished stainless steel (unsharpened), silver-plated brass, glass gems',
    ],
    specs: [860, 1100, 1400],
    price: 4_400_000,
    art: {
      blade: {
        length: 860,
        width: 44,
        curve: 0,
        edge: 'double',
        tip: 'fork',
        wave: 4,
        waves: 5,
        ridge: true,
        color: '#9fb2c8',
      },
      guard: { type: 'cross', width: 180, color: SILVER, accent: SAPPHIRE },
      grip: { length: 190, color: '#24324a', wrap: 'helix', wrapColor: SILVER },
      pommel: { type: 'gem', color: SILVER, gem: SAPPHIRE },
    },
  }),
  fantasy({
    slug: 'rootbough-sword',
    name: ['세계수 가지검', 'Rootbough Sword', 'Rootbough Sword'],
    style: ['하이 판타지 · 드루이드', 'High fantasy · druids'],
    summary: [
      '오래된 나무의 가지를 그대로 깎았다는 나무 검.',
      'A wooden sword imagined as whittled from an ancient tree’s branch.',
    ],
    description: [
      '나뭇결이 살아 있는 칼날에 금빛 룬처럼 보이는 새김을 넣고, 뿌리처럼 감은 손잡이 끝에 호박을 박았습니다.',
      'A wood-grain blade carved with golden rune-like marks, a grip bound like roots and amber set in the pommel.',
    ],
    lore: [
      '드루이드가 천 년 된 나무에게 허락을 받고 가지 하나를 얻어 깎았다는 설정으로, 쇠보다 단단하다고 합니다.',
      'In its lore a druid asked a thousand-year-old tree for a single branch and carved it; it is said to be harder than steel.',
    ],
    material: ['단단한 나무(오크), 황동, 수지 호박', 'Hardwood (oak), brass, resin amber'],
    specs: [700, 950, 700],
    price: 1_800_000,
    stock: 3,
    art: {
      blade: {
        length: 700,
        width: 40,
        curve: 6,
        edge: 'double',
        tip: 'round',
        material: 'wood',
        inscription: 'runes',
      },
      guard: { type: 'block', width: 90, color: '#6a4a2a' },
      grip: { length: 190, color: '#5a3a1e', wrap: 'cord', wrapColor: '#3a2a14' },
      pommel: { type: 'gem', color: GOLD, gem: AMBER },
    },
  }),
  fantasy({
    slug: 'threefold-greatsword',
    name: ['삼합 대검', 'Threefold Greatsword', 'Threefold Greatsword'],
    kind: 'great',
    style: ['게임풍 · 합체검', 'Game style · combining sword'],
    summary: [
      '칼날 세 장을 맞물려 하나로 만든 합체 대검.',
      'A combining greatsword built from three interlocking blades.',
    ],
    description: [
      '가운데 대검 양옆에 칼 두 자루를 볼트로 맞물렸다는 설정을 칼날의 이음선과 볼트로 새겼습니다. 게임 속 거대한 합체검의 형식을 빌렸고, 실제로 나뉘지는 않습니다.',
      'The idea—two blades bolted to either side of a central greatsword—is carved as seams and bolts along the blade. The form borrows from the giant combining swords of games; it does not actually come apart.',
    ],
    lore: [
      '평소에는 한 자루 대검으로 쓰다가, 상대에 따라 풀어서 가벼운 칼 두 자루와 대검으로 바꿔 든다는 설정입니다.',
      'In its lore it is wielded as a single greatsword, then unlocked into two light blades and a greatsword as the fight demands.',
    ],
    material: [`${STEEL_BLUNT}, 강철 볼트, 가죽`, `${STEEL_BLUNT_EN}, steel bolts, leather`],
    specs: [1300, 1720, 4800],
    price: 9_200_000,
    stock: 1,
    art: {
      blade: { length: 1300, width: 130, curve: 0, edge: 'single', tip: 'clip', segments: 3 },
      guard: { type: 'block', width: 200, color: '#4a4a4e' },
      grip: { length: 340, color: '#2a2622', wrap: 'ribbed' },
      pommel: { type: 'ring', color: '#4a4a4e' },
    },
  }),
  fantasy({
    slug: 'giants-cleaver',
    name: ['거인 식칼', "Giant's Cleaver", "Giant's Cleaver"],
    kind: 'great',
    style: ['게임풍 · 거대 무기', 'Game style · oversized weapon'],
    summary: ['푸줏간 식칼을 몇 배로 키운 듯한 거대한 칼.', 'A butcher’s cleaver blown up several times over.'],
    description: [
      '날이 배처럼 둥글고 칼끝으로 갈수록 넓어지는 외날을 네모나게 끝내 무게를 앞에 몰았고, 코등이 없이 긴 자루를 바로 이었습니다. 게임에서 거인이나 괴력의 전사가 드는 터무니없이 큰 무기의 형식을 빌렸습니다.',
      'A single edge that broadens and bellies toward its square end throws the weight forward, with a long grip joined directly and no guard—borrowing the form of the absurdly large weapons wielded by giants and strongmen in games.',
    ],
    lore: [
      '거인족 요리사가 쓰던 식칼을 사람이 무기로 주워 들었다는 설정으로, 두 손으로도 겨우 들린다고 합니다.',
      'In its lore it was a giant cook’s cleaver that a human picked up as a weapon—barely liftable even with two hands.',
    ],
    material: [`${STEEL_BLUNT}, 가죽`, `${STEEL_BLUNT_EN}, leather`],
    specs: [800, 1250, 4200],
    price: 5_400_000,
    stock: 1,
    art: {
      blade: {
        length: 800,
        width: 240,
        curve: -10,
        edge: 'single',
        tip: 'square',
        flare: 1.15,
      },
      guard: { type: 'none', width: 0, color: '#3a3532' },
      grip: { length: 380, color: '#3a2a20', wrap: 'leather' },
      pommel: { type: 'ring', color: '#3a3532' },
    },
  }),
  fantasy({
    slug: 'steamwork-greatsword',
    name: ['증기 기관 대검', 'Steamwork Greatsword', 'Steamwork Greatsword'],
    kind: 'great',
    style: ['게임풍 · 스팀펑크', 'Game style · steampunk'],
    summary: [
      '황동 덧쇠와 볼트로 기계처럼 조립한 대검.',
      'A greatsword assembled like a machine from brass plates and bolts.',
    ],
    description: [
      '칼날 밑동을 황동 덧쇠로 감싸 리벳을 박고, 칼날을 두 장으로 나눠 맞물린 이음선과 볼트를 새겼습니다. 고리 보호대와 바퀴 모양 자루 머리로 기계 장치처럼 꾸몄습니다.',
      'Brass sleeving riveted over the blade root, a blade split into two interlocking plates with seams and bolts, side rings and a wheel pommel give it the look of a machine.',
    ],
    lore: [
      '손잡이 속 작은 증기 기관이 칼날을 떨게 해 무엇이든 벤다는 설정이지만, 이 장식품에는 기관이 들어 있지 않습니다.',
      'In its lore a tiny steam engine in the grip makes the blade shudder to cut through anything—though this display piece has no engine inside.',
    ],
    material: [`${STEEL_BLUNT}, 황동, 강철 볼트, 가죽`, `${STEEL_BLUNT_EN}, brass, steel bolts, leather`],
    specs: [1150, 1560, 4200],
    price: 7_200_000,
    stock: 1,
    art: {
      blade: {
        length: 1150,
        width: 96,
        curve: 0,
        edge: 'double',
        tip: 'spear',
        segments: 2,
        sleeve: { length: 260, color: GOLD },
      },
      guard: { type: 'ring', width: 260, color: GOLD },
      grip: { length: 330, color: '#3a2a20', wrap: 'wire', wrapColor: GOLD },
      pommel: { type: 'wheel', color: GOLD },
    },
  }),
  fantasy({
    slug: 'chain-whip-sword',
    name: ['사복검', '蛇腹劍', 'Chain-Whip Sword'],
    kind: 'exotic',
    style: ['게임풍 · 사복검', 'Game style · whip sword'],
    summary: [
      '마디마다 나뉘어 채찍처럼 풀린다는 검.',
      'A sword imagined to come apart at its joints and lash out like a whip.',
    ],
    description: [
      '칼날을 열두 마디로 나눈 V자 이음매와 이음매마다 박은 핀을 새겼습니다. 게임과 만화에서 칼날이 철선을 따라 풀리는 사복검의 형식을 빌렸고, 이 장식품은 실제로 풀리지 않습니다.',
      'The blade is carved into twelve segments with V-shaped joints, each with its pin. The form borrows from the segmented whip swords of games and manga; this display piece does not actually come apart.',
    ],
    lore: [
      '손잡이의 방아쇠를 당기면 마디를 잇는 철선이 풀려 채찍이 되고, 다시 당기면 한 자루로 감긴다는 설정입니다.',
      'In its lore, a trigger in the grip slackens the wire between the segments into a whip, and a second pull reels it back into one blade.',
    ],
    material: [`${STEEL_BLUNT}, 강철 핀, 가죽`, `${STEEL_BLUNT_EN}, steel pins, leather`],
    specs: [850, 1090, 1500],
    price: 4_900_000,
    art: {
      blade: { length: 850, width: 40, curve: 0, edge: 'double', tip: 'spear', links: 11, color: '#b9bec4' },
      guard: { type: 'cross', width: 150, color: SILVER },
      grip: { length: 190, color: '#2a2a30', wrap: 'wire', wrapColor: SILVER },
      pommel: { type: 'ball', color: SILVER },
    },
  }),
  fantasy({
    slug: 'novice-heros-sword',
    name: ['견습 용사의 검', "Novice Hero's Sword", "Novice Hero's Sword"],
    style: ['게임풍 · 롤플레잉 시작 장비', 'Game style · RPG starter gear'],
    summary: [
      '첫 마을 무기점에 걸려 있을 법한 기본 그대로의 한 손 검.',
      'The no-frills one-handed sword you might find in the first town’s weapon shop.',
    ],
    description: [
      '곧은 양날에 가운데 홈 하나, 곧은 코등이와 가죽 손잡이, 둥근 자루 머리만 갖춘 가장 기본적인 모양입니다. 롤플레잉 게임의 첫 장비에서 형식을 빌렸습니다.',
      'A straight double-edged blade with a single fuller, a straight crossguard, a leather grip and a round pommel—the most basic form, borrowed from the first gear of role-playing games.',
    ],
    lore: [
      '모험을 막 시작한 용사가 처음 쥐는 검이라는 설정으로, 여행이 끝나도 이 검만은 버리지 못한다고 합니다.',
      'In its lore it is the first sword a fledgling hero holds—and the one they never part with, even when the journey ends.',
    ],
    material: [`${STEEL_BLUNT}, 철 장식, 가죽`, `${STEEL_BLUNT_EN}, iron fittings, leather`],
    specs: [760, 970, 1100],
    price: 690_000,
    stock: 8,
    art: {
      blade: { length: 760, width: 44, curve: 0, edge: 'double', tip: 'spear', fuller: true },
      guard: { type: 'cross', width: 170, color: '#8a6a3a' },
      grip: { length: 140, color: '#6a4528', wrap: 'leather' },
      pommel: { type: 'ball', color: '#8a6a3a' },
    },
  }),
];
