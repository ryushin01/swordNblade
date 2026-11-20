import { fiction, STEEL_BLUNT, STEEL_BLUNT_EN } from './fiction-kit';
import { GOLD, GOLD_LIGHT, IRON, RUBY, SAPPHIRE, SILVER } from './legend-kit';

import type { CatalogEntry } from './build';

const WORK_FSN = ['Fate/stay night · 2004', 'Fate/stay night · 2004'] as const;
const WORK_APOCRYPHA = ['Fate/Apocrypha · 2012', 'Fate/Apocrypha · 2012'] as const;
const WORK_FGO = ['Fate/Grand Order · 2015', 'Fate/Grand Order · 2015'] as const;
const WORK_PROTOTYPE = ['Fate/Prototype · 2011', 'Fate/Prototype · 2011'] as const;

/**
 * 1.3.0 Fate 시리즈(TYPE-MOON)의 검 12점. 나무위키 각 문서(「엑스칼리버(Fate 시리즈)」 등)의 보구 이름·원어·랭크·장면·생김새를 따랐고,
 * 문서에 없는 첫 해는 처음 나온 작품의 첫 해로 적었습니다. 흑건(문서 확인 못 함)과 strange Fake의 엑스칼리버(정해진 검 모양이 없음)는 뺐습니다.
 */
