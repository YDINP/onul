import { describe, it, expect } from 'vitest'
import {
  getKSTDateString,
  getTodayKST,
  daysBetween,
  getPuzzleNumber,
  msUntilNextKSTMidnight,
  formatCountdown,
  EPOCH_DATE,
} from './date'

// ─── EPOCH_DATE ───────────────────────────────────────────────────

describe('EPOCH_DATE', () => {
  it('2026-05-30 이어야 한다', () => {
    expect(EPOCH_DATE).toBe('2026-05-30')
  })
})

// ─── getKSTDateString ─────────────────────────────────────────────

describe('getKSTDateString', () => {
  it('UTC 2026-05-29 15:00:00 → KST 2026-05-30 (자정 넘김)', () => {
    // UTC 15:00 = KST 다음날 00:00
    const d = new Date('2026-05-29T15:00:00Z')
    expect(getKSTDateString(d)).toBe('2026-05-30')
  })

  it('UTC 2026-05-30 14:59:59 → KST 2026-05-30 23:59:59 (아직 같은 날)', () => {
    const d = new Date('2026-05-30T14:59:59Z')
    expect(getKSTDateString(d)).toBe('2026-05-30')
  })

  it('UTC 2026-05-30 15:00:00 → KST 2026-05-31 자정 (날짜 바뀜)', () => {
    const d = new Date('2026-05-30T15:00:00Z')
    expect(getKSTDateString(d)).toBe('2026-05-31')
  })

  it('UTC 자정(00:00:00)은 KST 09:00이므로 같은 날', () => {
    const d = new Date('2026-06-01T00:00:00Z')
    expect(getKSTDateString(d)).toBe('2026-06-01')
  })

  it('UTC 2026-05-29 14:59:59 → KST 2026-05-29 (아직 자정 안 됨)', () => {
    const d = new Date('2026-05-29T14:59:59Z')
    expect(getKSTDateString(d)).toBe('2026-05-29')
  })

  it('연도 말 경계: UTC 2025-12-31T15:00:00Z → KST 2026-01-01', () => {
    const d = new Date('2025-12-31T15:00:00Z')
    expect(getKSTDateString(d)).toBe('2026-01-01')
  })
})

// ─── getTodayKST ──────────────────────────────────────────────────

describe('getTodayKST', () => {
  it('YYYY-MM-DD 형식을 반환한다', () => {
    const result = getTodayKST()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

// ─── daysBetween ──────────────────────────────────────────────────

describe('daysBetween', () => {
  it('같은 날짜는 0을 반환한다', () => {
    expect(daysBetween('2026-05-30', '2026-05-30')).toBe(0)
  })

  it('하루 차이는 1을 반환한다', () => {
    expect(daysBetween('2026-05-30', '2026-05-31')).toBe(1)
  })

  it('역방향이면 음수를 반환한다', () => {
    expect(daysBetween('2026-05-31', '2026-05-30')).toBe(-1)
  })

  it('월 경계를 올바르게 계산한다', () => {
    expect(daysBetween('2026-05-30', '2026-06-01')).toBe(2)
  })

  it('연도 경계를 올바르게 계산한다', () => {
    expect(daysBetween('2025-12-31', '2026-01-01')).toBe(1)
  })

  it('윤년 2월을 올바르게 계산한다', () => {
    // 2028년은 윤년 (2월 29일 있음)
    expect(daysBetween('2028-02-28', '2028-03-01')).toBe(2)
  })
})

// ─── getPuzzleNumber ──────────────────────────────────────────────

describe('getPuzzleNumber', () => {
  it('EPOCH_DATE 당일은 #1을 반환한다', () => {
    expect(getPuzzleNumber('2026-05-30')).toBe(1)
  })

  it('다음날은 #2를 반환한다', () => {
    expect(getPuzzleNumber('2026-05-31')).toBe(2)
  })

  it('7일 뒤는 #8을 반환한다', () => {
    expect(getPuzzleNumber('2026-06-06')).toBe(8)
  })

  it('100일 뒤는 #101을 반환한다', () => {
    expect(getPuzzleNumber('2026-09-07')).toBe(101)
  })
})

// ─── msUntilNextKSTMidnight ───────────────────────────────────────

describe('msUntilNextKSTMidnight', () => {
  it('KST 자정 직전 1초 → 1000ms 미만 반환', () => {
    // KST 23:59:59 = UTC 14:59:59
    const d = new Date('2026-05-30T14:59:59Z')
    const ms = msUntilNextKSTMidnight(d)
    expect(ms).toBeGreaterThan(0)
    expect(ms).toBeLessThanOrEqual(1000)
  })

  it('KST 자정 직후(00:00:01) → 약 24시간 - 1초', () => {
    // KST 00:00:01 = UTC 전날 15:00:01
    const d = new Date('2026-05-29T15:00:01Z')
    const ms = msUntilNextKSTMidnight(d)
    const expected = 24 * 60 * 60 * 1000 - 1000
    expect(ms).toBeGreaterThan(expected - 2000)
    expect(ms).toBeLessThanOrEqual(24 * 60 * 60 * 1000)
  })

  it('양수 값을 반환한다', () => {
    const ms = msUntilNextKSTMidnight(new Date())
    expect(ms).toBeGreaterThan(0)
  })
})

// ─── formatCountdown ──────────────────────────────────────────────

describe('formatCountdown', () => {
  it('0ms → 00:00:00', () => {
    expect(formatCountdown(0)).toBe('00:00:00')
  })

  it('음수 ms → 00:00:00', () => {
    expect(formatCountdown(-1000)).toBe('00:00:00')
  })

  it('1초(1000ms) → 00:00:01', () => {
    expect(formatCountdown(1000)).toBe('00:00:01')
  })

  it('1분(60000ms) → 00:01:00', () => {
    expect(formatCountdown(60_000)).toBe('00:01:00')
  })

  it('1시간 → 01:00:00', () => {
    expect(formatCountdown(3_600_000)).toBe('01:00:00')
  })

  it('23시간 59분 59초', () => {
    expect(formatCountdown(23 * 3_600_000 + 59 * 60_000 + 59_000)).toBe('23:59:59')
  })

  it('HH:MM:SS 형식 검증', () => {
    const result = formatCountdown(5 * 3_600_000 + 3 * 60_000 + 7_000)
    expect(result).toBe('05:03:07')
  })
})
