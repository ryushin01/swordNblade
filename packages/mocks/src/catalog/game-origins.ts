import type { CatalogEntry } from './build';

const GOLD = '#b48a3c';
const IRON = '#3a3532';
const BLACK = '#1f1c1a';
const BRASS = '#a8823a';

const REPLICA_KO = '공방에서 새로 만든 재현품입니다.';
const REPLICA_EN = 'A new workshop replica.';

/**
 * 1.1.0: 게임 속 검의 실제 원형. 이름이 자주 쓰이는 일본의 명검(마사무네·무라마사)과,
 * 나무위키 「가공의 도검」의 건블레이드에 해당하는 실제 겸용 무기(권총 검)
 */
export const GAME_ORIGIN_ENTRIES: CatalogEntry[] = [
  {
    slug: 'honjo-masamune',
    name: ['혼조 마사무네', '本庄正宗', 'Honjō Masamune'],
    category: 'east',
    kind: 'curved',
    origin: 'JP',
    era: ['일본 · 가마쿠라 후기(14세기)', 'Japan · late Kamakura period (14th century)'],
    summary: [
      '명공 마사무네의 칼 가운데 가장 이름난, 지금은 행방을 모르는 국보.',
      'The most celebrated blade of the master smith Masamune—a national treasure now lost.',
    ],
    description: [
      `사가미 지방의 도공 마사무네의 칼을 바탕으로, 굵게 일렁이는 물결 무늬와 깊은 휘어짐을 살렸습니다. 마사무네라는 이름은 게임과 만화의 칼 이름으로도 자주 쓰입니다. ${REPLICA_KO}`,
      `Modelled on a blade by Masamune of Sagami Province, with a bold, surging temper line and a deep curve. His name is often borrowed for swords in games and manga. ${REPLICA_EN}`,
    ],
    material: ['고탄소강, 철 코등이, 상어가죽·비단 끈', 'High-carbon steel, iron guard, ray skin and silk cord'],
    stories: [
      [
        '16세기',
        '16th century',
        '우에스기 가문의 무장 혼조 시게나가가 싸움에서 이 칼에 투구를 베이고도 이겨 상대의 칼을 차지했고, 그의 이름이 칼 이름이 되었습니다.',
        'Honjō Shigenaga, a general of the Uesugi, had his helmet split by this blade in battle yet won and took it as a prize, and the sword came to bear his name.',
      ],
      [
        '1945년',
        '1945',
        '도쿠가와 가문에 전해져 1939년 국보가 되었으나, 전쟁이 끝난 뒤 연합군에 넘겨진 다음 행방을 알 수 없습니다.',
        'Handed down in the Tokugawa family and named a National Treasure in 1939, it was surrendered to the Allies after the war and has been missing ever since.',
      ],
    ],
    specs: [650, 980, 1150],
    edge: 'sharp',
    price: 9_800_000,
    stock: 1,
    art: {
      blade: { length: 650, width: 31, curve: 17, edge: 'single', tip: 'kissaki', hamon: true },
      collar: { color: GOLD },
      guard: { type: 'disc', width: 76, color: IRON, accent: GOLD },
      grip: { length: 250, color: '#efe7da', wrap: 'diamond', wrapColor: '#2a2440' },
      pommel: { type: 'cap', color: IRON },
    },
  },
  {
    slug: 'muramasa',
    name: ['무라마사', '村正', 'Muramasa'],
    category: 'east',
    kind: 'curved',
    origin: 'JP',
    era: ['일본 · 16세기', 'Japan · 16th century'],
    summary: [
      '도쿠가와 가문에 화를 부른다는 소문이 붙은 이세의 칼.',
      'The blades of Ise rumoured to bring misfortune on the Tokugawa.',
    ],
    description: [
      `이세 지방 구와나의 도공 무라마사 일파의 칼로, 칼날 앞뒤의 물결 무늬가 똑같이 생긴 것이 특징입니다. 잘 드는 실용 칼로 이름났고, '요도(妖刀) 무라마사'라는 이름은 여러 게임과 이야기에 쓰입니다. ${REPLICA_KO}`,
      `A blade of the Muramasa school of Kuwana in Ise, known for temper lines that match on both faces. Prized as a keen working sword, its "cursed blade" name lives on in many games and stories. ${REPLICA_EN}`,
    ],
    material: [
      '고탄소강, 철 코등이, 검은 상어가죽·면 끈',
      'High-carbon steel, iron guard, black ray skin and cotton cord',
    ],
    stories: [
      [
        '에도 시대',
        'Edo period',
        '도쿠가와 이에야스의 할아버지와 아버지, 아들이 모두 무라마사의 칼에 다치거나 죽었다는 이야기가 퍼져 도쿠가와 가문이 꺼린다는 소문이 났고, 가부키에서 저주받은 칼로 그려졌습니다.',
        'Tales spread that Tokugawa Ieyasu’s grandfather, father and son had all been killed or wounded by Muramasa blades; the shogun’s family was said to shun them, and kabuki cast them as cursed swords.',
      ],
    ],
    specs: [700, 1010, 1150],
    edge: 'sharp',
    price: 8_600_000,
    stock: 1,
    art: {
      blade: { length: 700, width: 31, curve: 16, edge: 'single', tip: 'kissaki', hamon: true },
      collar: { color: GOLD },
      guard: { type: 'disc', width: 74, color: BLACK, accent: '#8a2a2a' },
      grip: { length: 255, color: BLACK, wrap: 'diamond', wrapColor: '#7a1f1f' },
      pommel: { type: 'cap', color: BLACK },
    },
  },
  {
    slug: 'pistol-sword',
    name: ['권총 검', 'Pistol sword', 'Pistol Sword'],
    category: 'west',
    kind: 'exotic',
    origin: 'DE',
    era: ['유럽 · 17~18세기', 'Europe · 17th–18th century'],
    summary: [
      '사냥용 칼에 부싯돌 권총을 붙인 유럽의 겸용 무기.',
      'A European hunting sword with a flintlock pistol built in.',
    ],
    description: [
      `칼등을 따라 짧은 총열을 붙이고 손잡이에 부싯돌 격발 장치를 단 사냥용 칼(행어)로, 한 발을 쏘고 바로 벨 수 있게 만든 겸용 무기입니다. 게임 속 '건블레이드'의 실제 원형이라 할 만합니다. 총열과 격발 장치는 모양만 본뜬 장식이라 쏠 수 없습니다. ${REPLICA_KO}`,
      `A hunting hanger with a short barrel along its spine and a flintlock on the hilt—a combination weapon for one shot and then the cut, and a real-world forerunner of the "gunblade" of games. The barrel and lock are non-firing decorative copies. ${REPLICA_EN}`,
    ],
    material: [
      '고탄소강, 철 총열 장식, 황동, 사슴뿔 손잡이',
      'High-carbon steel, decorative iron barrel, brass, stag-horn grip',
    ],
    stories: [
      [
        '18세기',
        '18th century',
        '사냥에서 다친 멧돼지나 사슴에게 다가가 숨을 끊는 사냥용 칼에 한 발짜리 총을 더한 것으로, 이런 겸용 무기가 유럽 여러 무기고에 남아 있습니다.',
        'Hunting hangers were used to dispatch wounded boar or deer; adding a single-shot pistol made them dual-purpose, and such combination weapons survive in armouries across Europe.',
      ],
    ],
    specs: [600, 760, 1100],
    edge: 'sharp',
    price: 4_800_000,
    stock: 1,
    art: {
      blade: {
        length: 600,
        width: 34,
        curve: 4,
        edge: 'single',
        tip: 'clip',
        barrel: { length: 240, color: IRON },
      },
      guard: { type: 'cross', width: 90, color: BRASS },
      grip: { length: 110, color: '#d8c8a8', wrap: 'plain' },
      pommel: { type: 'cap', color: BRASS },
    },
  },
];
