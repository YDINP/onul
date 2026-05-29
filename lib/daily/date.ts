/**
 * 데일리 퍼즐 날짜 유틸리티 (KST 기준)
 * - 타임존은 KST(UTC+9) 고정
 * - 날짜는 항상 'YYYY-MM-DD' 문자열로 다룬다
 */

/** 퍼즐 #1 기준일 */
export const EPOCH_DATE = '2026-05-30'

const KST_OFFSET_MS = 9 * 60 * 60 * 1000 // UTC+9

/**
 * 주어진 Date를 KST 기준 'YYYY-MM-DD'로 변환한다.
 * UTC ms + 9시간 오프셋으로 계산하여 toLocaleString 의존을 피한다.
 */
export function getKSTDateString(d: Date): string {
  const kstMs = d.getTime() + KST_OFFSET_MS
  const kstDate = new Date(kstMs)
  const year = kstDate.getUTCFullYear()
  const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(kstDate.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 현재 시각을 KST 기준 'YYYY-MM-DD'로 반환한다.
 */
export function getTodayKST(): string {
  return getKSTDateString(new Date())
}

/**
 * 두 'YYYY-MM-DD' 날짜 사이의 일수 차를 반환한다 (b - a).
 * UTC 자정을 기준으로 계산한다.
 */
export function daysBetween(a: string, b: string): number {
  const aMs = Date.UTC(
    parseInt(a.slice(0, 4), 10),
    parseInt(a.slice(5, 7), 10) - 1,
    parseInt(a.slice(8, 10), 10)
  )
  const bMs = Date.UTC(
    parseInt(b.slice(0, 4), 10),
    parseInt(b.slice(5, 7), 10) - 1,
    parseInt(b.slice(8, 10), 10)
  )
  return Math.round((bMs - aMs) / (1000 * 60 * 60 * 24))
}

/**
 * 해당 날짜의 퍼즐 번호를 반환한다. (EPOCH_DATE가 #1)
 */
export function getPuzzleNumber(dateStr: string): number {
  return daysBetween(EPOCH_DATE, dateStr) + 1
}

/**
 * 현재 시각(now)으로부터 다음 KST 자정까지 남은 밀리초를 반환한다.
 */
export function msUntilNextKSTMidnight(now: Date): number {
  const kstMs = now.getTime() + KST_OFFSET_MS
  const kstDate = new Date(kstMs)
  // 다음 KST 자정 = 오늘 KST 자정 + 1일
  const kstMidnightMs =
    Date.UTC(
      kstDate.getUTCFullYear(),
      kstDate.getUTCMonth(),
      kstDate.getUTCDate() + 1
    ) - KST_OFFSET_MS
  return kstMidnightMs - now.getTime()
}

/**
 * 밀리초를 'HH:MM:SS' 형식으로 변환한다.
 */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':')
}
