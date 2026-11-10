/** 相邻两次输入间隔超过这个时间，中间的空闲不计入练习时长。 */
export const IDLE_LIMIT_MS = 60_000;

export function accumulateActiveMs(
  activeMs: number,
  lastActivityAt: number | null,
  now: number,
): { activeMs: number; lastActivityAt: number } {
  if (lastActivityAt === null) {
    return { activeMs, lastActivityAt: now };
  }

  const gap = now - lastActivityAt;
  if (gap > 0 && gap <= IDLE_LIMIT_MS) {
    return { activeMs: activeMs + gap, lastActivityAt: now };
  }

  return { activeMs, lastActivityAt: now };
}

export function activeMsToSeconds(activeMs: number): number {
  return Math.max(0, Math.round(activeMs / 1000));
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes === 0) return `${rest}秒`;
  if (rest === 0) return `${minutes}分钟`;
  return `${minutes}分${rest}秒`;
}
