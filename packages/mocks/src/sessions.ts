/** 회원 로그인 세션 유지 기간 */
export const USER_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
/** 어드민 데모 로그인 세션 유지 기간 */
export const ADMIN_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

/** 만든 지 ttl이 지나지 않은 세션인지. 시각을 읽지 못하면 지난 것으로 봅니다. */
export const isFreshSession = (createdAt: string, ttl: number, now = Date.now()): boolean => {
  const created = Date.parse(createdAt);
  return Number.isFinite(created) && now - created < ttl;
};
