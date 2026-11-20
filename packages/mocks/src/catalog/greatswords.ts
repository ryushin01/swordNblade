import type { CatalogEntry } from './build';

const GOLD = '#b48a3c';
const IRON = '#3a3532';
const BLACK = '#1f1c1a';
const LEATHER = '#4a3020';

const REPLICA_KO = '공방에서 새로 만든 재현품입니다.';
const REPLICA_EN = 'A new workshop replica.';

/** 1.1.0에 더한 대검. 이미 있는 대검 15점(츠바이핸더·클레이모어·오오타치 등)과 겹치지 않는 것만 골랐습니다. */
export const GREATSWORD_ENTRIES: CatalogEntry[] = [
  {
    slug: 'nagamaki',
    name: ['나가마키', '長巻', 'Nagamaki'],
    category: 'east',
    kind: 'great',
    origin: 'JP',
    era: ['일본 · 14~16세기', 'Japan · 14th–16th century'],
    summary: ['칼날만큼 긴 자루를 단 일본의 큰 칼.', 'A great Japanese blade on a hilt as long as the blade itself.'],
    description: [
      `큰 칼(오오타치)을 다루기 쉽게 자루를 늘린 데서 나왔다고 봅니다. 끈을 감은 자루가 칼날과 거의 같은 길이라, 두 손을 벌려 쥐고 창처럼 휘둘렀습니다. ${REPLICA_KO}`,
      `Thought to have grown from lengthening the hilt of an ōdachi to make it easier to handle. The cord-wrapped hilt is nearly as long as the blade, gripped with hands spread apart and swung like a polearm. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 철 코등이, 상어가죽·면 끈', 'High-carbon steel, iron guard, ray skin and cotton cord'],
    stories: [
      [
        '에도 시대',
        'Edo period',
        '쓰임이 줄자 많은 나가마키가 자루를 떼고 칼날을 줄여 보통 칼로 고쳐졌고, 이렇게 만든 칼을 나가마키나오시(長巻直し)라 부릅니다.',
        'As they fell out of use, many nagamaki were cut down into ordinary swords; such blades are called nagamaki-naoshi.',
      ],
    ],
    specs: [900, 1800, 2400],
    edge: 'sharp',
    price: 5_900_000,
    stock: 1,
    art: {
      blade: { length: 900, width: 36, curve: 22, edge: 'single', tip: 'kissaki', hamon: true },
      guard: { type: 'disc', width: 82, color: IRON, accent: GOLD },
      grip: { length: 820, color: '#efe7da', wrap: 'diamond', wrapColor: BLACK },
      pommel: { type: 'cap', color: IRON },
    },
  },
  {
    slug: 'kampilan',
    name: ['캄필란', 'Kampilan', 'Kampilan'],
    category: 'east',
    kind: 'great',
    origin: 'PH',
    era: ['필리핀 민다나오 · 16~19세기', 'Mindanao, Philippines · 16th–19th century'],
    summary: [
      '칼끝으로 갈수록 넓어지는 필리핀 모로족의 긴 칼.',
      'The long Moro sword of the Philippines that widens toward the tip.',
    ],
    description: [
      `칼끝 쪽이 넓어지는 외날에, 악어 입처럼 벌어진 자루 머리를 달았습니다. 두 손으로도 쥘 수 있게 자루가 깁니다. ${REPLICA_KO}`,
      `A single-edged blade broadening toward the tip, with a pommel splayed like an open crocodile's mouth. The grip is long enough for two hands. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 단단한 나무 자루, 철 장식', 'High-carbon steel, hardwood hilt, iron fittings'],
    stories: [
      [
        '1521년',
        '1521',
        '막탄 전투에서 마젤란을 쓰러뜨린 "시미터를 닮았지만 더 큰 칼"이 캄필란이었으리라 보는 이가 많아, 라푸라푸의 칼로 널리 그려집니다.',
        'Many believe the "cutlass like a scimitar, only larger" that struck Magellan at the Battle of Mactan was a kampilan, and Lapulapu is widely shown carrying one.',
      ],
    ],
    specs: [900, 1150, 1600],
    edge: 'sharp',
    price: 3_200_000,
    stock: 2,
    art: {
      blade: { length: 900, width: 40, curve: 0, edge: 'single', tip: 'square', flare: 1.7 },
      guard: { type: 'block', width: 70, color: IRON },
      grip: { length: 230, color: '#4a3020', wrap: 'cord', wrapColor: '#8a7a5a' },
      pommel: { type: 'beak', color: '#3a2a20' },
    },
  },
  {
    slug: 'montante',
    name: ['몬탄테', 'Montante', 'Montante'],
    category: 'west',
    kind: 'great',
    origin: 'ES',
    era: ['스페인·포르투갈 · 16~17세기', 'Spain and Portugal · 16th–17th century'],
    summary: [
      '홀로 여럿을 막아 내던 이베리아의 양손검.',
      'The Iberian two-hander used to hold off several opponents at once.',
    ],
    description: [
      `사람 키에 가까운 칼날에 긴 코등이를 달았습니다. 크게 휘둘러 좁은 길을 트거나 사람을 지키는 데 썼습니다. ${REPLICA_KO}`,
      `A blade close to a man's height with a long crossguard, swung in wide arcs to clear a narrow way or to guard a person. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 철 장식, 가죽', 'High-carbon steel, iron fittings, leather'],
    stories: [
      [
        '1651년',
        '1651',
        '포르투갈의 디오구 고메스 드 피게이레두가 몬탄테 다루는 법을 적은 교본을 남겨, 오늘날 역사 검술 연구의 바탕이 되었습니다.',
        'The Portuguese master Diogo Gomes de Figueiredo wrote a treatise on the montante, now a foundation of historical fencing study.',
      ],
    ],
    specs: [1350, 1750, 3000],
    edge: 'sharp',
    price: 6_600_000,
    stock: 1,
    art: {
      blade: { length: 1350, width: 46, curve: 0, edge: 'double', tip: 'spear', ridge: true },
      guard: { type: 'cross', width: 340, color: IRON },
      grip: { length: 360, color: '#3a2a20', wrap: 'leather' },
      pommel: { type: 'ball', color: IRON },
    },
  },
  {
    slug: 'paradeschwert',
    name: ['파라데슈베르트', 'Paradeschwert', 'Parade Sword'],
    category: 'west',
    kind: 'great',
    origin: 'DE',
    era: ['작센 · 16~17세기', 'Saxony · 16th–17th century'],
    summary: [
      '행렬 앞에 세워 위세를 보이던 독일의 의장용 양손검.',
      'A German ceremonial two-hander carried at the head of processions.',
    ],
    description: [
      `불꽃처럼 굽이치는 칼날에 끝이 말린 코등이와 금실을 감은 붉은 손잡이를 맞춰, 싸움보다 보여 주기에 공을 들였습니다. 의장용이라 날을 세우지 않았습니다. ${REPLICA_KO}`,
      `A flame-waved blade, scrolled quillons and a red grip bound in gold wire—made more for show than for battle. As a ceremonial piece it is left unsharpened. ${REPLICA_EN}`,
    ],
    material: [
      '고탄소강(날 없음), 금도금 철 장식, 벨벳 손잡이',
      'High-carbon steel (unsharpened), gilt iron fittings, velvet grip',
    ],
    stories: [
      [
        '1600년 무렵',
        'Around 1600',
        '작센 선제후의 호위대(트라반트)가 들던 큰 칼들이 지금도 드레스덴 무기고(뤼스트카머)에 여럿 남아 있습니다.',
        'Several of the great swords carried by the Saxon Elector’s guard (Trabanten) survive in the Dresden Armoury (Rüstkammer).',
      ],
    ],
    specs: [1300, 1850, 3600],
    edge: 'blunt',
    price: 7_400_000,
    stock: 1,
    art: {
      blade: { length: 1300, width: 52, curve: 0, edge: 'double', tip: 'spear', wave: 6, waves: 10 },
      guard: { type: 'quillon', width: 380, color: GOLD, accent: '#7a1f2a' },
      grip: { length: 380, color: '#7a1f2a', wrap: 'helix', wrapColor: GOLD },
      pommel: { type: 'lobed', color: GOLD },
    },
  },
  {
    slug: 'kriegsmesser',
    name: ['크릭스메서', 'Kriegsmesser', 'Kriegsmesser'],
    category: 'west',
    kind: 'great',
    origin: 'DE',
    era: ['독일 · 15~16세기', 'Germany · 15th–16th century'],
    summary: ['양손으로 쥐는 독일의 큰 외날 칼.', 'The German "war knife"—a great single-edged blade for two hands.'],
    description: [
      `손잡이를 나무판 두 쪽으로 감싸 리벳으로 박은 큰 칼(knife) 구조에, 살짝 휜 외날이 칼끝에서 등 쪽으로 깎여 오릅니다. ${REPLICA_KO}`,
      `Built like a knife—wooden scales riveted to a flat tang—with a slightly curved single edge that rises to a clipped point. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 철 장식, 호두나무 손잡이', 'High-carbon steel, iron fittings, walnut grip'],
    stories: [
      [
        '15세기',
        '15th century',
        '메서는 검이 아닌 큰 칼로 여겨져 평민도 흔히 찼고, 이를 키운 크릭스메서는 싸움터에서 보병과 용병이 두 손으로 휘둘렀습니다.',
        'The messer counted as a knife rather than a sword and was commonly worn by commoners; its enlarged form, the Kriegsmesser, was swung two-handed by foot soldiers and mercenaries.',
      ],
    ],
    specs: [950, 1300, 2100],
    edge: 'sharp',
    price: 4_300_000,
    stock: 2,
    art: {
      blade: { length: 950, width: 44, curve: 12, edge: 'single', tip: 'clip' },
      guard: { type: 'cross', width: 220, color: IRON },
      grip: { length: 300, color: LEATHER, wrap: 'plain' },
      pommel: { type: 'beak', color: IRON },
    },
  },
];
