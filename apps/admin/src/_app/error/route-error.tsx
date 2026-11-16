'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button, Flex, Result } from 'antd';

export interface ErrorScreenProps {
  /** 던져진 값. 클라이언트에서 던진 값은 Error가 아닐 수도 있습니다. */
  error: unknown;
  /** 오류가 난 화면을 다시 받아 그립니다(Next.js 16.4 오류 경계). */
  retry: () => void;
}

/**
 * 화면을 그리다 난 오류(app/error.tsx). 관리 메뉴는 그대로 두고 404 화면과 같은 Result로 알립니다.
 * 기본 화면(영어 "Application error")에서는 메뉴까지 사라져 다른 화면으로 갈 수 없었습니다.
 */
export function RouteError({ error, retry }: ErrorScreenProps) {
  useEffect(() => {
    // 어드민은 오류 수집을 쓰지 않아 브라우저 콘솔에만 남깁니다.
    console.error(error);
  }, [error]);

  return (
    <Result
      status="error"
      title={<h1 style={{ fontSize: 24, margin: 0 }}>화면을 그리지 못했습니다</h1>}
      subTitle="잠시 문제가 생겼습니다. 다시 시도하거나 대시보드로 돌아가 주세요."
      extra={
        <Flex gap={16} justify="center" align="center" wrap>
          <Button type="primary" onClick={() => retry()}>
            다시 시도
          </Button>
          <Link href="/">대시보드로 가기</Link>
        </Flex>
      }
    />
  );
}
