import { fiction } from './fiction-kit';
import { GOLD, GOLD_LIGHT, RUBY, SAPPHIRE, SILVER } from './legend-kit';

import type { CatalogEntry } from './build';

/**
 * 1.10.0 「가공의 도검」에서 생김새를 확인하지 못해 미뤘던 검 5점. 나무위키 문서의 글과 그림으로 맞췄고,
 * 문서에 그림이 없는 기적의 검·라이트브링어는 문서의 설정으로 그리고 설명에 밝힙니다. 모두 비공식 팬 재현품입니다.
 */
export const WORKS4_ENTRIES: CatalogEntry[] = [
  fiction({
    slug: 'keyblade-kingdom-chain',
    name: ['키블레이드(킹덤 체인)', 'キングダムチェーン', 'Keyblade (Kingdom Key)'],
    work: ['킹덤 하츠 · 2002', 'Kingdom Hearts · 2002'],
    summary: [
      '세계의 문을 열고 잠그는 열쇠 모양의 검, 소라의 기본 키블레이드.',
      'The key-shaped sword that locks and unlocks the worlds—Sora’s basic Keyblade.',
    ],
    description: [
      '문서 그림처럼 은빛 둥근 막대 끝에 왕관 모양 열쇠 이빨을 달고, 손을 감싸는 금빛 네모 고리와 검푸른 손잡이, 손잡이 끝에 매단 키체인을 맞췄습니다.',
      'As in the source art, a round silver shaft ending in a crown-shaped key bit, with a square gold hand guard, a dark blue grip and a keychain hanging from the pommel.',
    ],
    story: [
      '킹덤 하츠 시리즈',
      'Kingdom Hearts series',
      '하트리스와 노바디에게 큰 타격을 주고, 쓰러뜨린 하트리스의 마음을 본래대로 돌려보냅니다. 세계의 문을 열고 잠그며, 키체인을 바꾸면 모양이 달라집니다.',
      'It strikes the Heartless and Nobodies hard and frees the hearts of the Heartless it defeats; it opens and locks the doors of worlds, and its shape changes with the keychain attached.',
    ],
    material: [
      '알루미늄 막대(날 없음), 도금 황동 고리, 키체인',
      'Aluminium shaft (unsharpened), plated brass guard, keychain',
    ],
    specs: [780, 1020, 1100],
    price: 2_800_000,
    stock: 3,
    art: {
      blade: { length: 780, width: 34, curve: 0, edge: 'double', tip: 'square', color: '#c8ccd2', keyBit: true },
      guard: { type: 'katar', width: 150, color: '#e8b020' },
      grip: { length: 240, color: '#1e2a5a', wrap: 'ribbed' },
      pommel: { type: 'cap', color: SILVER },
      tassel: '#c8ccd2',
    },
  }),
  fiction({
    slug: 'monado',
    name: ['모나드', 'モナド', 'Monado'],
    work: ['제노블레이드 · 2010', 'Xenoblade Chronicles · 2010'],
    summary: [
      '거신이 기신을 쓰러뜨릴 때 썼다는 "신의 검", 슈르크가 든 붉은 검.',
      'The “sword of the gods” the Bionis wielded against the Mechonis—the red blade Shulk carries.',
    ],
    description: [
      '표지 그림처럼 가늘게 휜 붉은 칼날 밑동에 커다란 둥근 고리가 뚫린 모습으로 만들었습니다.',
      'As on the cover art, a slender, gently curved red blade with a large round ring at its base.',
    ],
    story: [
      '제노블레이드',
      'Xenoblade Chronicles',
      '먼 옛날 거신이 기신을 해치울 때 썼다는 검으로, 모나드의 힘으로 기신병을 물리칩니다. 그러나 얼굴 달린 기신병에게는 통하지 않았고, 피오른을 잃은 슈르크는 복수를 위해 기신계로 떠납니다.',
      'The sword the Bionis is said to have used to strike down the Mechonis, its power cuts through the Mechon—yet it fails against the Faced Mechon, and after losing Fiora, Shulk sets out for the Mechonis to take revenge.',
    ],
    material: ['도장 알루미늄(날 없음), 수지 고리', 'Painted aluminium (unsharpened), resin ring'],
    specs: [1000, 1250, 1300],
    price: 3_600_000,
    stock: 2,
    art: {
      blade: {
        length: 1000,
        width: 60,
        curve: 18,
        edge: 'single',
        tip: 'spear',
        color: '#b8202a',
        medallion: { at: 0.12, size: 1.8, color: '#f2f2f2' },
      },
      guard: { type: 'none', width: 0, color: '#8a1820' },
      grip: { length: 250, color: '#8a1820', wrap: 'ribbed' },
      pommel: { type: 'cap', color: '#d8d8d8' },
    },
  }),
  fiction({
    slug: 'miracle-sword',
    name: ['기적의 검', 'きせきのつるぎ', 'Miracle Sword'],
    work: ['드래곤 퀘스트 시리즈 · 1986', 'Dragon Quest series · 1986'],
    summary: [
      '벤 만큼 주인의 체력을 되돌려 주는 가벼운 검, 메달왕의 상품.',
      'A light sword that restores its wielder’s health with every blow—a prize from the Medal King.',
    ],
    description: [
      '원작 문서에 생김새가 적혀 있지 않아, 누구나 쓸 수 있는 가벼운 검이라는 설정을 바탕으로 이 쇼핑몰이 그렸습니다. 가는 은빛 칼날에 금 코등이와 생명을 뜻하는 초록 보석을 맞췄습니다.',
      'The sources do not describe its look, so this shop designed it from its nature as a light sword anyone can wield: a slender silver blade with a gold guard and a green gem for life.',
    ],
    story: [
      '드래곤 퀘스트 시리즈',
      'Dragon Quest series',
      '상대에게 준 피해의 4분의 1만큼 자기 체력을 되찾습니다. 바이킬트로 공격력을 올리면 회복도 늘어나며, 보통 작은 메달을 모아 메달왕에게서 받습니다.',
      'It restores a quarter of the damage dealt as the wielder’s own health—more when attack is boosted with Oomph—and is usually earned by trading mini medals to the Medal King.',
    ],
    specs: [800, 1020, 1000],
    price: 2_600_000,
    stock: 3,
    art: {
      blade: { length: 800, width: 36, curve: 0, edge: 'double', tip: 'spear', ridge: true, color: '#dfe4ea' },
      guard: { type: 'crescent', width: 180, color: GOLD_LIGHT, accent: '#3a9a5a' },
      grip: { length: 200, color: '#2a5a3a', wrap: 'wire', wrapColor: GOLD_LIGHT },
      pommel: { type: 'gem', color: GOLD_LIGHT, gem: '#3a9a5a' },
    },
  }),
  fiction({
    slug: 'lightbringer-ff',
    name: ['라이트브링어', 'ライトブリンガー', 'Lightbringer'],
    work: ['파이널 판타지 VI · 1994', 'Final Fantasy VI · 1994'],
    summary: [
      '공격력 255의 기사검, 성스러운 빛으로 뒤따라 치는 파이널 판타지의 성검.',
      'A knight sword of 255 attack whose holy light strikes again—the holy blade of Final Fantasy.',
    ],
    description: [
      '원작 문서에 생김새가 적혀 있지 않아, 빛을 부르는 기사검이라는 설정을 바탕으로 이 쇼핑몰이 그렸습니다. 금빛 테를 두른 넓은 은 칼날에 날개 모양 금 코등이와 푸른 보석을 맞췄습니다.',
      'The sources do not describe its look, so this shop designed it from its nature as a knight sword that calls down light: a broad silver blade rimmed in gold, with a winged gold guard and a blue gem.',
    ],
    story: [
      '파이널 판타지 VI',
      'Final Fantasy VI',
      '마검 라그나로크를 투기장에 걸거나 케프카와의 결전 전에 훔쳐 얻으며, MP를 써서 반드시 치명타를 내고 홀리로 뒤따라 칩니다. 파이널 판타지 14에서는 나이트 전용 한손검으로 나옵니다.',
      'Won by wagering the Ragnarok at the Colosseum or stolen before the final battle with Kefka, it spends MP for guaranteed critical hits and follows up with Holy; in Final Fantasy XIV it returns as a Paladin’s one-handed sword.',
    ],
    specs: [900, 1150, 1400],
    price: 3_400_000,
    stock: 2,
    art: {
      blade: { length: 900, width: 52, curve: 0, edge: 'double', tip: 'spear', fuller: true, color: '#e8eaee' },
      guard: { type: 'crescent', width: 260, color: GOLD, accent: SAPPHIRE },
      grip: { length: 230, color: '#2a3a7a', wrap: 'wire', wrapColor: GOLD },
      pommel: { type: 'gem', color: GOLD, gem: SAPPHIRE },
    },
  }),
  fiction({
    slug: 'blackfyre',
    name: ['블랙파이어', 'Blackfyre', 'Blackfyre'],
    work: ['얼음과 불의 노래 · 1996', 'A Song of Ice and Fire · 1996'],
    summary: [
      '타르가르옌 왕들이 대대로 지닌 발리리아 강철 보검, 왕권의 상징.',
      'The Valyrian steel sword of the Targaryen kings, a symbol of royal legitimacy.',
    ],
    description: [
      '드라마 소품 그림처럼 물결무늬 발리리아 강철 칼날에 용머리 크로스가드, 검은 마디 손잡이, 붉은 보석 손잡이 끝을 맞췄습니다. 크기는 바스타드 소드쯤입니다.',
      'After the series prop, a rippled Valyrian steel blade with a dragon-headed crossguard, a black ridged grip and a red gem pommel—about the size of a bastard sword.',
    ],
    story: [
      '얼음과 불의 노래',
      'A Song of Ice and Fire',
      '정복왕 아에곤 1세부터 타르가르옌 왕들이 지녔고, 아에곤 4세가 서자 다에몬에게 내리자 다에몬은 블랙파이어 가문을 세웠으며 그 후손들이 블랙파이어 반란을 일으켰습니다.',
      'Borne by the Targaryen kings from Aegon the Conqueror, it was granted by Aegon IV to his bastard Daemon, who founded House Blackfyre; his descendants raised the Blackfyre Rebellions.',
    ],
    specs: [950, 1250, 1600],
    price: 5_400_000,
    stock: 2,
    art: {
      blade: { length: 950, width: 44, curve: 0, edge: 'double', tip: 'spear', fuller: true, color: '#8a8a86' },
      guard: { type: 'quillon', width: 220, color: SILVER },
      grip: { length: 290, color: '#1a1818', wrap: 'ribbed' },
      pommel: { type: 'gem', color: SILVER, gem: RUBY },
    },
  }),
];
