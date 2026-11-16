'use client';

import { useEffect } from 'react';

import { type ErrorScreenProps } from './route-error';

import '../layout/global.css';

/**
 * 루트 레이아웃까지 그리지 못했을 때의 화면(app/global-error.tsx). Ant Design 제공자가 없으므로 기본 요소로 문서를 직접 만듭니다.
 * 앱의 이동 기능까지 망가졌을 수 있어 대시보드로는 문서를 새로 받는 일반 링크로 갑니다.
 */
export function GlobalError({ error, retry }: ErrorScreenProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <title>화면을 그리지 못했습니다 · Sword &amp; Blade 어드민</title>
        <main
          style={{
            minHeight: '100dvh',
            display: 'grid',
            alignContent: 'center',
            justifyItems: 'center',
            gap: 16,
            padding: 16,
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: 24, margin: 0 }}>화면을 그리지 못했습니다</h1>
          <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.65)' }}>
            잠시 문제가 생겼습니다. 다시 시도하거나 대시보드로 돌아가 주세요.
          </p>
          <p style={{ margin: 0, display: 'flex', gap: 16, alignItems: 'center' }}>
            <button type="button" onClick={() => retry()} style={{ minHeight: 44, padding: '0 16px' }}>
              다시 시도
            </button>
            <a href="/admin" style={{ color: '#0958d9' }}>
              대시보드로 가기
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
