import { describe, it, expect } from 'vitest'
import {
  normalizeAnswer,
  isCorrect,
  createGame,
  computeScore,
  submitGuess,
  revealNextHint,
  buildShareGrid,
} from './engine'
import type { Puzzle, GameState } from './types'

// ─── 테스트용 퍼즐 픽스처 ─────────────────────────────────────────

const mockPuzzle: Puzzle = {
  id: 'test-001',
  date: '2026-06-01',
  mode: 'idiom',
  answer: '유비무환',
  hints: ['힌트1', '힌트2', '힌트3', '힌트4', '힌트5'],
  acceptAlts: ['有備無患', '유비 무환'],
  category: '사자성어',
  difficulty: 2,
}

// ─── normalizeAnswer ──────────────────────────────────────────────

describe('normalizeAnswer', () => {
  it('공백을 제거한다', () => {
    expect(normalizeAnswer('유비 무환')).toBe('유비무환')
  })

  it('문장부호를 제거한다', () => {
    expect(normalizeAnswer('유비, 무환!')).toBe('유비무환')
  })

  it('가운뎃점(·)을 제거한다', () => {
    expect(normalizeAnswer('유비·무환')).toBe('유비무환')
  })

  it('영문을 소문자화한다', () => {
    expect(normalizeAnswer('Hello World')).toBe('helloworld')
  })

  it('NFC 정규화를 수행한다', () => {
    // NFD 분해 문자 → NFC 합성 후 동일한 결과
    const nfd = '한' // '한'의 NFD
    const nfc = '한' // '한'의 NFC
    expect(normalizeAnswer(nfd)).toBe(normalizeAnswer(nfc))
  })

  it('한글을 그대로 보존한다', () => {
    expect(normalizeAnswer('이순신')).toBe('이순신')
  })

  it('빈 문자열은 빈 문자열을 반환한다', () => {
    expect(normalizeAnswer('')).toBe('')
  })

  it('탭·줄바꿈 등 다양한 공백을 제거한다', () => {
    expect(normalizeAnswer('유비\t무환\n')).toBe('유비무환')
  })
})

// ─── isCorrect ────────────────────────────────────────────────────

describe('isCorrect', () => {
  it('정확한 정답을 맞힌다', () => {
    expect(isCorrect('유비무환', mockPuzzle)).toBe(true)
  })

  it('acceptAlts(한자 표기)도 정답으로 인정한다', () => {
    expect(isCorrect('有備無患', mockPuzzle)).toBe(true)
  })

  it('acceptAlts(공백 포함 표기)도 정답으로 인정한다', () => {
    expect(isCorrect('유비 무환', mockPuzzle)).toBe(true)
  })

  it('정답의 공백 변형도 맞힌다', () => {
    expect(isCorrect(' 유비무환 ', mockPuzzle)).toBe(true)
  })

  it('오답은 false를 반환한다', () => {
    expect(isCorrect('아무말', mockPuzzle)).toBe(false)
  })

  it('빈 문자열은 오답이다', () => {
    expect(isCorrect('', mockPuzzle)).toBe(false)
  })

  it('부분 일치는 오답이다', () => {
    expect(isCorrect('유비', mockPuzzle)).toBe(false)
  })
})

// ─── createGame ───────────────────────────────────────────────────

describe('createGame', () => {
  it('올바른 초기 상태를 생성한다', () => {
    const state = createGame(mockPuzzle)
    expect(state.puzzleId).toBe('test-001')
    expect(state.hintsRevealed).toBe(1)
    expect(state.guesses).toEqual([])
    expect(state.status).toBe('playing')
    expect(state.score).toBe(0)
  })
})

// ─── computeScore ─────────────────────────────────────────────────

describe('computeScore', () => {
  it('1힌트 → 100점', () => expect(computeScore(1)).toBe(100))
  it('2힌트 → 80점', () => expect(computeScore(2)).toBe(80))
  it('3힌트 → 60점', () => expect(computeScore(3)).toBe(60))
  it('4힌트 → 40점', () => expect(computeScore(4)).toBe(40))
  it('5힌트 → 20점', () => expect(computeScore(5)).toBe(20))
  it('0힌트 → 0점 (경계값)', () => expect(computeScore(0)).toBe(0))
  it('6힌트 → 0점 (범위 초과)', () => expect(computeScore(6)).toBe(0))
  it('-1힌트 → 0점 (음수)', () => expect(computeScore(-1)).toBe(0))
})

// ─── submitGuess ──────────────────────────────────────────────────

