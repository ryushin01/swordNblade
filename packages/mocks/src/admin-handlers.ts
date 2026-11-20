import { http, HttpResponse } from 'msw';

import { ADMIN_DEMO_ACCOUNT } from './admin-account';
import { ADMIN_SESSION_TTL_MS, isFreshSession } from './sessions';

import type { AdminSession, Db } from './db';

/** 만료되지 않은 어드민 세션만 남깁니다. 만료를 두기 전의 토큰 문자열도 버립니다. */
const freshAdminSessions = (sessions: Array<AdminSession | string> | undefined): AdminSession[] =>
  (sessions ?? []).filter(
    (session): session is AdminSession =>
      typeof session === 'object' && isFreshSession(session.createdAt, ADMIN_SESSION_TTL_MS),
  );

export function isAdmin(db: Db, request: Request): boolean {
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  return Boolean(token && freshAdminSessions(db.read().adminSessions).some((session) => session.token === token));
}

export function createAdminHandlers(db: Db, wait: () => Promise<unknown>) {
  return [
    http.post('*/api/admin/login', async ({ request }) => {
      await wait();
      const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
      if (body?.email !== ADMIN_DEMO_ACCOUNT.email || body.password !== ADMIN_DEMO_ACCOUNT.password) {
        return HttpResponse.json({ message: '이메일 또는 비밀번호가 맞지 않습니다.' }, { status: 401 });
      }
      const token = crypto.randomUUID();
      // 새 세션을 더하면서 만료된 세션은 지워 저장값이 끝없이 늘지 않게 합니다.
      db.write((state) => ({
        ...state,
        adminSessions: [...freshAdminSessions(state.adminSessions), { token, createdAt: new Date().toISOString() }],
      }));
      return HttpResponse.json({ token });
    }),

    http.post('*/api/admin/logout', async ({ request }) => {
      await wait();
      const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
      db.write((state) => ({
        ...state,
        adminSessions: freshAdminSessions(state.adminSessions).filter((session) => session.token !== token),
      }));
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}

export { ADMIN_DEMO_ACCOUNT } from './admin-account';
