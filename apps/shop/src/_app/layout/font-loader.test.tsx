import { afterEach, describe, expect, it, vi } from 'vitest';

import { FONT_LOADER_SCRIPT, FONT_LOADER_TIMEOUT_MS } from './font-loader';

const run = () => new Function(FONT_LOADER_SCRIPT)();
const state = () => document.documentElement.dataset.fonts;
const stubFonts = (load: unknown) => Object.defineProperty(document, 'fonts', { value: { load }, configurable: true });

describe('FontLoader', () => {
  afterEach(() => {
    delete document.documentElement.dataset.fonts;
    document.documentElement.lang = '';
    vi.useRealTimers();
  });

  it('한국어 화면은 KoPub바탕을 다 받으면 연다', async () => {
    document.documentElement.lang = 'ko';
    const load = vi.fn().mockResolvedValue([]);
    stubFonts(load);
    run();
    expect(state()).toBe('loading');
    await vi.waitFor(() => expect(state()).toBe('ready'));
    expect(load).toHaveBeenCalledWith('400 1em "KoPub Batang"', '가');
  });

  it('영어 화면은 기다리지 않는다', () => {
    document.documentElement.lang = 'en';
    const load = vi.fn();
    stubFonts(load);
    run();
    expect(state()).toBe('ready');
    expect(load).not.toHaveBeenCalled();
  });

  it('글꼴이 늦으면 제한 시간 뒤에 연다', () => {
    vi.useFakeTimers();
    document.documentElement.lang = 'ko';
    stubFonts(() => new Promise(() => {}));
    run();
    vi.advanceTimersByTime(FONT_LOADER_TIMEOUT_MS - 1);
    expect(state()).toBe('loading');
    vi.advanceTimersByTime(1);
    expect(state()).toBe('ready');
  });
});
