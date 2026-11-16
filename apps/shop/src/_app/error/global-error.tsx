'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { reportError } from '../monitoring';
import { type ErrorScreenProps } from './route-error';

import '../styles/globals.css';

/**
 * 루트 레이아웃까지 그리지 못했을 때의 화면(app/global-error.tsx). 레이아웃과 번역 제공자가 없으므로 문서를 직접 만들고,
 * 주소로 언어를 고릅니다. 글은 messages의 Error·Common과 같습니다(번역 파일 전체를 모든 화면에 싣지 않으려고 여기에 둡니다).
 */
const TEXT = {
  ko: {
    eyebrow: '오류',
    title: '화면을 그리지 못했습니다',
    body: '잠시 문제가 생겼습니다. 다시 시도하거나 도검의 벽으로 돌아가 주세요.',
    retry: '다시 시도',
    home: '도검 벽으로 돌아가기',
  },
  en: {
    eyebrow: 'Error',
    title: 'Something went wrong',
    body: 'This page ran into a problem. Try again, or go back to the wall.',
    retry: 'Try again',
    home: 'Back to the wall',
  },
} as const;

export function GlobalError({ error, retry }: ErrorScreenProps) {
  const pathname = usePathname() ?? '';
  const locale = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ko';
  const text = TEXT[locale];

  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <html lang={locale}>
      <body>
        <title>{`${text.title} · Sword & Blade`}</title>
        <main className="grid min-h-dvh content-center justify-items-center gap-4 px-4 text-center">
          <p className="small-caps text-sm text-accent">{text.eyebrow}</p>
          <h1 className="text-carved text-3xl">{text.title}</h1>
          <p className="max-w-md text-ink-muted">{text.body}</p>
          <p className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => retry()}
              className="min-h-11 rounded-sm border border-input bg-wall-raised px-4 text-sm hover:bg-wall"
            >
              {text.retry}
            </button>
            {/* 앱의 이동 기능까지 망가졌을 수 있어 문서를 새로 받는 일반 링크를 씁니다. */}
            <a
              href={locale === 'en' ? '/en' : '/'}
              className="inline-flex min-h-11 items-center underline underline-offset-4"
            >
              {text.home}
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
