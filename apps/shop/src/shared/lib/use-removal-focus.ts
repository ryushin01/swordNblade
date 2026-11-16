'use client';

import { type RefObject, useEffect, useRef } from 'react';

/** 목록 항목 안의 지우기 버튼에 붙이는 표시. 다음·앞 항목의 같은 버튼을 찾을 때 씁니다. */
export const REMOVE_CONTROL_ATTRIBUTE = 'data-remove-control';

/**
 * 목록에서 항목을 지울 때 초점을 잃지 않게 합니다(KWCAG 6.1.2). 지우기 버튼이 사라지면 초점이 문서 처음(body)으로 갔습니다.
 * - 지우기 전에 다음 항목(없으면 앞 항목)의 지우기 버튼으로 초점을 옮깁니다. 그 버튼은 지운 뒤에도 같은 요소로 남습니다.
 * - 마지막 항목을 지우면 목록 대신 그려지는 빈 목록 안내(fallbackRef, tabIndex=-1)로 옮깁니다.
 * 항목은 li 또는 tr이고, 지우기 버튼에는 REMOVE_CONTROL_ATTRIBUTE를 붙입니다.
 */
export function useRemovalFocus<T extends HTMLElement>(): {
  fallbackRef: RefObject<T | null>;
  beforeRemove: (button: HTMLElement) => void;
} {
  const fallbackRef = useRef<T>(null);
  const pending = useRef(false);

  // 빈 목록 안내는 지운 뒤의 렌더에서야 생기므로, 그려진 다음에 초점을 옮깁니다.
  useEffect(() => {
    if (!pending.current || !fallbackRef.current) return;
    pending.current = false;
    fallbackRef.current.focus();
  });

  const beforeRemove = (button: HTMLElement) => {
    const item = button.closest('li, tr');
    const sibling = item?.nextElementSibling ?? item?.previousElementSibling;
    const target = sibling?.querySelector<HTMLElement>(`[${REMOVE_CONTROL_ATTRIBUTE}]`);
    if (target) target.focus();
    else pending.current = true;
  };

  return { fallbackRef, beforeRemove };
}
