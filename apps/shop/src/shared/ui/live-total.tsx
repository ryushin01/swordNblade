import { useLocale } from 'next-intl';

import { formatKRW, type Locale } from '@snb/domain';

/** 금액이 바뀌면 화면낭독기에 합계만 짧게 알려 줍니다. */
export function LiveTotal({ total, label }: { total: number; label: string }) {
  const locale = useLocale() as Locale;
  return (
    // role="status"는 polite·atomic을 함께 뜻합니다. 영역은 처음부터 두고 글자만 바꿔야 읽힙니다.
    <p className="sr-only" role="status">
      {label} {formatKRW(total, locale)}
    </p>
  );
}
