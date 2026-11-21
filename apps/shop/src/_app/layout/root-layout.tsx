import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { SITE } from '@/shared/config';
import { languageAlternates, routing } from '@/shared/i18n';
import { Toaster } from '@/shared/ui';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';

import { Providers } from '../query-client/providers';
import { PageTransitions } from '../transitions/page-transitions';
import { RouteBoundary } from '../transitions/route-boundary';
import { RestFonts } from './rest-fonts';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import '../styles/globals.css';
// 한글: KoPub바탕(OFL판, 줄인 파일 이름 SnbBatang) 중 화면에 쓰는 글자만 담은 파일. pnpm --filter @snb/shop fonts로 만듭니다.
import '../styles/fonts/snb-batang.css';

/**
 * 칼 이름의 한글만 붓글씨(나눔손글씨 붓)로 씁니다. 이름에 쓰인 247자만 담은 66KB 파일이라 본문 한글 웹 글꼴과 달리 가볍습니다.
 * 붓글씨는 글자가 작아 보여 크기를 키우고, 없는 글자(영문, 새로 더한 이름의 글자)는 아래 명조로 이어집니다.
 */
const swordBrush = localFont({
  src: '../fonts/sword-brush.woff2',
  variable: '--font-sword-brush',
  display: 'swap',
  declarations: [{ prop: 'size-adjust', value: '125%' }],
});

// 영문·숫자 본문과 제목은 Spectral, 영어 화면의 큰 제목만 다크 판타지 글꼴 Pirata One(굵기 하나).
// 두 글꼴 모두 Google Fonts의 라틴 글자 묶음(Fontsource 판, SIL OFL 1.1) 파일을 저장소에 두고 씁니다.
// next/font/google은 빌드할 때 Google Fonts에서 받아 오므로, 인터넷이 없으면 빌드가 실패해 로컬 파일로 바꿨습니다.
// Spectral은 쓰는 굵기만 둡니다(본문 400, 버튼 500, 굵은 글씨 600).
const spectral = localFont({
  src: [
    { path: '../fonts/spectral-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/spectral-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/spectral-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-spectral',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
});
// Pirata One은 영어 화면의 h1·h2에만 쓰여, 모든 화면(한국어 포함)에서 미리 받지 않고 그 제목을 그릴 때 받습니다.
// 받기 전에는 next/font가 만든 크기 보정 대체 글꼴로 그려 글자 자리가 크게 움직이지 않습니다.
const pirata = localFont({
  src: '../fonts/pirata-one-latin-400-normal.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-pirata',
  display: 'swap',
  preload: false,
});

type LayoutParams = Promise<{ locale: string }>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: LayoutParams }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return {
    // 언어별 대체 주소(hreflang)와 canonical을 절대 주소로 내보냅니다. 하위 페이지에도 적용됩니다.
    metadataBase: new URL(SITE.url),
    // 아이콘이 없으면 브라우저가 /favicon.ico를 찾다가 404를 냅니다.
    icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
    title: { default: t('defaultTitle'), template: `%s · ${t('siteName')}` },
    description: t('description'),
    alternates: languageAlternates('', locale),
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      title: t('defaultTitle'),
      description: t('description'),
      locale: locale === 'en' ? 'en_US' : 'ko_KR',
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: t('defaultTitle') }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export const viewport: Viewport = {
  themeColor: '#dddcd7',
};

export async function RootLayout({ children, params }: { children: ReactNode; params: LayoutParams }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // 정적으로 그릴 수 있게 이 요청의 언어를 알려 둡니다.
  setRequestLocale(locale);
  const t = await getTranslations('Common');

  return (
    <html lang={locale} className={`${spectral.variable} ${pirata.variable} ${swordBrush.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 bg-ink px-4 py-3 text-wall focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {t('skipToContent')}
        </a>
        <NextIntlClientProvider>
          <Providers>
            <PageTransitions>
              <SiteHeader />
              {/* 화면 전환: 떠나는 화면은 main을 기준으로 겹쳐 놓입니다(relative·z-0). overflow-x는 hidden이 아니라 clip이어야
                  스크롤 복원이 맞습니다. 404 화면도 경계 안에 있어야 다른 화면에서 넘어올 때 떠나는 화면이 지워집니다. */}
              <main id="main" tabIndex={-1} className="relative z-0 min-h-dvh overflow-x-clip outline-none">
                <RouteBoundary className="min-h-dvh bg-wall">{children}</RouteBoundary>
              </main>
              <SiteFooter />
              <Toaster position="bottom-center" />
            </PageTransitions>
          </Providers>
        </NextIntlClientProvider>
        {/* 화면 글자 파일에 없는 한글은 나머지 조각으로(첫 화면 뒤에 붙임) */}
        <RestFonts href="/fonts/snb-batang-rest.css" />
      </body>
    </html>
  );
}
