'use client';

import { useTranslations } from 'next-intl';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/shared/lib';

/**
 * 이 도검 주소를 공유합니다. 공유 시트(휴대폰 등)가 있으면 그것을 열고, 없으면 주소를 복사해 알림으로 알립니다.
 * 공유 시트를 닫은 것(AbortError)은 실패로 보지 않습니다. 검색 조건 같은 주소 뒤 값은 빼고 도검 주소만 보냅니다.
 */
export function ShareButton({ title, text, className }: { title: string; text: string; className?: string }) {
  const t = useTranslations('Share');

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}`;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        // 공유 시트를 열지 못했으면 주소 복사로 넘어갑니다.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t('copied'));
    } catch {
      toast.error(t('failed'));
    }
  };

  return (
    <button
      type="button"
      onClick={() => void share()}
      className={cn(
        'inline-flex min-h-11 items-center gap-2 rounded-sm border border-line px-4 text-sm hover:bg-wall-raised',
        className,
      )}
    >
      <Share2 aria-hidden="true" className="size-4" strokeWidth={1.5} />
      {t('button')}
    </button>
  );
}
