export type PuzzleMode = 'idiom' | 'proverb' | 'retro' | 'hanja' | 'person' | 'trivia' | 'mixed'

export interface Puzzle {
  id: string
  date: string            // YYYY-MM-DD
  mode: PuzzleMode
  answer: string          // 정답(표준 표기)
  hints: string[]         // 정확히 5개, 추상→구체 순으로 점점 구체화
  acceptAlts: string[]    // 추가 허용 정답(표기 변형/동의어). 없으면 []
  category?: string
  difficulty: number      // 1~5
}

export type GameStatus = 'playing' | 'won' | 'lost'

export interface Guess {
  value: string
  correct: boolean
}

export interface GameState {
  puzzleId: string
  hintsRevealed: number   // 1~5 (시작 시 1)
  guesses: Guess[]
  status: GameStatus
  score: number           // 종료 시 확정, 진행 중 0
}
