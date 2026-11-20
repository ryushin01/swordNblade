import { describe, expect, it } from 'vitest';

import { SEED_SWORDS } from '@snb/mocks';

import {
  bladeOutline,
  bladeTipStart,
  CATALOG_SIDE,
  focusViewBox,
  hiltLayout,
  localBounds,
  type ReliefFocus,
  squareViewBox,
} from './geometry';

describe('sword geometry', () => {
  it('모든 시드 도검의 viewBox가 유한한 정사각형이다', () => {
    for (const sword of SEED_SWORDS) {
      const [, , w, h] = squareViewBox(sword.art, 'fit').split(' ').map(Number);
      expect(Number.isFinite(w)).toBe(true);
      expect(w).toBe(h);
    }
  });

  it('카탈로그 축척에서는 짧은 칼도 같은 크기의 틀에 그린다', () => {
    const short = SEED_SWORDS.find((s) => s.slug === 'wakizashi')!;
    const [, , side] = squareViewBox(short.art, 'catalog').split(' ').map(Number);
    expect(side).toBeGreaterThanOrEqual(CATALOG_SIDE);
  });

  it('모든 시드 도검의 칼날 외곽선이 그림 범위 안에 든다(칼끝으로 갈수록 좁아지는 칼날 포함)', () => {
    for (const sword of SEED_SWORDS) {
      const bounds = localBounds(sword.art);
      const xs = bladeOutline(sword.art).map((point) => point.x);
      expect(Math.min(...xs), sword.slug).toBeGreaterThanOrEqual(bounds.minX);
      expect(Math.max(...xs), sword.slug).toBeLessThanOrEqual(bounds.maxX);
    }
  });

  it('각진 칼끝(angled, 버스터 소드)은 창끝보다 짧게 날 쪽을 곧게 깎아 칼끝에서 등과 만난다', () => {
    const art = SEED_SWORDS[0]!.art;
    const angled = { ...art, blade: { ...art.blade, edge: 'single' as const, tip: 'angled' as const, width: 200 } };
    const spear = { ...angled, blade: { ...angled.blade, tip: 'spear' as const } };
    expect(bladeTipStart(angled)).toBeGreaterThan(bladeTipStart(spear));
    const points = bladeOutline(angled);
    // 등 쪽 마지막 점(칼끝)과 날 쪽 첫 점(칼끝)이 같은 자리입니다.
    expect(points[64]!.x).toBeCloseTo(points[65]!.x, 5);
    expect(points[64]!.y).toBeCloseTo(-angled.blade.length, 5);
  });

  it('양날 칼의 각진 칼끝도 대칭 창끝이 아니라 한쪽 날을 곧게 깎아 다른 쪽 날 끝에서 만난다', () => {
    const art = SEED_SWORDS[0]!.art;
    const angled = { ...art, blade: { ...art.blade, edge: 'double' as const, tip: 'angled' as const, width: 120 } };
    const points = bladeOutline(angled);
    expect(points[64]!.x).toBeCloseTo(points[65]!.x, 5);
    // 칼끝은 가운데가 아니라 왼쪽(등 쪽) 가장자리에 있습니다.
    expect(points[64]!.x).toBeLessThan(-angled.blade.width * 0.3);
  });

  it('칼날 외곽선은 칼끝(-length)까지 닿는다', () => {
    const katana = SEED_SWORDS.find((s) => s.slug === 'uchigatana')!;
    const outline = bladeOutline(katana.art);
    expect(Math.min(...outline.map((p) => p.y))).toBeCloseTo(-katana.art.blade.length);
    expect(outline.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y))).toBe(true);
  });

  it('손잡이는 코등이 아래에서 시작해 끝장식으로 끝난다', () => {
    const ssangsudo = SEED_SWORDS[0]!;
    const layout = hiltLayout(ssangsudo.art);
    expect(layout.gripEnd - layout.gripStart).toBe(ssangsudo.art.grip.length);
    expect(localBounds(ssangsudo.art).maxY).toBeGreaterThanOrEqual(layout.pommelEnd);
  });

  it('모든 도검의 확대 보기는 전체 그림보다 좁은 유한한 정사각 영역이다', () => {
    for (const sword of SEED_SWORDS) {
      const side = (focus: ReliefFocus) => {
        const [, , width, height] = focusViewBox(sword.art, focus).split(' ').map(Number);
        expect(width, `${sword.slug} ${focus}`).toBe(height);
        expect(Number.isFinite(width), `${sword.slug} ${focus}`).toBe(true);
        return width!;
      };
      for (const focus of ['guard', 'mid', 'sleeve'] as const) {
        expect(side(focus), `${sword.slug} ${focus}`).toBeLessThanOrEqual(side('full'));
      }
    }
  });
});
