'use client';

import { type FormEvent, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { isValidEmail } from '@snb/domain';

import { useLookupOrder } from '@/entities/order';
import { ApiRequestError } from '@/shared/api';
import { Link, useRouter } from '@/shared/i18n';
import { Button, ErrorSummary, TextField, useErrorFocus } from '@/shared/ui';

type Field = 'id' | 'email';
const ORDER: Field[] = ['id', 'email'];

/**
 * 주문번호와 이메일로 주문을 찾아 주문 확인 화면으로 갑니다. 찾으면 받은 주문 키를 이 기기에 남겨 다시 열 수 있습니다.
 * 틀렸을 때 어느 칸이 틀렸는지는 밝히지 않습니다(남의 주문번호나 이메일을 짐작하지 못하게).
 */
export function OrderLookupForm() {
  const t = useTranslations('Lookup');
  const router = useRouter();
  const lookup = useLookupOrder();
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [message, setMessage] = useState<string | null>(null);
  const { ref: summaryRef, moveFocus } = useErrorFocus();
  // isPending은 다음 렌더에야 바뀌므로 빠른 연속 클릭은 ref로 막습니다. 찾으면 화면을 떠나므로 실패했을 때만 풉니다.
  const lockRef = useRef(false);

  const show = (nextErrors: Partial<Record<Field, string>>, nextMessage: string) => {
    setErrors(nextErrors);
    setMessage(nextMessage);
    moveFocus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (lockRef.current) return;
    const form = new FormData(event.currentTarget);
    const id = String(form.get('id') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const nextErrors: Partial<Record<Field, string>> = {};
    if (!id) nextErrors.id = t('errors.id');
    if (!isValidEmail(email)) nextErrors.email = t('errors.email');
    if (Object.keys(nextErrors).length > 0) return show(nextErrors, t('checkError'));

    lockRef.current = true;
    lookup.mutate(
      { id, email },
      {
        onSuccess: (found) => router.push(`/orders/${encodeURIComponent(found.id)}`),
        onError: (error) => {
          lockRef.current = false;
          show({}, error instanceof ApiRequestError && error.status === 404 ? t('notFound') : t('genericError'));
        },
      },
    );
  };

  const fieldList = ORDER.filter((field) => errors[field]);

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-5" aria-busy={lookup.isPending}>
      {message ? (
        <ErrorSummary
          id="lookup-error-title"
          summaryRef={summaryRef}
          message={message}
          items={fieldList.map((field) => ({ fieldId: `lookup-${field}`, text: `${t(field)}: ${errors[field]}` }))}
        />
      ) : null}
      <TextField
        id="lookup-id"
        label={t('id')}
        name="id"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        hint={t('idHint')}
        required
        error={errors.id}
      />
      <TextField
        id="lookup-email"
        label={t('email')}
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        hint={t('emailHint')}
        required
        error={errors.email}
      />
      <Button type="submit" size="lg" disabled={lookup.isPending} className="h-12 rounded-sm text-base small-caps">
        {lookup.isPending ? t('submitting') : t('submit')}
      </Button>
      <p className="text-center text-sm">
        <Link href="/account" className="underline underline-offset-4">
          {t('accountLink')}
        </Link>
      </p>
    </form>
  );
}
