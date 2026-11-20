import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { SEED_SWORDS } from '@snb/mocks';

import { type ReliefFocus } from './geometry';
import { BladeMark } from './Logo';
import { SwordRelief } from './SwordRelief';

import type { SwordArt } from '@snb/domain';

const FOCUSES: ReliefFocus[] = ['full', 'hilt', 'tip', 'guard', 'mid', 'sleeve'];
/** 그려진 좌표·크기에 계산이 틀린 값이 섞이면 SVG가 깨지거나 사라집니다. */
const BROKEN = /NaN|Infinity|undefined/;

describe('SwordRelief', () => {
  it('모든 시드 도검을 목록·상세 틀과 갤러리의 모든 시점으로 예외 없이, 틀린 숫자 없이 그린다', () => {
    for (const sword of SEED_SWORDS) {
      for (const frame of ['catalog', 'fit'] as const) {
        const markup = renderToStaticMarkup(<SwordRelief art={sword.art} frame={frame} />);
        expect(markup, `${sword.slug} ${frame}`).toMatch(/^<svg[^>]*viewBox="[-\d. ]+"/);
        expect(markup, `${sword.slug} ${frame}`).not.toMatch(BROKEN);
      }
      for (const focus of FOCUSES) {
        const markup = renderToStaticMarkup(<SwordRelief art={sword.art} focus={focus} />);
        expect(markup, `${sword.slug} ${focus}`).not.toMatch(BROKEN);
      }
    }
    // 213점 × 8가지(약 1,700번)를 그리므로 기본 기한(5초)보다 넉넉히 둡니다.
  }, 60_000);

  it('이름이 있으면 role="img"와 이름을 붙이고, 없으면 장식으로 숨긴다', () => {
    const art = SEED_SWORDS[0]!.art;
    expect(renderToStaticMarkup(<SwordRelief art={art} label="쌍수도 부조" />)).toMatch(
      /^<svg[^>]*role="img"[^>]*aria-label="쌍수도 부조"/,
    );
    const decorative = renderToStaticMarkup(<SwordRelief art={art} />);
    expect(decorative).toMatch(/^<svg[^>]*aria-hidden="true"/);
    expect(decorative).not.toContain('role="img"');
  });

  it('화면 전환 짝을 달면 쪽마다 다른 data 속성을 붙이고, 한 화면의 여러 부조는 필터 id가 겹치지 않는다', () => {
    const art = SEED_SWORDS[0]!.art;
    expect(renderToStaticMarkup(<SwordRelief art={art} transition={{ side: 'exit', key: 'ssangsudo' }} />)).toContain(
      'data-hero-exit-key="ssangsudo"',
    );
    expect(renderToStaticMarkup(<SwordRelief art={art} transition={{ side: 'enter', key: 'ssangsudo' }} />)).toContain(
      'data-hero-enter-key="ssangsudo"',
    );
    const page = renderToStaticMarkup(
      <>
        <SwordRelief art={art} />
        <SwordRelief art={art} />
      </>,
    );
    const ids = [...page.matchAll(/<filter id="([^"]+)"/g)].map((match) => match[1]);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });
});

describe('SwordRelief 칼날 장식', () => {
  const base: SwordArt = {
    blade: { length: 900, width: 80, curve: 0, edge: 'single', tip: 'clip' },
    guard: { type: 'block', width: 160, color: '#4a4a4e' },
    grip: { length: 300, color: '#2a2622', wrap: 'ribbed' },
    pommel: { type: 'ring', color: '#4a4a4e' },
  };
  const count = (markup: string, tag: string) => markup.split(`<${tag}`).length - 1;
  const draw = (blade: Partial<SwordArt['blade']>) =>
    renderToStaticMarkup(<SwordRelief art={{ ...base, blade: { ...base.blade, ...blade } }} />);

  it('합체 칼날(segments)은 판 사이 이음선과 판마다 볼트를 높이·채색 두 층에 새긴다', () => {
    const plain = draw({});
    const three = draw({ segments: 3 });
    // 판 세 장: 이음선 2개, 볼트는 판마다 2개(바깥·안쪽 원) × 두 층
    expect(count(three, 'polyline') - count(plain, 'polyline')).toBe(2 * 2);
    expect(count(three, 'circle') - count(plain, 'circle')).toBe(3 * 2 * 2 * 2);
    expect(three).not.toMatch(BROKEN);
  });

  it('판 수는 2~4장으로 맞춘다', () => {
    expect(count(draw({ segments: 9 }), 'polyline')).toBe(count(draw({ segments: 4 }), 'polyline'));
    expect(count(draw({ segments: 1 }), 'polyline')).toBe(count(draw({ segments: 2 }), 'polyline'));
  });

  it('사복검 마디(links)는 마디마다 V자 이음선과 핀을 새긴다', () => {
    const plain = draw({});
    const linked = draw({ links: 8 });
    expect(count(linked, 'polyline') - count(plain, 'polyline')).toBe(8 * 2);
    expect(count(linked, 'circle') - count(plain, 'circle')).toBe(8 * 2);
    expect(linked).not.toMatch(BROKEN);
  });

  it('수정 칼날은 옅은 청색으로 칠하고 능선과 면 경계를 새긴다', () => {
    const steel = draw({ edge: 'double', tip: 'spear' });
    const crystal = draw({ edge: 'double', tip: 'spear', material: 'crystal' });
    expect(crystal).toContain('#8fb8cc');
    expect(steel).not.toContain('#8fb8cc');
    expect(count(crystal, 'polyline') - count(steel, 'polyline')).toBeGreaterThanOrEqual(2 * 4);
    expect(crystal).not.toMatch(BROKEN);
  });

  it('칼날 구멍(holes)은 구멍마다 테두리와 안쪽을 두 층에 그리고, 1~4개로 맞춘다', () => {
    const plain = draw({});
    const two = draw({ holes: 2 });
    expect(count(two, 'circle') - count(plain, 'circle')).toBe(2 * 2 * 2);
    expect(count(draw({ holes: 9 }), 'circle')).toBe(count(draw({ holes: 4 }), 'circle'));
    expect(two).not.toMatch(BROKEN);
  });

  it('권총 검(barrel)은 칼등을 따라 총열과 총구를 두 층에 그리고, 총열은 칼날의 6할을 넘지 않는다', () => {
    const plain = draw({});
    const gun = draw({ barrel: { length: 300, color: '#3a3532' } });
    expect(gun).toContain('#3a3532');
    // 총열 몸통 위 둥근 면을 나타내는 선 하나와 총구 하나 × 두 층
    expect(count(gun, 'polyline') - count(plain, 'polyline')).toBe(2);
    expect(count(gun, 'circle') - count(plain, 'circle')).toBe(2);
    expect(gun).not.toMatch(BROKEN);
    const muzzleY = (markup: string) =>
      Math.min(...[...markup.matchAll(/<circle cx="[^"]+" cy="([^"]+)"/g)].map((m) => Number(m[1])));
    expect(muzzleY(draw({ barrel: { length: 5000, color: '#3a3532' } }))).toBeGreaterThanOrEqual(-900 * 0.6 - 1);
  });
});

describe('BladeMark', () => {
  it('이름이 있으면 이미지, 없으면 장식이다', () => {
    expect(renderToStaticMarkup(<BladeMark label="Sword & Blade" />)).toMatch(
      /role="img"[^>]*aria-label="Sword &amp; Blade"/,
    );
    expect(renderToStaticMarkup(<BladeMark />)).toContain('aria-hidden="true"');
  });
});
