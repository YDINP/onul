import type { Puzzle, PuzzleMode } from '@/lib/engine/types'
import { daysBetween, EPOCH_DATE } from './date'

/**
 * KST 요일(0=일 ~ 6=토) → 퍼즐 모드 매핑
 * 월=idiom, 화=proverb, 수=retro, 목=hanja, 금=person, 토=trivia, 일=mixed
 */
export const MODE_BY_WEEKDAY: PuzzleMode[] = [
  'mixed',   // 0 = 일
  'idiom',   // 1 = 월
  'proverb', // 2 = 화
  'retro',   // 3 = 수
  'hanja',   // 4 = 목
  'person',  // 5 = 금
  'trivia',  // 6 = 토
]

/**
 * 'YYYY-MM-DD' 날짜 문자열로부터 KST 요일을 계산한다.
 * UTC 자정으로 파싱한 뒤 KST(+9h)에서의 요일을 반환한다.
 */
function getKSTWeekday(dateStr: string): number {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000
  const utcMs = Date.UTC(
    parseInt(dateStr.slice(0, 4), 10),
    parseInt(dateStr.slice(5, 7), 10) - 1,
    parseInt(dateStr.slice(8, 10), 10)
  )
  // KST 자정 기준 요일: UTC 자정은 이미 날짜가 맞으므로 그대로 사용
  // (날짜 문자열 자체가 KST 기준이므로 UTC로 파싱해도 요일은 동일)
  return new Date(utcMs + KST_OFFSET_MS).getUTCDay()
}

/**
 * 해당 날짜의 KST 요일에 따라 퍼즐 모드를 반환한다.
 */
export function getModeForDate(dateStr: string): PuzzleMode {
  const weekday = getKSTWeekday(dateStr)
  return MODE_BY_WEEKDAY[weekday]
}

/**
 * 날짜에 대응하는 퍼즐을 결정론적으로 선택한다.
 *
 * 1) 날짜의 KST 요일로 모드 결정
 * 2) 해당 모드 퍼즐만 필터
 * 3) daysBetween(EPOCH_DATE, dateStr) % 해당 모드 퍼즐 수로 인덱스 결정
 * 4) 모드 퍼즐이 0개면 전체 puzzles에서 같은 방식으로 폴백
 *
 * 같은 날짜를 입력하면 항상 같은 퍼즐이 반환된다.
 */
export function getPuzzleForDate(dateStr: string, puzzles: Puzzle[]): Puzzle {
  const mode = getModeForDate(dateStr)
  const modePool = puzzles.filter((p) => p.mode === mode)
  const pool = modePool.length > 0 ? modePool : puzzles
  const index = daysBetween(EPOCH_DATE, dateStr) % pool.length
  return pool[Math.abs(index)]
}
