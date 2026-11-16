import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/shared/i18n';

import type { Metadata } from 'next';

/**
 * 404 화면 제목. 첫 화면 제목과 같으면 어느 화면인지 구분되지 않습니다(KWCAG 6.4.2).
 * 없는 주소를 받는 catch-all 페이지([...rest])에 답니다. 언어별 레이아웃 아래의 not-found.tsx에 단 메타데이터는 쓰이지 않습니다.
 */
export async function generateNotFoundMetadata(): Promise<Metadata> {
  const t = await getTranslations('NotFound');
  return { title: t('title') };
}

export function NotFoundPage() {
  const t = useTranslations('NotFound');
  const common = useTranslations('Common');
  return (
    <div className="grid justify-items-center gap-4 px-4 py-32 text-center">
      <p className="small-caps text-sm text-accent">404</p>
      <h1 className="text-carved text-3xl">{t('title')}</h1>
      <Link href="/" className="underline underline-offset-4">
        {common('backToWall')}
      </Link>
    </div>
  );
}

/** 없는 주소도 언어별 레이아웃 안의 404 화면을 보여 주도록 넘깁니다. */
export function CatchAllPage(): never {
  notFound();
}
