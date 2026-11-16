'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n';
import { Button } from '@/shared/ui';

import { reportError } from '../monitoring';

export interface ErrorScreenProps {
  /** 던져진 값. 클라이언트에서 던진 값은 Error가 아닐 수도 있습니다. */
  error: unknown;
  /** 오류가 난 화면을 다시 받아 그립니다(Next.js 16.4 오류 경계). */
  retry: () => void;
}

/**
 * 화면을 그리다 난 오류(app/[locale]/error.tsx). 머리글·바닥글은 그대로 두고 404 화면과 같은 모양으로 알리며,
 * 다시 시도하거나 도검의 벽으로 돌아갈 수 있게 합니다. 오류는 모니터링(Sentry, DSN이 있을 때)으로 보냅니다.
 */
export function RouteError({ error, retry }: ErrorScreenProps) {
  const t = useTranslations('Error');
  const common = useTranslations('Common');

  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <div className="grid justify-items-center gap-4 px-4 py-32 text-center">
      <p className="small-caps text-sm text-accent">{t('eyebrow')}</p>
      <h1 className="text-carved text-3xl">{t('title')}</h1>
      <p className="max-w-md text-ink-muted">{t('body')}</p>
      <p className="flex flex-wrap items-center justify-center gap-4">
        <Button type="button" variant="outline" className="min-h-11 rounded-sm" onClick={() => retry()}>
          {t('retry')}
        </Button>
        <Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4">
          {common('backToWall')}
        </Link>
      </p>
    </div>
  );
}
