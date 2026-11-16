'use client';

import { useLocale, useTranslations } from 'next-intl';

import { countryName, formatKRW, type Locale, orderStatusLabel } from '@snb/domain';

import { useOrder } from '@/entities/order';
import { swordNameFor } from '@/entities/sword';
import { Link } from '@/shared/i18n';
import { Button, OrnamentHeading, PriceTag } from '@/shared/ui';

export function OrderReceipt({ id }: { id: string }) {
  const t = useTranslations('Order');
  const common = useTranslations('Common');
  const locale = useLocale() as Locale;
  const won = (value: number) => formatKRW(value, locale);
  const { data: order, isPending, isError } = useOrder(id);

  if (isPending) {
    return (
      <p aria-busy="true" className="py-24 text-center">
        {t('loading')}
      </p>
    );
  }
  if (isError) {
    return (
      <div className="grid justify-items-center gap-4 py-24 text-center">
        <h1 className="text-2xl text-carved">{t('notFound')}</h1>
        {/* 다른 기기에서 열었거나 주문 키가 없으면 주문번호와 이메일로 찾을 수 있습니다. */}
        <p className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/orders/lookup" className="inline-flex min-h-11 items-center underline underline-offset-4">
            {t('lookupLink')}
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4">
            {common('backToWall')}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-8">
      <header className="grid justify-items-center gap-3 text-center">
        <OrnamentHeading as="p" className="w-full">
          {t('eyebrow')}
        </OrnamentHeading>
        <h1 className="text-3xl text-carved">{t('title')}</h1>
        <p className="text-ink-muted">
          {t('number')} <strong className="font-semibold tabular-nums text-ink">{order.id}</strong> ·{' '}
          {orderStatusLabel(order.status, locale)}
        </p>
        {order.status === 'permit-review' ? <p className="text-sm text-ink-muted">{t('permitReview')}</p> : null}
      </header>

      <section aria-labelledby="receipt-lines" className="grid gap-3">
        <OrnamentHeading id="receipt-lines">{t('linesTitle')}</OrnamentHeading>
        <ul className="grid gap-2">
          {order.lines.map((line) => (
            <li key={line.swordId} className="flex justify-between gap-4">
              <span>
                {swordNameFor(line.swordId, line.name, locale)} × {line.quantity}{' '}
                <span className="text-sm text-ink-muted">
                  {t('shippedFrom', { country: countryName(line.origin, locale) })}
                </span>
              </span>
              <PriceTag
                price={line.unitPrice * line.quantity}
                listPrice={line.listPrice === undefined ? undefined : line.listPrice * line.quantity}
                className="justify-end"
              />
            </li>
          ))}
        </ul>
        <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-t border-line pt-3">
          <dt className="text-ink-muted">{t('shipping')}</dt>
          <dd className="text-right tabular-nums">{won(order.amounts.shipping)}</dd>
          <dt className="text-ink-muted">{t('duty')}</dt>
          <dd className="text-right tabular-nums">{won(order.amounts.duty)}</dd>
          <dt className="text-ink-muted">{t('vat')}</dt>
          <dd className="text-right tabular-nums">{won(order.amounts.vat)}</dd>
          <dt className="text-lg">{t('paid')}</dt>
          <dd className="text-right text-lg tabular-nums">{won(order.amounts.total)}</dd>
        </dl>
      </section>

      <section aria-labelledby="receipt-shipping" className="grid gap-3">
        <OrnamentHeading id="receipt-shipping">{t('addressTitle')}</OrnamentHeading>
        <p>
          {order.customer.name} · {countryName(order.destination, locale)}
          <br />({order.customer.postalCode}) {order.customer.address}
        </p>
      </section>

      {/* 인쇄하면 영수증만 남깁니다(머리글·바닥글·이 버튼 줄은 print:hidden). */}
      <p className="flex flex-wrap items-center justify-center gap-4 print:hidden">
        <Button type="button" variant="outline" className="min-h-11 rounded-sm" onClick={() => window.print()}>
          {t('print')}
        </Button>
        <Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4">
          {common('backToWall')}
        </Link>
      </p>
    </div>
  );
}
