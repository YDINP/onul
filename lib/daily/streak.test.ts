import { describe, it, expect } from 'vitest'
import { computeNextStreak } from './streak'
import type { DailyProgress } from './streak'

// ─── computeNextStreak ────────────────────────────────────────────

describe('computeNextStreak', () => {
  const defaultPrev: DailyProgress = {
    lastPlayedDate: null,
    currentStreak: 0,
    maxStreak: 0,
  }

  // 최초 플레이
  it('최초 플레이(null) → currentStreak=1, maxStreak=1', () => {
    const result = computeNextStreak(defaultPrev, '2026-06-01')
    expect(result.currentStreak).toBe(1)
    expect(result.maxStreak).toBe(1)
    expect(result.lastPlayedDate).toBe('2026-06-01')
  })

  // 어제 플레이 → 연속
  it('어제 플레이 → currentStreak+1', () => {
    const prev: DailyProgress = {
      lastPlayedDate: '2026-05-31',
      currentStreak: 3,
      maxStreak: 5,
    }
    const result = computeNextStreak(prev, '2026-06-01')
    expect(result.currentStreak).toBe(4)
    expect(result.maxStreak).toBe(5) // 기존 max 유지
    expect(result.lastPlayedDate).toBe('2026-06-01')
  })

  // 어제 플레이 → maxStreak 갱신
  it('어제 플레이 → currentStreak이 maxStreak 초과 시 maxStreak 갱신', () => {
    const prev: DailyProgress = {
      lastPlayedDate: '2026-05-31',
      currentStreak: 5,
      maxStreak: 5,
    }
    const result = computeNextStreak(prev, '2026-06-01')
    expect(result.currentStreak).toBe(6)
    expect(result.maxStreak).toBe(6)
  })

  // 오늘 중복 → 변경 없음
  it('오늘 이미 카운트됨 → 변경 없음 (동일 참조)', () => {
    const prev: DailyProgress = {
      lastPlayedDate: '2026-06-01',
      currentStreak: 3,
      maxStreak: 5,
    }
    const result = computeNextStreak(prev, '2026-06-01')
    expect(result).toBe(prev) // 동일 참조 반환
  })

  // 공백(이틀 이상 건너뜀) → 리셋
  it('이틀 공백 → currentStreak=1 (리셋)', () => {
    const prev: DailyProgress = {
      lastPlayedDate: '2026-05-29',
      currentStreak: 10,
      maxStreak: 10,
    }
    const result = computeNextStreak(prev, '2026-06-01')
    expect(result.currentStreak).toBe(1)
    expect(result.maxStreak).toBe(10) // 기존 maxStreak 유지
    expect(result.lastPlayedDate).toBe('2026-06-01')
  })

  // 1주일 공백 → 리셋
  it('1주일 공백 → currentStreak=1', () => {
    const prev: DailyProgress = {
      lastPlayedDate: '2026-05-01',
      currentStreak: 20,
      maxStreak: 20,
    }
    const result = computeNextStreak(prev, '2026-06-01')
    expect(result.currentStreak).toBe(1)
    expect(result.maxStreak).toBe(20)
  })

  // 리셋 후 maxStreak 유지
  it('리셋 후 maxStreak은 기존 값 유지 (새 streak < maxStreak)', () => {
    const prev: DailyProgress = {
      lastPlayedDate: '2026-01-01',
      currentStreak: 7,
      maxStreak: 30,
    }
    const result = computeNextStreak(prev, '2026-06-01')
    expect(result.currentStreak).toBe(1)
    expect(result.maxStreak).toBe(30)
  })

  // streak=1로 시작 후 이어서 streak=2
  it('첫날 streak=1, 다음날 → streak=2', () => {
    const after1st = computeNextStreak(defaultPrev, '2026-06-01')
    const after2nd = computeNextStreak(after1st, '2026-06-02')
    expect(after2nd.currentStreak).toBe(2)
    expect(after2nd.maxStreak).toBe(2)
  })

  // 연속 3일 시나리오
  it('3일 연속 시나리오: currentStreak=3, maxStreak=3', () => {
    const after1 = computeNextStreak(defaultPrev, '2026-06-01')
    const after2 = computeNextStreak(after1, '2026-06-02')
    const after3 = computeNextStreak(after2, '2026-06-03')
    expect(after3.currentStreak).toBe(3)
    expect(after3.maxStreak).toBe(3)
    expect(after3.lastPlayedDate).toBe('2026-06-03')
  })

  // 불변성
  it('불변성: 입력 prev 변경 없음', () => {
    const prev: DailyProgress = {
      lastPlayedDate: '2026-05-31',
      currentStreak: 5,
      maxStreak: 10,
    }
    const original = { ...prev }
    computeNextStreak(prev, '2026-06-01')
    expect(prev.currentStreak).toBe(original.currentStreak)
    expect(prev.maxStreak).toBe(original.maxStreak)
    expect(prev.lastPlayedDate).toBe(original.lastPlayedDate)
  })
})
