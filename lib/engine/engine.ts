import type { GameState, Puzzle } from './types'

/**
 * 정답 문자열을 정규화한다.
 * - NFC 정규화
 * - 모든 공백, 문장부호, 가운뎃점(·) 제거
 * - 소문자화 (영문 포함 시)
 * - 한글은 그대로 보존
 */
export function normalizeAnswer(s: string): string {
  return s
    .normalize('NFC')
    .replace(/[\s·\.,\!\?\;\:\-\_\(\)\[\]\{\}\"\'\/\\]/g, '')
    .toLowerCase()
}

/**
 * 사용자 입력이 퍼즐 정답 또는 허용 정답 중 하나와 일치하는지 확인한다.
 */
export function isCorrect(guess: string, puzzle: Puzzle): boolean {
  const normalizedGuess = normalizeAnswer(guess)
  const normalizedAnswer = normalizeAnswer(puzzle.answer)
  if (normalizedGuess === normalizedAnswer) return true
  return puzzle.acceptAlts.some(
    (alt) => normalizeAnswer(alt) === normalizedGuess
  )
}

/**
 * 퍼즐로부터 초기 게임 상태를 생성한다.
 */
export function createGame(puzzle: Puzzle): GameState {
  return {
    puzzleId: puzzle.id,
    hintsRevealed: 1,
    guesses: [],
    status: 'playing',
    score: 0,
  }
}

/**
 * 사용한 힌트 수에 따른 점수를 계산한다.
 * 1→100, 2→80, 3→60, 4→40, 5→20, 그 외→0
 */
export function computeScore(hintsUsed: number): number {
  const scoreMap: Record<number, number> = {
    1: 100,
    2: 80,
    3: 60,
    4: 40,
    5: 20,
  }
  return scoreMap[hintsUsed] ?? 0
}

/**
 * 추측을 제출하고 새로운 게임 상태를 반환한다. (불변 — 입력 state 변경 없음)
 *
 * 규칙:
 * - status가 'playing'이 아니면 그대로 반환
 * - 정답이면: won, score = computeScore(현재 hintsRevealed)
 * - 오답이면: hintsRevealed < 5 이면 +1
 *            hintsRevealed가 이미 5였다면 lost, score = 0
 */
export function submitGuess(
  state: GameState,
  puzzle: Puzzle,
  guess: string
): GameState {
  if (state.status !== 'playing') return state

  const correct = isCorrect(guess, puzzle)
  const newGuesses = [...state.guesses, { value: guess, correct }]

  if (correct) {
    return {
      ...state,
      guesses: newGuesses,
      status: 'won',
      score: computeScore(state.hintsRevealed),
    }
  }

  // 오답
  if (state.hintsRevealed < 5) {
    return {
      ...state,
      guesses: newGuesses,
      hintsRevealed: state.hintsRevealed + 1,
    }
  }

  // 오답 + 이미 힌트 5개 공개 → 게임 오버
  return {
    ...state,
    guesses: newGuesses,
    status: 'lost',
    score: 0,
  }
}

/**
 * 수동으로 다음 힌트를 해금한다. (불변)
 * playing 상태이고 hintsRevealed < 5 일 때만 동작.
 */
export function revealNextHint(state: GameState): GameState {
  if (state.status !== 'playing' || state.hintsRevealed >= 5) return state
  return {
    ...state,
    hintsRevealed: state.hintsRevealed + 1,
  }
}

/**
 * SNS 공유용 텍스트를 생성한다.
 *
 * 예시 (won, 2힌트):
 *   오늘의 한 판 #142
 *   🟨🟩
 *   2힌트 클리어 | 점수 80
 *   평균 2.5힌트
 *   https://onul.vercel.app
 *
 * 예시 (lost):
 *   오늘의 한 판 #142
 *   🟥🟥🟥🟥🟥
 *   미해결
 *   https://onul.vercel.app
 */
export function buildShareGrid(
  state: GameState,
  puzzleNumber: number,
  avgHints?: number
): string {
  const lines: string[] = [`오늘의 한 판 #${puzzleNumber}`]

  if (state.status === 'won') {
    const hintsUsed = state.hintsRevealed
    // 정답 전까지는 🟨, 마지막(정답) 칸은 🟩
    const emojiLine =
      '🟨'.repeat(Math.max(0, hintsUsed - 1)) + '🟩'
    lines.push(emojiLine)
    lines.push(`${hintsUsed}힌트 클리어 | 점수 ${state.score}`)
  } else {
    // lost
    lines.push('🟥'.repeat(5))
    lines.push('미해결')
  }

  if (avgHints !== undefined) {
    lines.push(`평균 ${avgHints}힌트`)
  }

  lines.push('https://onul.vercel.app')
  return lines.join('\n')
}
