import type { CatalogEntry } from './build';

const BRONZE = '#9c7a3c';
const BRASS = '#a8823a';
const GOLD = '#b48a3c';
const IRON = '#3a3532';
const BLACK = '#1f1c1a';
const SILVER = '#9a9a96';
const SAMEGAWA = '#efe7da';

const REPLICA_KO = '공방에서 새로 만든 재현품입니다.';
const REPLICA_EN = 'A new workshop replica.';

/**
 * 1.1.0에 더한 단검. 이미 있는 단검 17점(탄토·쿠나이·대거·더크 등)과 겹치지 않는 것만 골랐습니다.
 * 킨잘·페어번-사익스·마체테는 나무위키 「나이프」의 종류 목록에서 가져왔습니다.
 */
export const DAGGER_ENTRIES: CatalogEntry[] = [
  {
    slug: 'yoroi-doshi',
    name: ['요로이도시', '鎧通し', 'Yoroi-dōshi'],
    category: 'east',
    kind: 'dagger',
    origin: 'JP',
    era: ['일본 · 14~16세기', 'Japan · 14th–16th century'],
    summary: [
      '갑옷 틈을 뚫으려고 등을 두껍게 만든 일본 단도.',
      'A thick-backed Japanese dagger made to pierce gaps in armour.',
    ],
    description: [
      `칼날 밑동의 두께가 1cm에 가까울 만큼 두껍고 곧게 뻗어, 맞붙어 싸울 때 갑옷 틈을 찌르기 좋습니다. 오른쪽 허리에 칼자루가 뒤를 향하게 거꾸로 찼습니다. ${REPLICA_KO}`,
      `The straight blade is nearly 1 cm thick at the base, made for stabbing into armour gaps while grappling. It was worn reversed on the right hip with the hilt facing back. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 철 코등이, 상어가죽·면 끈', 'High-carbon steel, iron guard, ray skin and cotton cord'],
    stories: [
      [
        '전국 시대',
        'Sengoku period',
        '갑옷을 입고 맞붙어 싸우는 구미우치(組討)에서, 넘어뜨린 상대의 갑옷 틈을 찌르는 데 썼습니다.',
        'In kumiuchi, armoured grappling, it was used to stab between the plates of a downed opponent.',
      ],
    ],
    specs: [250, 390, 360],
    edge: 'sharp',
    price: 1_900_000,
    stock: 3,
    art: {
      blade: { length: 250, width: 30, curve: 0, edge: 'single', tip: 'kissaki', ridge: true },
      guard: { type: 'disc', width: 44, color: IRON, accent: GOLD },
      grip: { length: 105, color: SAMEGAWA, wrap: 'diamond', wrapColor: BLACK },
      pommel: { type: 'cap', color: IRON },
    },
  },
  {
    slug: 'kaiken',
    name: ['카이켄', '懐剣', 'Kaiken'],
    category: 'east',
    kind: 'dagger',
    origin: 'JP',
    era: ['일본 · 17~19세기', 'Japan · 17th–19th century'],
    summary: [
      '무사 집안 여성이 품에 지니던 코등이 없는 단도.',
      'A guardless dagger carried inside the kimono by women of samurai families.',
    ],
    description: [
      `코등이 없이 칼자루와 칼집이 맞닿는 아이쿠치 꾸밈으로, 비단 주머니에 넣어 품에 지녔습니다. 칼날은 한 뼘 남짓이고 주머니 끈을 술로 늘어뜨렸습니다. ${REPLICA_KO}`,
      `An aikuchi mount with no guard, the hilt meeting the scabbard flush; it was kept in a silk bag inside the kimono. The blade is about a hand-span long, with the bag cord hanging as a tassel. ${REPLICA_EN}`,
    ],
    material: [
      '고탄소강, 옻칠한 나무 칼자루, 금도금 장식, 비단 끈',
      'High-carbon steel, lacquered wooden hilt, gilt fittings, silk cord',
    ],
    stories: [
      [
        '오늘날',
        'Today',
        '지금도 전통 혼례복을 입는 신부가 비단 주머니에 든 카이켄을 앞섶에 꽂는 풍습이 남아 있습니다.',
        'Brides in traditional wedding kimono still tuck a kaiken in a brocade bag into the front of the robe.',
      ],
    ],
    specs: [160, 260, 160],
    edge: 'sharp',
    price: 980_000,
    stock: 4,
    art: {
      blade: { length: 160, width: 22, curve: 2, edge: 'single', tip: 'kissaki', hamon: true },
      guard: { type: 'none', width: 0, color: BLACK },
      grip: { length: 95, color: '#2a1f1c', wrap: 'plain' },
      pommel: { type: 'cap', color: GOLD },
      tassel: '#a33a4a',
    },
  },
  {
    slug: 'kozuka',
    name: ['코즈카', '小柄', 'Kozuka'],
    category: 'east',
    kind: 'dagger',
    origin: 'JP',
    era: ['일본 · 16~19세기', 'Japan · 16th–19th century'],
    summary: [
      '큰 칼의 칼집 옆에 끼워 다니던 작은 손칼.',
      'A small utility knife slotted into the side of a sword scabbard.',
    ],
    description: [
      `칼자루(코즈카)에 작은 칼날(코가타나)을 끼운 손칼로, 칼집 옆 홈에 꽂아 다녔습니다. ${REPLICA_KO}`,
      `A small blade (kogatana) set in a handle (kozuka), carried in a slot on the side of the scabbard. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 구리 합금(시부이치) 칼자루', 'High-carbon steel, copper-alloy (shibuichi) handle'],
    stories: [
      [
        '에도 시대',
        'Edo period',
        '종이를 자르는 등 일상 도구로 썼고, 칼 장식 장인들이 칼자루에 산수와 동물을 새겨 솜씨를 겨뤄 칼자루만 따로 모으는 이가 많습니다.',
        'An everyday tool for tasks like cutting paper; fittings makers vied to carve landscapes and animals on the handle, which many collect on its own.',
      ],
    ],
    specs: [100, 210, 60],
    edge: 'sharp',
    price: 420_000,
    stock: 6,
    art: {
      blade: { length: 100, width: 13, curve: 0, edge: 'single', tip: 'clip' },
      guard: { type: 'none', width: 0, color: IRON },
      grip: { length: 98, color: '#6b6a64', wrap: 'plain' },
      pommel: { type: 'none', color: '#6b6a64' },
    },
  },
  {
    slug: 'bishou',
    name: ['비수', '匕首', 'Bishou'],
    category: 'east',
    kind: 'dagger',
    origin: 'CN',
    era: ['중국 · 기원전 5~3세기', 'China · 5th–3rd century BC'],
    summary: [
      '머리가 숟가락(匕)을 닮아 이름 붙었다는 중국의 짧은 양날 칼.',
      'A short double-edged Chinese blade, said to be named for a head shaped like a spoon (匕).',
    ],
    description: [
      `곧은 양날에 가운데 등줄을 세우고, 작은 코등이와 둥근 자루 머리를 맞췄습니다. 소매나 두루마리 속에 감출 수 있는 크기입니다. ${REPLICA_KO}`,
      `A straight double-edged blade with a central ridge, a small guard and a rounded pommel—small enough to hide in a sleeve or a scroll. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 청동 장식, 나무 자루', 'High-carbon steel, bronze fittings, wooden grip'],
    stories: [
      [
        '기원전 227년',
        '227 BC',
        '자객 형가가 진나라 왕(뒷날의 진시황)에게 바칠 지도 두루마리 속에 독을 바른 비수를 숨겼다가, 지도를 다 펼친 순간 꺼내 들었습니다. "도궁비현(圖窮匕見)"이라는 말이 여기서 나왔습니다.',
        'The assassin Jing Ke hid a poisoned dagger in a map scroll presented to the King of Qin, later the First Emperor, and seized it as the map unrolled—the source of the idiom "when the map is unrolled, the dagger appears."',
      ],
    ],
    specs: [260, 380, 300],
    edge: 'sharp',
    price: 1_200_000,
    stock: 4,
    art: {
      blade: { length: 260, width: 32, curve: 0, edge: 'double', tip: 'spear', ridge: true },
      guard: { type: 'jian', width: 56, color: BRONZE },
      grip: { length: 95, color: '#3b2a20', wrap: 'cord', wrapColor: '#6a4a2a' },
      pommel: { type: 'jian', color: BRONZE },
    },
  },
  {
    slug: 'cinquedea',
    name: ['친퀘데아', 'Cinquedea', 'Cinquedea'],
    category: 'west',
    kind: 'dagger',
    origin: 'IT',
    era: ['이탈리아 · 15~16세기', 'Italy · 15th–16th century'],
    summary: [
      '칼날 밑동이 다섯 손가락만큼 넓은 이탈리아의 단검.',
      'An Italian short blade as wide as five fingers at the hilt.',
    ],
    description: [
      `이름은 '다섯 손가락'이라는 뜻입니다. 밑동에서 칼끝까지 곧게 좁아지는 넓은 칼날에 홈을 파고, 칼날 쪽으로 휜 코등이와 뼈 자루를 맞췄습니다. ${REPLICA_KO}`,
      `The name means "five fingers". A broad blade tapering straight to the point with fullers, a guard arched toward the blade and a bone grip. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 금도금 황동, 뼈 자루', 'High-carbon steel, gilt brass, bone grip'],
    stories: [
      [
        '르네상스',
        'Renaissance',
        '페라라·베네치아 같은 북이탈리아 도시의 시민들이 허리 뒤에 가로로 찼고, 칼날에 신화 장면을 새기고 금을 입힌 호화로운 것이 많이 남았습니다.',
        'Citizens of northern Italian cities such as Ferrara and Venice wore it across the small of the back; many surviving blades are etched with mythological scenes and gilded.',
      ],
    ],
    specs: [400, 540, 900],
    edge: 'sharp',
    price: 2_600_000,
    stock: 2,
    art: {
      blade: { length: 400, width: 85, curve: 0, edge: 'double', tip: 'spear', fuller: true, flare: 0.3 },
      guard: { type: 'cross', width: 130, color: GOLD },
      grip: { length: 100, color: '#e9dfc8', wrap: 'plain' },
      pommel: { type: 'cap', color: GOLD },
    },
  },
  {
    slug: 'misericorde',
    name: ['미세리코드', 'Miséricorde', 'Misericorde'],
    category: 'west',
    kind: 'dagger',
    origin: 'FR',
    era: ['프랑스·잉글랜드 · 14~16세기', 'France and England · 14th–16th century'],
    summary: [
      '쓰러진 기사에게 마지막 일격을 주던 가늘고 긴 단검.',
      'The slender dagger that gave the final "mercy" stroke to a fallen knight.',
    ],
    description: [
      `이름은 라틴어 '자비(misericordia)'에서 왔습니다. 사슬 갑옷의 고리나 투구 눈구멍을 뚫도록 가는 칼날을 송곳처럼 길게 뽑았습니다. ${REPLICA_KO}`,
      `Named from the Latin misericordia, "mercy". The narrow, awl-like blade was made to slip through mail rings or a visor's eye-slit. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 철 장식, 나무 자루', 'High-carbon steel, iron fittings, wooden grip'],
    stories: [
      [
        '중세 후기',
        'Late Middle Ages',
        '판금 갑옷을 입은 기사는 칼로 베기 어려워, 넘어뜨린 뒤 갑옷 틈에 이 단검을 겨누어 항복을 받거나 숨을 끊었습니다.',
        'Plate-armoured knights were hard to cut, so a downed knight was held at the point of this dagger, through a gap in his armour, until he yielded—or was killed.',
      ],
    ],
    specs: [300, 420, 280],
    edge: 'sharp',
    price: 1_100_000,
    stock: 3,
    art: {
      blade: { length: 300, width: 18, curve: 0, edge: 'double', tip: 'needle', ridge: true },
      guard: { type: 'cross', width: 60, color: IRON },
      grip: { length: 100, color: '#4a3424', wrap: 'leather' },
      pommel: { type: 'ball', color: IRON },
    },
  },
  {
    slug: 'seax',
    name: ['색스', 'Seax', 'Seax'],
    category: 'west',
    kind: 'dagger',
    origin: 'GB',
    era: ['앵글로색슨·프랑크 · 5~10세기', 'Anglo-Saxon and Frankish · 5th–10th century'],
    summary: [
      '색슨족이라는 이름의 뿌리로 꼽히는 게르만의 외날 칼.',
      'The single-edged Germanic knife often linked to the very name of the Saxons.',
    ],
    description: [
      `등이 칼끝 쪽에서 꺾여 내려오는 '꺾인 등' 모양에, 칼날 옆면에 룬 문자 띠를 새겼습니다. 허리띠에 가로로 찼습니다. ${REPLICA_KO}`,
      `A "broken-back" blade whose spine angles down toward the point, with a band of runes along its side. It was worn horizontally at the belt. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 구리·은 선 상감, 뿔 자루', 'High-carbon steel, copper and silver wire inlay, horn grip'],
    stories: [
      [
        '10세기',
        '10th century',
        '템스강에서 나온 「베아그노스의 색스」에는 앵글로색슨 룬 문자 스물여덟 자가 모두 새겨져 있으며, 지금은 영국 박물관에 있습니다.',
        'The Seax of Beagnoth, found in the Thames, is inlaid with the complete 28-letter Anglo-Saxon runic alphabet; it is now in the British Museum.',
      ],
    ],
    specs: [320, 480, 420],
    edge: 'sharp',
    price: 1_400_000,
    stock: 3,
    art: {
      blade: { length: 320, width: 38, curve: 0, edge: 'single', tip: 'clip', inscription: 'runes' },
      guard: { type: 'none', width: 0, color: IRON },
      grip: { length: 140, color: '#5a4636', wrap: 'plain' },
      pommel: { type: 'cap', color: '#8a8a84' },
    },
  },
  {
    slug: 'kard',
    name: ['카르드', 'کارد', 'Kard'],
    category: 'middle',
    kind: 'dagger',
    origin: 'IR',
    era: ['페르시아 · 16~19세기', 'Persia · 16th–19th century'],
    summary: [
      '곧은 외날을 송곳처럼 뽑은 페르시아의 단검.',
      'A Persian dagger with a straight single edge drawn to an awl-like point.',
    ],
    description: [
      `코등이 없이 자루와 칼날을 바로 잇고, 두꺼운 등에서 칼끝까지 곧게 좁혀 찌르기 좋게 했습니다. 칼날 밑동은 금빛 깃으로 감쌌습니다. ${REPLICA_KO}`,
      `There is no guard—the grip meets the blade directly—and the thick-backed blade narrows straight to a piercing point, its base bound with a gilt collar. ${REPLICA_EN}`,
    ],
    material: [
      '다마스쿠스 문양강, 금도금 깃, 상아빛 수지 자루',
      'Pattern-welded steel, gilt collar, ivory-tone resin grip',
    ],
    stories: [
      [
        '사파비 왕조',
        'Safavid era',
        '페르시아에서 오스만 제국과 무굴 제국까지 널리 퍼져, 허리띠에 꽂아 다니는 일상의 칼이자 장신구가 되었습니다.',
        'It spread from Persia to the Ottoman and Mughal empires, becoming both an everyday belt knife and an ornament.',
      ],
    ],
    specs: [260, 380, 260],
    edge: 'sharp',
    price: 1_350_000,
    stock: 3,
    art: {
      blade: { length: 260, width: 24, curve: 0, edge: 'single', tip: 'needle' },
      collar: { color: GOLD },
      guard: { type: 'none', width: 0, color: GOLD },
      grip: { length: 110, color: '#e8dcc2', wrap: 'plain' },
      pommel: { type: 'none', color: GOLD },
    },
  },
  {
    slug: 'bowie-knife',
    name: ['보위 나이프', 'Bowie knife', 'Bowie Knife'],
    category: 'americas',
    kind: 'dagger',
    origin: 'US',
    era: ['미국 · 19세기', 'United States · 19th century'],
    summary: ['개척 시대 미국을 대표하는 클립 포인트 큰 칼.', 'The big clip-point knife of the American frontier.'],
    description: [
      `칼등이 칼끝 쪽에서 오목하게 깎여 내려오는 클립 포인트에, 손을 지키는 코등이와 넉넉한 손잡이를 갖췄습니다. ${REPLICA_KO}`,
      `A clip point sweeping down from the spine, a crossguard to protect the hand and a full-sized grip. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 황동 코등이, 호두나무 손잡이', 'High-carbon steel, brass guard, walnut grip'],
    stories: [
      [
        '1827년',
        '1827',
        '미시시피강 모래톱에서 벌어진 싸움(샌드바 싸움)에서 제임스 보위가 큰 칼로 살아남은 이야기가 퍼지며, 같은 모양의 칼에 그의 이름이 붙었습니다.',
        'After James Bowie survived the 1827 Sandbar Fight on the Mississippi with a large knife, knives of its kind took his name.',
      ],
    ],
    specs: [250, 380, 450],
    edge: 'sharp',
    price: 780_000,
    stock: 5,
    art: {
      blade: { length: 250, width: 40, curve: 0, edge: 'single', tip: 'clip' },
      guard: { type: 'cross', width: 80, color: BRASS },
      grip: { length: 120, color: '#5a3a22', wrap: 'plain' },
      pommel: { type: 'cap', color: BRASS },
    },
  },
  {
    slug: 'mark-i-trench-knife',
    name: ['M1918 참호 칼', 'U.S. Mark I trench knife', 'Mark I Trench Knife'],
    category: 'americas',
    kind: 'dagger',
    origin: 'US',
    era: ['미국 · 20세기 초(제1차 세계 대전)', 'United States · early 20th century (First World War)'],
    summary: [
      '손잡이에 너클을 붙인 제1차 세계 대전의 참호전 칼.',
      'A First World War trench-fighting knife with a knuckle-duster grip.',
    ],
    description: [
      `좁은 참호에서 쓰도록 양날 단검에 손가락을 끼우는 청동 너클 손잡이를 붙이고, 자루 끝은 내려치기 좋게 뾰족한 쇠로 마감했습니다. ${REPLICA_KO}`,
      `Made for cramped trenches: a double-edged blade on a bronze knuckle-guard grip, finished with a pointed iron pommel for striking. ${REPLICA_EN}`,
    ],
    material: ['탄소강, 청동 너클 손잡이', 'Carbon steel, bronze knuckle-guard grip'],
    stories: [
      [
        '1918년',
        '1918',
        '미국 원정군이 앞선 참호 칼들의 불만을 받아들여 만든 모델로, 미국과 프랑스의 공장에서 만들어 전쟁 막바지의 서부 전선에 보냈습니다.',
        'Developed for the American Expeditionary Forces after complaints about earlier trench knives, it was made in American and French factories and sent to the Western Front as the war drew to a close.',
      ],
    ],
    specs: [170, 300, 500],
    edge: 'sharp',
    price: 690_000,
    stock: 4,
    art: {
      blade: { length: 170, width: 30, curve: 0, edge: 'double', tip: 'spear', ridge: true },
      guard: { type: 'dguard', width: 40, color: BRONZE },
      grip: { length: 105, color: BRONZE, wrap: 'ribbed' },
      pommel: { type: 'spike', color: '#5a5550' },
    },
  },
  {
    slug: 'kindjal',
    name: ['킨잘', 'Кинжал', 'Kindjal'],
    category: 'west',
    kind: 'dagger',
    origin: 'RU',
    era: ['캅카스 · 18~19세기', 'Caucasus · 18th–19th century'],
    summary: [
      '곧은 양날에 홈을 엇갈려 판 캅카스의 단검.',
      'The straight double-edged dagger of the Caucasus, with offset fullers.',
    ],
    description: [
      `넓고 곧은 양날이 칼끝까지 고르게 좁아지고, 칼날 두 면의 홈을 서로 엇갈리게 파 단단하게 했습니다. 코등이 없이 자루와 칼날을 잇고 은 장식을 둘렀습니다. 조지아에서는 칸잘리라 부릅니다. ${REPLICA_KO}`,
      `A broad, straight double edge tapering evenly to the point, its fullers offset on each face for stiffness; guardless, with silver mounts. In Georgia it is called khanjali. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 은 장식(니엘로), 뿔 자루', 'High-carbon steel, silver mounts (niello), horn grip'],
    stories: [
      [
        '19세기',
        '19th century',
        '캅카스 산악 민족과 카자크가 샤쉬카와 함께 허리에 찼고, 러시아 제국 군대도 이를 받아들였습니다.',
        'Caucasian highlanders and Cossacks wore it at the belt alongside the shashka, and the Imperial Russian army adopted it.',
      ],
    ],
    specs: [400, 540, 520],
    edge: 'sharp',
    price: 1_500_000,
    stock: 3,
    art: {
      blade: { length: 400, width: 46, curve: 0, edge: 'double', tip: 'spear', fuller: true },
      collar: { color: SILVER },
      guard: { type: 'none', width: 0, color: SILVER },
      grip: { length: 110, color: '#2a2420', wrap: 'plain' },
      pommel: { type: 'cap', color: SILVER },
    },
  },
  {
    slug: 'fairbairn-sykes',
    name: ['페어번-사익스 전투 단검', 'Fairbairn–Sykes fighting knife', 'Fairbairn–Sykes Fighting Knife'],
    category: 'west',
    kind: 'dagger',
    origin: 'GB',
    era: ['영국 · 20세기(제2차 세계 대전)', 'United Kingdom · 20th century (Second World War)'],
    summary: [
      '영국 코만도를 상징하게 된 가늘고 곧은 양날 단검.',
      'The slender double-edged dagger that became the emblem of the British Commandos.',
    ],
    description: [
      `찌르기 좋게 가늘고 곧은 양날에, 미끄러지지 않도록 가로 홈을 촘촘히 새긴 둥근 손잡이를 달았습니다. ${REPLICA_KO}`,
      `A slim, straight double-edged blade built for thrusting, on a round grip ringed with close ridges for a sure hold. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 황동 손잡이(검은 도장)', 'High-carbon steel, brass grip (blackened)'],
    stories: [
      [
        '1941년',
        '1941',
        '상하이 공부국 경찰에서 근접 격투를 가르친 윌리엄 페어번과 에릭 사익스가 설계해 제2차 세계 대전의 영국 코만도가 지녔고, 지금도 여러 나라 특수부대의 휘장에 그려집니다.',
        'Designed by William Fairbairn and Eric Sykes, who had taught close combat to the Shanghai Municipal Police, it was carried by British Commandos in the Second World War and still appears on special forces insignia in many countries.',
      ],
    ],
    specs: [178, 295, 230],
    edge: 'sharp',
    price: 890_000,
    stock: 4,
    art: {
      blade: { length: 178, width: 22, curve: 0, edge: 'double', tip: 'spear', ridge: true },
      guard: { type: 'cross', width: 56, color: '#2a2a2a' },
      grip: { length: 105, color: '#3a3a36', wrap: 'ribbed' },
      pommel: { type: 'ball', color: '#3a3a36' },
    },
  },
  {
    slug: 'machete',
    name: ['마체테', 'Machete', 'Machete'],
    category: 'americas',
    kind: 'dagger',
    origin: 'MX',
    era: ['중남미 · 16세기~오늘', 'Latin America · 16th century to today'],
    summary: [
      '수수밭과 정글을 베어 나가던 중남미의 큰 칼.',
      'The big blade that cleared cane fields and jungle across Latin America.',
    ],
    description: [
      `곧고 넓은 외날을 칼끝 쪽으로 조금 넓혀 내려치는 힘을 실었고, 손잡이는 나무판 두 쪽을 리벳으로 박았습니다. ${REPLICA_KO}`,
      `A broad, straight single edge widening slightly toward the tip to put weight into the chop, with wooden scales riveted to the grip. ${REPLICA_EN}`,
    ],
    material: ['탄소강, 나무 손잡이, 황동 리벳', 'Carbon steel, wooden grip, brass rivets'],
    stories: [
      [
        '1868년',
        '1868',
        '쿠바 독립 전쟁 첫해에 막시모 고메스가 이끈 반군이 마체테를 들고 돌격해 스페인군을 무너뜨렸고, 이 "마체테 돌격"은 쿠바 독립군의 상징이 되었습니다.',
        'In the first year of Cuba’s war of independence, insurgents led by Máximo Gómez broke a Spanish column with a machete charge, which became a symbol of the Cuban rebels.',
      ],
    ],
    specs: [500, 640, 600],
    edge: 'sharp',
    price: 280_000,
    stock: 8,
    art: {
      blade: { length: 500, width: 48, curve: 0, edge: 'single', tip: 'round', flare: 1.2 },
      guard: { type: 'none', width: 0, color: IRON },
      grip: { length: 130, color: '#5a3a22', wrap: 'plain' },
      pommel: { type: 'cap', color: '#5a3a22' },
    },
  },
];
