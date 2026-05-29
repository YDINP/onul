import type { GameState } from '@/lib/engine/types'
import { daysBetween } from './date'

export interface DailyProgress {
  lastPlayedDate: string | null
  currentStreak: number
  maxStreak: number
}

const PROGRESS_KEY = 'onul_daily_progress'
const DAY_STATE_PREFIX = 'onul_day_'

/** 기본 DailyProgress 값 */
const DEFAULT_PROGRESS: DailyProgress = {
  lastPlayedDate: null,
  currentStreak: 0,
  maxStreak: 0,
}

// ─── 순수 함수 (테스트 대상) ──────────────────────────────────────

/**
 * 이전 진행 상태와 오늘 날짜를 받아 새 DailyProgress를 반환한다. (불변)
 *
 * - prev.lastPlayedDate === todayStr → 이미 카운트됨, 변경 없음
 * - prev.lastPlayedDate === todayStr 하루 전 → currentStreak + 1
 * - 그 외(공백/최초/null) → currentStreak = 1
 * - maxStreak = max(기존, 새 currentStreak)
 * - lastPlayedDate = todayStr
 */
export function computeNextStreak(
  prev: DailyProgress,
  todayStr: string
): DailyProgress {
  // 이미 오늘 카운트됨
  if (prev.lastPlayedDate === todayStr) {
    return prev
  }

  let newStreak: number
  if (
    prev.lastPlayedDate !== null &&
    daysBetween(prev.lastPlayedDate, todayStr) === 1
  ) {
    // 어제 플레이 → 연속
    newStreak = prev.currentStreak + 1
  } else {
    // 공백/최초 → 새 스트릭 시작
    newStreak = 1
  }

  return {
    lastPlayedDate: todayStr,
    currentStreak: newStreak,
    maxStreak: Math.max(prev.maxStreak, newStreak),
  }
}

// ─── localStorage 래퍼 (클라이언트 전용) ─────────────────────────

/**
 * localStorage에서 DailyProgress를 읽는다.
 * SSR 환경 또는 파싱 실패 시 기본값을 반환한다.
 */
export function getProgress(): DailyProgress {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS }
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return { ...DEFAULT_PROGRESS }
    return JSON.parse(raw) as DailyProgress
  } catch {
    return { ...DEFAULT_PROGRESS }
  }
}

/**
 * 오늘의 결과를 반영하여 스트릭을 갱신하고 저장한다.
 * getProgress → computeNextStreak → 저장 → 반환
 */
export function applyDailyResult(todayStr: string): DailyProgress {
  const prev = getProgress()
  const next = computeNextStreak(prev, todayStr)
  if (next !== prev) {
    // 변경이 있을 때만 저장
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next))
  }
  return next
}

/**
 * 해당 날짜의 게임 상태를 localStorage에 저장한다.
 * 새로고침 시 복원에 사용된다.
 */
export function saveDayState(dateStr: string, state: GameState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(DAY_STATE_PREFIX + dateStr, JSON.stringify(state))
}

/**
 * 해당 날짜의 저장된 게임 상태를 불러온다.
 * 없거나 파싱 실패 시 null을 반환한다.
 */
export function loadDayState(dateStr: string): GameState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(DAY_STATE_PREFIX + dateStr)
    if (!raw) return null
    return JSON.parse(raw) as GameState
  } catch {
    return null
  }
}

/**
 * 오늘 이미 게임을 완료했는지 확인한다.
 * 저장된 day state가 존재하고 status가 'playing'이 아니면 true.
 */
export function hasPlayedToday(dateStr: string): boolean {
  const state = loadDayState(dateStr)
  if (!state) return false
  return state.status !== 'playing'
}