export const FATE_ENTRIES: CatalogEntry[] = [
  fiction({
    slug: 'excalibur-fate',
    name: ['약속된 승리의 검(엑스칼리버)', '約束された勝利の剣', 'Excalibur (Fate)'],
    work: WORK_FSN,
    summary: ['세이버(알트리아 펜드래곤)의 성검.', 'The holy sword of Saber, Artoria Pendragon.'],
    description: [
      '마력을 불어넣으면 금빛으로 빛난다는 랭크 A++의 대성보구를, 금빛과 푸른빛으로 꾸민 곧은 양날 검으로 만들었습니다.',
      'The A++ rank Anti-Fortress Noble Phantasm that blazes gold when charged with mana, made as a straight double-edged sword trimmed in gold and blue.',
    ],
    story: [
      'Fate/Zero',
      'Fate/Zero',
      '세이버의 필살기로, 「Fate/Zero」에서는 캐스터가 불러낸 바다 괴물을 한 번에 날려 버렸습니다. 칼집은 아발론입니다.',
      'Saber’s finishing strike; in Fate/Zero it obliterates the sea monster summoned by Caster in a single blow. Its scabbard is Avalon.',
    ],
    specs: [900, 1150, 1500],
    price: 7_800_000,
    art: {
      blade: { length: 900, width: 50, curve: 0, edge: 'double', tip: 'spear', fuller: true, color: '#e6e2d0' },
      guard: { type: 'crescent', width: 260, color: GOLD, accent: SAPPHIRE },
      grip: { length: 220, color: '#2f4f9a', wrap: 'wire', wrapColor: GOLD },
      pommel: { type: 'gem', color: GOLD, gem: SAPPHIRE },
    },
  }),
  fiction({
    slug: 'caliburn-fate',
    name: ['승리할 황금의 검(칼리번)', '勝利すべき黄金の剣', 'Caliburn (Fate)'],
    work: WORK_FSN,
    summary: [
      '왕을 고르는 바위에 꽂혀 있던, 엑스칼리버보다 화려한 황금의 검.',
      'The golden sword of selection from the stone, more ornate than Excalibur.',
    ],
    description: [
      '칼날이 유독 긴 황금빛 검으로, 엑스칼리버보다 화려하게 꾸몄습니다. 랭크 B의 대인보구입니다.',
      'A golden sword with a notably long blade, more ornate than Excalibur—a B-rank Anti-Unit Noble Phantasm.',
    ],
    story: [
      'Fate/stay night',
      'Fate/stay night',
      '전설에서는 기사도에 어긋나는 싸움으로 부러졌다고 전해지며, Fate 루트에서는 시로가 투영한 칼리번을 세이버와 함께 진명 개방해 버서커의 목숨 일곱 개를 빼앗았습니다.',
      'Legend says it broke in an unchivalrous fight; in the Fate route Shirou projects it and, together with Saber, releases its true name to take seven of Berserker’s lives.',
    ],
    specs: [1000, 1250, 1500],
    price: 7_200_000,
    art: {
      blade: { length: 1000, width: 46, curve: 0, edge: 'double', tip: 'spear', ridge: true, color: '#e6d8a8' },
      guard: { type: 'cross', width: 230, color: GOLD_LIGHT, accent: SAPPHIRE },
      grip: { length: 220, color: '#2a3a7a', wrap: 'wire', wrapColor: GOLD },
      pommel: { type: 'gem', color: GOLD, gem: RUBY },
    },
  }),
  fiction({
    slug: 'kanshou-bakuya',
    name: ['간장·막야(Fate)', '干將·莫耶', 'Kanshō & Bakuya (Fate)'],
    kind: 'curved',
    work: WORK_FSN,
    summary: ['아처가 즐겨 쓰는 음양의 부부검.', 'The yin-yang pair of married swords favored by Archer.'],
    description: [
      '양검 간장은 까만 칼날에 거북 등딱지 무늬, 음검 막야는 하얀 칼날에 파도 무늬로 두 자루가 한 벌이며, 그림은 간장을 그렸습니다. 칼날에는 마를 쫓는 글귀가 새겨져 있습니다.',
      'Kanshō, the yang sword, has a black blade with a tortoiseshell pattern and Bakuya, the yin sword, a white blade with waves; they come as a pair, and the relief shows Kanshō. Their blades bear a verse to ward off evil.',
    ],
    story: [
      'Fate/stay night',
      'Fate/stay night',
      '서로를 끌어당기는 부부검이라 던졌다가 되돌려 받는 기술에 쓰이며, 아처의 오의 「학익삼련」으로 이어집니다.',
      'As married swords they pull toward each other, so they can be thrown and drawn back—the basis of Archer’s secret technique, Kakuyoku San-ren.',
    ],
    material: [
      `${STEEL_BLUNT} 두 자루(흑·백 도장), 철 장식`,
      `${STEEL_BLUNT_EN}, two blades (black and white finish), iron fittings`,
    ],
    specs: [450, 620, 900],
    price: 5_400_000,
    stock: 2,
    art: {
      blade: {
        length: 450,
        width: 56,
        curve: 45,
        edge: 'single',
        tip: 'clip',
        flare: 1.5,
        color: '#2a2826',
      },
      guard: { type: 'crescent', width: 110, color: '#8a4a2a' },
      grip: { length: 140, color: '#1f1c1a', wrap: 'cord', wrapColor: '#3a3634' },
      pommel: { type: 'cap', color: '#8a4a2a' },
    },
  }),
  fiction({
    slug: 'ea-fate',
    name: ['괴리검 에아', '乖離剣 エア', 'Ea, the Sword of Rupture'],
    kind: 'exotic',
    work: WORK_FSN,
    summary: [
      '세계를 찢는다는 길가메시의 드릴 같은 검.',
      'Gilgamesh’s drill-like sword, said to tear the world apart.',
    ],
    description: [
      '칼날이 원통 세 개로 나뉘어 따로 돌아가는 드릴 모양을 원통 사이 이음매와 새김으로 그렸습니다. 랭크 EX의 대계보구입니다.',
      'A drill-like blade of three separately turning cylinders, shown by the joints and engravings between them—an EX-rank Anti-World Noble Phantasm.',
    ],
    story: [
      'Fate/stay night · Fate/Zero',
      'Fate/stay night · Fate/Zero',
      '길가메시가 가장 아끼는 보구로 자격 없는 상대에게는 쓰지 않으며, 진명 「에누마 엘리시」로 세계를 가른다고 합니다.',
      'Gilgamesh’s most treasured Noble Phantasm, never used on the unworthy; released as Enuma Elish, it is said to split the world.',
    ],
    specs: [800, 1060, 2400],
    price: 9_900_000,
    art: {
      blade: {
        length: 800,
        width: 70,
        curve: 0,
        edge: 'double',
        tip: 'spear',
        segments: 3,
        color: '#3a1616',
      },
      guard: { type: 'crescent', width: 200, color: GOLD, accent: SAPPHIRE },
      grip: { length: 200, color: GOLD, wrap: 'ribbed' },
      pommel: { type: 'gem', color: GOLD, gem: RUBY },
    },
  }),
  fiction({
    slug: 'arondight-fate',
    name: ['훼손되지 않는 호수의 빛(아론다이트)', '無毀なる湖光', 'Arondight (Fate)'],
    work: ['Fate/Zero · 2006', 'Fate/Zero · 2006'],
    summary: [
      '랜슬롯의 성검, 마검으로 타락하면 칠흑이 되는 검.',
      'Lancelot’s holy sword, turned jet black when corrupted.',
    ],
    description: [
      '본래 모습을 따라 금색과 흰색을 맞춘 성검으로, 칼날에 정령의 문자를 새기고 달빛을 받은 호수 같은 빛을 입혔습니다.',
      'Made in its original form—a holy sword of gold and white, its blade inscribed with fairy script and given the gleam of a lake under moonlight.',
    ],
    story: [
      'Fate/Zero',
      'Fate/Zero',
      '버서커로 소환된 랜슬롯이 이 검을 뽑자 마스터 카리야의 마력이 바닥났고, 마검이 된 뒤에는 손잡이에 쇠사슬이 감기고 칼날이 칠흑으로 물들었습니다.',
      'When Lancelot, summoned as Berserker, drew it, his Master Kariya’s mana ran dry; corrupted into a demonic sword, its hilt is wrapped in chains and its blade turned jet black.',
    ],
    specs: [950, 1200, 1500],
    price: 7_000_000,
    art: {
      blade: {
        length: 950,
        width: 46,
        curve: 0,
        edge: 'double',
        tip: 'spear',
        fuller: true,
        color: '#c8d4e0',
      },
      guard: { type: 'cross', width: 220, color: GOLD, accent: '#e8e4d8' },
      grip: { length: 210, color: '#ece6d6', wrap: 'wire', wrapColor: GOLD },
      pommel: { type: 'cap', color: GOLD },
    },
  }),
  fiction({
    slug: 'balmung-fate',
    name: ['환상대검・천마실추(발뭉)', '幻想大剣・天魔失墜', 'Balmung (Fate)'],
    kind: 'great',
    work: WORK_APOCRYPHA,
    summary: [
      '사룡 파프니르를 쓰러뜨린 지크프리트의 대검.',
      'Siegfried’s greatsword that slew the evil dragon Fafnir.',
    ],
    description: [
      '대검 칼자루에 진 에테르를 담은 푸른 보옥을 박았습니다. 진명을 개방할 때 칼자루를 돌려 보석을 드러낸다고 합니다. 랭크 A+의 대군보구입니다.',
      'A greatsword with a blue jewel holding True Ether set in the hilt, which is turned to bare the jewel when its true name is released—an A+ rank Anti-Army Noble Phantasm.',
    ],
    story: [
      'Fate/Apocrypha',
      'Fate/Apocrypha',
      '지크프리트가 니벨룽겐 일족의 보물을 나누어 준 뒤 그 보물이 그의 무기가 되었다고 하며, 진명을 개방하면 황혼빛 검기를 쏩니다.',
      'After Siegfried divided the treasure of the Nibelungs, it became his weapon; released, it unleashes a wave of twilight light.',
    ],
    specs: [1200, 1550, 2800],
    price: 7_600_000,
    art: {
      blade: { length: 1200, width: 70, curve: 0, edge: 'double', tip: 'spear', fuller: true, color: '#d8d2c0' },
      guard: { type: 'cross', width: 260, color: IRON, accent: SAPPHIRE },
      grip: { length: 300, color: '#2a2420', wrap: 'leather' },
      pommel: { type: 'cap', color: IRON },
    },
  }),
  fiction({
    slug: 'gram-fate',
    name: ['파멸의 여명(그람)', '破滅の黎明', 'Gram (Fate)'],
    work: WORK_FGO,
    summary: ['수정 파편처럼 깎인 시구르드의 마검.', 'Sigurd’s blade, cut like a shard of crystal.'],
    description: [
      '칼날을 수정 파편처럼 깎고 원초의 룬을 새겼으며, 칼날과 자루를 억지로 묶은 듯한 모습에 1·2차 재림의 붉은빛을 입혔습니다.',
      'A blade cut like a crystal shard and carved with primordial runes, as if blade and hilt were forcibly bound together, in the red glow of its first and second ascensions.',
    ],
    story: [
      'Fate/Grand Order',
      'Fate/Grand Order',
      '2부 2장에 나오는 시구르드의 주무장으로 절삭력이 극단적으로 날카롭다고 하며, 진명 「괴겁의 천륜(뵐베르크・그람)」은 검을 던진 뒤 주먹으로 후려쳐 꽂는 기술입니다.',
      'Sigurd’s main weapon from Part 2, Chapter 2, said to be extremely keen; its true name, Bölverk Gram, hurls the sword and drives it home with a punch.',
    ],
    specs: [950, 1220, 1600],
    price: 6_800_000,
    art: {
      blade: {
        length: 950,
        width: 54,
        curve: 0,
        edge: 'double',
        tip: 'spear',
        material: 'crystal',
        color: '#c46a5a',
        teeth: true,
      },
      guard: { type: 'block', width: 160, color: IRON },
      grip: { length: 220, color: '#2a2420', wrap: 'cord', wrapColor: '#5a3a2a' },
      pommel: { type: 'cap', color: IRON },
    },
  }),
  fiction({
    slug: 'caladbolg-fate',
    name: ['홍예검(칼라드볼그)', '虹霓剣', 'Caladbolg (Fate)'],
    kind: 'great',
    work: WORK_FGO,
    summary: [
      '칼날이 나선으로 꼬인 퍼거스 막 로이의 홍예검.',
      'Fergus mac Róich’s rainbow sword, its blade twisted into a spiral.',
    ],
    description: [
      '드릴처럼 깎아 내는 나선형 칼날을 칼끝으로 좁아지는 원뿔과 나선 이음매로 그리고, 초록 코등이와 붕대 감은 손잡이를 맞췄습니다. 길이는 쓰는 이의 키보다 조금 큽니다. 랭크 A++의 대군보구입니다.',
      'Its spiral blade, which grinds like a drill, is drawn as a cone narrowing to the tip with spiral seams, with a green guard and a bandaged grip; a little taller than its wielder—an A++ rank Anti-Army Noble Phantasm.',
    ],
    story: [
      'Fate/Grand Order',
      'Fate/Grand Order',
      '퍼거스가 검기로 언덕 세 개를 날려 버렸다는 전승이 있으며, 진명을 개방하면 칼날이 무지개처럼 늘어납니다.',
      'Legend says Fergus blew away three hills with its sword-light; released, its blade stretches out like a rainbow.',
    ],
    specs: [1450, 1850, 3200],
    price: 7_900_000,
    art: {
      blade: {
        length: 1450,
        width: 200,
        curve: 0,
        edge: 'double',
        tip: 'spear',
        flare: 0.2,
        segments: 4,
        color: '#e6e6e2',
      },
      guard: { type: 'disc', width: 260, color: '#2f7a4a', accent: GOLD },
      grip: { length: 280, color: '#e8e4da', wrap: 'cord', wrapColor: '#cfc8b4' },
      pommel: { type: 'ball', color: '#2f7a4a' },
    },
  }),
  fiction({
    slug: 'clarent-fate',
    name: ['찬란하게 빛나는 왕검(클라렌트)', '燦然と輝く王剣', 'Clarent (Fate)'],
    kind: 'great',
    work: WORK_APOCRYPHA,
    summary: [
      '모드레드가 반란 때 빼앗은, 어떤 은보다 눈부신 왕검.',
      'The royal sword Mordred seized in her rebellion, brighter than any silver.',
    ],
    description: [
      '백은색으로 빛나는 양손 대검에 화려한 장식을 달고, 전력 해방 「나의 아름다운 아버지에 대한 반역(클라렌트 블러드 아서)」의 붉은빛을 장식에 더했습니다.',
      'A two-handed greatsword gleaming silver-white with rich ornament, its fittings touched with the red of its full release, Clarent Blood Arthur.',
    ],
    story: [
      'Fate/Apocrypha',
      'Fate/Apocrypha',
      '본래 알트리아의 보구였으나 반란 때 모드레드가 빼앗았고, 「Fate/Apocrypha」 1권에서 흑의 세이버의 발뭉을 이겼습니다.',
      'Originally Artoria’s Noble Phantasm, it was seized by Mordred in her rebellion; in Fate/Apocrypha vol. 1 it overcame Black Saber’s Balmung.',
    ],
    specs: [1150, 1480, 2400],
    price: 7_300_000,
    art: {
      blade: { length: 1150, width: 60, curve: 0, edge: 'double', tip: 'spear', ridge: true, color: '#e8eaf0' },
      guard: { type: 'cross', width: 300, color: SILVER, accent: RUBY },
      grip: { length: 280, color: '#7a1f2a', wrap: 'wire', wrapColor: SILVER },
      pommel: { type: 'gem', color: SILVER, gem: RUBY },
    },
  }),
  fiction({
    slug: 'joyeuse-fate',
    name: ['성검 주와이외즈', 'ジュワユーズ', 'Joyeuse (Fate)'],
    work: ['Fate/EXTELLA LINK · 2018', 'Fate/EXTELLA LINK · 2018'],
    summary: [
      '하루에 서른 번 빛깔이 바뀐다는 샤를마뉴의 성검.',
      'Charlemagne’s holy sword, said to change color thirty times a day.',
    ],
    description: [
      '샤를마뉴의 것처럼 푸른색과 흰색으로 꾸민 성검으로, 진명을 개방하면 열두 자루의 휘검이 날개처럼 펼쳐진다고 합니다.',
      'A holy sword in Charlemagne’s blue and white; when its true name is released, twelve shining swords spread out like wings.',
    ],
    story: [
      'Fate/EXTELLA LINK',
      'Fate/EXTELLA LINK',
      '무훈시 「롤랑의 노래」의 명검으로, 자루 안에 롱기누스 창끝이 들어 있다는 전승이 있습니다. 이름은 프랑스어로 "명랑함"이라는 뜻입니다.',
      'The famed sword of the Song of Roland, said to hold the point of the Lance of Longinus in its hilt; its name means “joyfulness” in French.',
    ],
    specs: [950, 1200, 1500],
    price: 6_600_000,
    art: {
      blade: { length: 950, width: 48, curve: 0, edge: 'double', tip: 'spear', fuller: true, color: '#dce4f0' },
      guard: { type: 'quillon', width: 220, color: SILVER, accent: SAPPHIRE },
      grip: { length: 220, color: '#2f4f9a', wrap: 'wire', wrapColor: SILVER },
      pommel: { type: 'gem', color: SILVER, gem: SAPPHIRE },
    },
  }),
  fiction({
    slug: 'excalibur-prototype',
    name: ['엑스칼리버(Fate/Prototype)', '約束された勝利の剣', 'Excalibur (Fate/Prototype)'],
    work: WORK_PROTOTYPE,
    summary: [
      '하얀 칼집 아발론에 싸인 채 금빛으로 빛나는 아서 펜드래곤의 성검.',
      'Arthur Pendragon’s holy sword, glowing gold within its white sheath, Avalon.',
    ],
    description: [
      '칼집이 곧 아발론이라 평소에는 하얀 칼날처럼 보이는 칼집이 검신을 덮고 있는 모습을 따라, 하얀 칼날에 은은한 금빛을 더했습니다. 랭크 EX입니다.',
      'Its scabbard is Avalon itself and normally covers the blade like a white edge, so the blade is white with a soft golden glow—an EX-rank Noble Phantasm.',
    ],
    story: [
      'Fate/Grand Order',
      'Fate/Grand Order',
      '진명 개방에는 「십삼구속 해방(씰 서틴), 원탁의결 개시(디시전 스타트)」가 필요하며, 구속이 일곱 개 넘게 풀리면 검신이 완전한 황금빛이 된다고 합니다.',
      'Its release requires “Seal Thirteen, Decision Start”; with more than seven of its thirteen seals undone, the blade turns fully golden.',
    ],
    specs: [920, 1170, 1500],
    price: 7_500_000,
    art: {
      blade: { length: 920, width: 52, curve: 0, edge: 'double', tip: 'spear', ridge: true, color: '#f0ecdc' },
      guard: { type: 'crescent', width: 260, color: GOLD_LIGHT, accent: SAPPHIRE },
      grip: { length: 220, color: '#ece6d6', wrap: 'wire', wrapColor: GOLD },
      pommel: { type: 'gem', color: GOLD, gem: SAPPHIRE },
    },
  }),
  fiction({
    slug: 'enki-fate',
    name: ['종말검 엔키', '終末剣 エンキ', 'Enki (Fate)'],
    kind: 'exotic',
    work: WORK_PROTOTYPE,
    summary: [
      '어깨 갑옷에서 떼어 쓰는, 물을 부르는 황금 쌍검.',
      'Golden twin swords that call the waters, detached from the shoulder armor.',
    ],
    description: [
      '황금빛 쌍검 가운데 한 자루를 그렸습니다. 손잡이를 돌리면 톤파가 되고, 두 자루를 이으면 활이 된다고 합니다.',
      'One of the golden twin swords is shown; turning the grips makes them tonfa, and joining the two makes a bow.',
    ],
    story: [
      'Fate/Prototype',
      'Fate/Prototype',
      '도쿄 2차 성배전쟁 아처의 보구로, 진명을 개방하면 궤도의 멸망의 별을 떨어뜨려 세상을 이레 동안 잠기게 한 대홍수를 다시 일으킨다고 합니다.',
      'The Noble Phantasm of the Archer of the second Tokyo Holy Grail War; released, it drops a star of ruin from orbit and calls back the great flood that drowned the world for seven days.',
    ],
    specs: [700, 900, 1400],
    price: 6_400_000,
    art: {
      blade: { length: 700, width: 50, curve: 18, edge: 'single', tip: 'clip', ridge: true, color: '#d8b860' },
      guard: { type: 'block', width: 90, color: GOLD },
      grip: { length: 160, color: '#3a2a1a', wrap: 'ribbed' },
      pommel: { type: 'cap', color: GOLD },
    },
  }),
];
