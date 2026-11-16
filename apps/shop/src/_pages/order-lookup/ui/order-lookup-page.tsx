import { getTranslations, setRequestLocale } from 'next-intl/server';

import { type AppLocale, languageAlternates } from '@/shared/i18n';

import { OrderLookupForm } from './order-lookup-form';

import type { Metadata } from 'next';

type Params = Promise<{ locale: string }>;

export async function generateOrderLookupMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  // 사람마다 다른 결과를 보여 주는 화면이라 검색에 올리지 않습니다.
  return {
    title: t('orderLookup'),
    alternates: languageAlternates('/orders/lookup', locale as AppLocale),
    robots: { index: false },
  };
}

/** 비회원 주문 조회: 주문번호와 주문할 때 쓴 이메일로 주문 확인을 엽니다. */
export async function OrderLookupPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Lookup');
  return (
    <div className="mx-auto grid w-full max-w-md gap-6 px-4 py-12">
      <h1 className="text-carved text-center text-3xl">{t('title')}</h1>
      <p className="text-center text-ink-muted">{t('intro')}</p>
      <OrderLookupForm />
    </div>
  );
}
