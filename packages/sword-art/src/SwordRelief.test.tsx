import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { SEED_SWORDS } from '@snb/mocks';

import { type ReliefFocus } from './geometry';
import { BladeMark } from './Logo';
import { SwordRelief } from './SwordRelief';

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

describe('BladeMark', () => {
  it('이름이 있으면 이미지, 없으면 장식이다', () => {
    expect(renderToStaticMarkup(<BladeMark label="Sword & Blade" />)).toMatch(
      /role="img"[^>]*aria-label="Sword &amp; Blade"/,
    );
    expect(renderToStaticMarkup(<BladeMark />)).toContain('aria-hidden="true"');
  });
});