describe('submitGuess', () => {
  const baseState: GameState = createGame(mockPuzzle)

  it('① 1힌트 정답 → won, score 100', () => {
    const result = submitGuess(baseState, mockPuzzle, '유비무환')
    expect(result.status).toBe('won')
    expect(result.score).toBe(100)
    expect(result.guesses).toHaveLength(1)
    expect(result.guesses[0]).toEqual({ value: '유비무환', correct: true })
  })

  it('② 오답 → hintsRevealed 증가', () => {
    const result = submitGuess(baseState, mockPuzzle, '아무말')
    expect(result.status).toBe('playing')
    expect(result.hintsRevealed).toBe(2)
    expect(result.guesses[0]).toEqual({ value: '아무말', correct: false })
  })

  it('③ 5힌트째 오답 → lost, score 0', () => {
    const state5: GameState = { ...baseState, hintsRevealed: 5 }
    const result = submitGuess(state5, mockPuzzle, '오답')
    expect(result.status).toBe('lost')
    expect(result.score).toBe(0)
    expect(result.hintsRevealed).toBe(5) // 더 이상 증가하지 않음
  })

  it('③-b 힌트 4개일 때 오답 → hintsRevealed 5로 증가 (아직 playing)', () => {
    const state4: GameState = { ...baseState, hintsRevealed: 4 }
    const result = submitGuess(state4, mockPuzzle, '오답')
    expect(result.status).toBe('playing')
    expect(result.hintsRevealed).toBe(5)
  })

  it('④ won 상태 후 추가 입력 무시', () => {
    const wonState: GameState = {
      ...baseState,
      status: 'won',
      score: 100,
    }
    const result = submitGuess(wonState, mockPuzzle, '유비무환')
    expect(result).toBe(wonState) // 동일 참조 반환
  })

  it('④-b lost 상태 후 추가 입력 무시', () => {
    const lostState: GameState = { ...baseState, status: 'lost' }
    const result = submitGuess(lostState, mockPuzzle, '유비무환')
    expect(result).toBe(lostState)
  })

  it('⑤ 불변성: 입력 state 변경 없음', () => {
    const original = { ...baseState }
    submitGuess(baseState, mockPuzzle, '아무말')
    expect(baseState.guesses).toEqual(original.guesses)
    expect(baseState.hintsRevealed).toBe(original.hintsRevealed)
    expect(baseState.status).toBe(original.status)
    expect(baseState.score).toBe(original.score)
  })

  it('⑤-b guesses 배열 불변성 (원본 배열 미변경)', () => {
    const originalGuesses = baseState.guesses
    const result = submitGuess(baseState, mockPuzzle, '오답')
    expect(result.guesses).not.toBe(originalGuesses)
    expect(originalGuesses).toHaveLength(0)
  })

  it('2힌트째 정답 → score 80', () => {
    const state2: GameState = { ...baseState, hintsRevealed: 2 }
    const result = submitGuess(state2, mockPuzzle, '유비무환')
    expect(result.status).toBe('won')
    expect(result.score).toBe(80)
  })
})

// ─── revealNextHint ───────────────────────────────────────────────

describe('revealNextHint', () => {
  it('playing이고 hintsRevealed < 5 일 때 +1', () => {
    const state: GameState = createGame(mockPuzzle)
    const result = revealNextHint(state)
    expect(result.hintsRevealed).toBe(2)
  })

  it('hintsRevealed가 5이면 변경 없음', () => {
    const state5: GameState = { ...createGame(mockPuzzle), hintsRevealed: 5 }
    const result = revealNextHint(state5)
    expect(result.hintsRevealed).toBe(5)
    expect(result).toBe(state5)
  })

  it('won 상태에서는 변경 없음', () => {
    const wonState: GameState = { ...createGame(mockPuzzle), status: 'won' }
    const result = revealNextHint(wonState)
    expect(result).toBe(wonState)
  })

  it('lost 상태에서는 변경 없음', () => {
    const lostState: GameState = { ...createGame(mockPuzzle), status: 'lost' }
    const result = revealNextHint(lostState)
    expect(result).toBe(lostState)
  })

  it('불변성: 원본 state 변경 없음', () => {
    const state = createGame(mockPuzzle)
    const originalHints = state.hintsRevealed
    revealNextHint(state)
    expect(state.hintsRevealed).toBe(originalHints)
  })
})

// ─── buildShareGrid ───────────────────────────────────────────────

describe('buildShareGrid', () => {
  it('won 상태 — 힌트 수·결과 반영', () => {
    const wonState: GameState = {
      ...createGame(mockPuzzle),
      hintsRevealed: 2,
      status: 'won',
      score: 80,
    }
    const result = buildShareGrid(wonState, 142)
    expect(result).toContain('오늘의 한 판 #142')
    expect(result).toContain('🟩')
    expect(result).toContain('2힌트 클리어')
    expect(result).toContain('80')
    expect(result).toContain('https://onul.app')
  })

  it('lost 상태 — 미해결 표시', () => {
    const lostState: GameState = {
      ...createGame(mockPuzzle),
      hintsRevealed: 5,
      status: 'lost',
      score: 0,
    }
    const result = buildShareGrid(lostState, 143)
    expect(result).toContain('오늘의 한 판 #143')
    expect(result).toContain('🟥')
    expect(result).toContain('미해결')
    expect(result).toContain('https://onul.app')
  })

  it('won 상태 — avgHints 줄 포함', () => {
    const wonState: GameState = {
      ...createGame(mockPuzzle),
      hintsRevealed: 3,
      status: 'won',
      score: 60,
    }
    const result = buildShareGrid(wonState, 144, 2.5)
    expect(result).toContain('평균 2.5힌트')
  })

  it('avgHints 없으면 평균 줄 없음', () => {
    const wonState: GameState = {
      ...createGame(mockPuzzle),
      status: 'won',
      score: 100,
    }
    const result = buildShareGrid(wonState, 145)
    expect(result).not.toContain('평균')
  })

  it('1힌트 클리어 시 이모지는 🟩 단독', () => {
    const wonState: GameState = {
      ...createGame(mockPuzzle),
      hintsRevealed: 1,
      status: 'won',
      score: 100,
    }
    const result = buildShareGrid(wonState, 146)
    expect(result).toContain('🟩')
    expect(result).not.toContain('🟨')
  })

  it('3힌트 클리어 시 이모지는 🟨🟨🟩', () => {
    const wonState: GameState = {
      ...createGame(mockPuzzle),
      hintsRevealed: 3,
      status: 'won',
      score: 60,
    }
    const result = buildShareGrid(wonState, 147)
    const lines = result.split('\n')
    const emojiLine = lines.find(
      (l) => l.includes('🟨') || l.includes('🟩')
    )
    expect(emojiLine).toBe('🟨🟨🟩')
  })
})
