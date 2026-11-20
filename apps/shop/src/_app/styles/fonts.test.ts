import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('한글 웹 폰트', () => {
  it('화면 글자 파일에 소스의 한글·기호가 모두 들어 있다 (빠졌으면 pnpm --filter @snb/shop fonts)', () => {
    const output = execFileSync('node', ['scripts/build-fonts.mjs', '--check'], { encoding: 'utf8' });
    expect(output).toContain('OK');
    // 소스 전체를 읽고 글꼴 파일을 여는 별도 Node 실행이라, 커버리지 계측이나 부하가 겹치면 기본 기한(5초)을 넘깁니다.
  }, 30_000);
});
