import { describe, it, expect } from 'vitest'
import { getModeForDate, getPuzzleForDate, MODE_BY_WEEKDAY } from './selection'
import type { Puzzle } from '@/lib/engine/types'

// ─── 테스트용 퍼즐 픽스처 ─────────────────────────────────────────

function makePuzzle(id: string, mode: Puzzle['mode']): Puzzle {
  return {
    id,
    date: '2026-01-01',
    mode,
    answer: id,
    hints: ['h1', 'h2', 'h3', 'h4', 'h5'],
    acceptAlts: [],
    difficulty: 1,
  }
}

const allModePuzzles: Puzzle[] = [
  makePuzzle('idiom-1', 'idiom'),
  makePuzzle('idiom-2', 'idiom'),
  makePuzzle('proverb-1', 'proverb'),
  makePuzzle('retro-1', 'retro'),
  makePuzzle('hanja-1', 'hanja'),
  makePuzzle('person-1', 'person'),
  makePuzzle('trivia-1', 'trivia'),
  makePuzzle('mixed-1', 'mixed'),
  makePuzzle('mixed-2', 'mixed'),
]

// ─── MODE_BY_WEEKDAY 구조 검증 ────────────────────────────────────

describe('MODE_BY_WEEKDAY', () => {
  it('길이가 7이어야 한다', () => {
    expect(MODE_BY_WEEKDAY).toHaveLength(7)
  })

  it('인덱스 0(일)=mixed, 1(월)=idiom, 2(화)=proverb', () => {
    expect(MODE_BY_WEEKDAY[0]).toBe('mixed')
    expect(MODE_BY_WEEKDAY[1]).toBe('idiom')
    expect(MODE_BY_WEEKDAY[2]).toBe('proverb')
  })

  it('인덱스 3(수)=retro, 4(목)=hanja, 5(금)=person, 6(토)=trivia', () => {
    expect(MODE_BY_WEEKDAY[3]).toBe('retro')
    expect(MODE_BY_WEEKDAY[4]).toBe('hanja')
    expect(MODE_BY_WEEKDAY[5]).toBe('person')
    expect(MODE_BY_WEEKDAY[6]).toBe('trivia')
  })
})

// ─── getModeForDate ───────────────────────────────────────────────

describe('getModeForDate', () => {
  // 2026-05-30 (토요일) → trivia
  it('2026-05-30 (토) → trivia', () => {
    expect(getModeForDate('2026-05-30')).toBe('trivia')
  })

  // 2026-05-31 (일요일) → mixed
  it('2026-05-31 (일) → mixed', () => {
    expect(getModeForDate('2026-05-31')).toBe('mixed')
  })

  // 2026-06-01 (월요일) → idiom
  it('2026-06-01 (월) → idiom', () => {
    expect(getModeForDate('2026-06-01')).toBe('idiom')
  })

  // 2026-06-02 (화요일) → proverb
  it('2026-06-02 (화) → proverb', () => {
    expect(getModeForDate('2026-06-02')).toBe('proverb')
  })

  // 2026-06-03 (수요일) → retro
  it('2026-06-03 (수) → retro', () => {
    expect(getModeForDate('2026-06-03')).toBe('retro')
  })

  // 2026-06-04 (목요일) → hanja
  it('2026-06-04 (목) → hanja', () => {
    expect(getModeForDate('2026-06-04')).toBe('hanja')
  })

  // 2026-06-05 (금요일) → person
  it('2026-06-05 (금) → person', () => {
    expect(getModeForDate('2026-06-05')).toBe('person')
  })
})

// ─── getPuzzleForDate ─────────────────────────────────────────────

describe('getPuzzleForDate', () => {
  it('결정론성: 같은 날짜 → 항상 같은 퍼즐', () => {
    const date = '2026-06-01'
    const p1 = getPuzzleForDate(date, allModePuzzles)
    const p2 = getPuzzleForDate(date, allModePuzzles)
    expect(p1.id).toBe(p2.id)
  })

  it('모드 필터 동작: 월(idiom) 날짜 → idiom 퍼즐만 선택됨', () => {
    // 2026-06-01 = 월요일 → idiom
    const result = getPuzzleForDate('2026-06-01', allModePuzzles)
    expect(result.mode).toBe('idiom')
  })

  it('모드 필터 동작: 토(trivia) 날짜 → trivia 퍼즐 선택됨', () => {
    // 2026-05-30 = 토요일 → trivia
    const result = getPuzzleForDate('2026-05-30', allModePuzzles)
    expect(result.mode).toBe('trivia')
  })

  it('폴백: 해당 모드 퍼즐이 없으면 전체 풀에서 선택', () => {
    const idiomOnly: Puzzle[] = [makePuzzle('idiom-only', 'idiom')]
    // 2026-06-02 = 화요일 → proverb 모드이나 퍼즐 없음 → 폴백
    const result = getPuzzleForDate('2026-06-02', idiomOnly)
    expect(result.id).toBe('idiom-only')
  })

  it('다른 날짜는 다른 퍼즐이 나올 수 있다 (다양성 확인)', () => {
    // idiom 퍼즐 2개가 있을 때, 서로 다른 월요일이면 다른 퍼즐 선택 가능
    const dates = ['2026-06-01', '2026-06-08'] // 두 월요일
    const results = dates.map((d) => getPuzzleForDate(d, allModePuzzles))
    // 최소한 선택된 퍼즐이 유효한 idiom 퍼즐이어야 함
    results.forEach((r) => expect(r.mode).toBe('idiom'))
  })

  it('single puzzle pool: 유일한 퍼즐이 항상 선택된다', () => {
    const single: Puzzle[] = [makePuzzle('only', 'idiom')]
    const result = getPuzzleForDate('2026-06-01', single)
    expect(result.id).toBe('only')
  })

  it('반환 퍼즐은 puzzles 배열 원소 중 하나여야 한다', () => {
    const result = getPuzzleForDate('2026-06-01', allModePuzzles)
    expect(allModePuzzles).toContain(result)
  })
})
