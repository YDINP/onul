'use client'

import { useState, useEffect, useRef } from 'react'
import { allPuzzles } from '@/content/puzzles'
import {
  createGame,
  submitGuess,
  revealNextHint,
  buildShareGrid,
} from '@/lib/engine/engine'
import type { GameState } from '@/lib/engine/types'
import { recordPlay, getPuzzleStats } from '@/lib/stats'
import type { PuzzleStats } from '@/lib/stats'
import {
  getTodayKST,
  getPuzzleNumber,
  msUntilNextKSTMidnight,
  formatCountdown,
} from '@/lib/daily/date'
import { getPuzzleForDate } from '@/lib/daily/selection'
import {
  applyDailyResult,
  hasPlayedToday,
  saveDayState,
  loadDayState,
  getProgress,
} from '@/lib/daily/streak'
import type { DailyProgress } from '@/lib/daily/streak'

import GameHeader from '@/components/GameHeader'
import HintArea from '@/components/HintArea'
import GuessHistory from '@/components/GuessHistory'
import InputArea from '@/components/InputArea'
import ResultCard from '@/components/ResultCard'

// 결정론적 — SSR/클라이언트 모두 동일
const today = getTodayKST()
const puzzle = getPuzzleForDate(today, allPuzzles)
const puzzleNumber = getPuzzleNumber(today)

const DEFAULT_PROGRESS: DailyProgress = {
  lastPlayedDate: null,
  currentStreak: 0,
  maxStreak: 0,
}

export default function Home() {
  // ── SSR-safe 초기값: localStorage 미사용 ──────────────────────
  const [state, setState] = useState<GameState>(() => createGame(puzzle))
  const [input, setInput] = useState('')
  const [shareText, setShareText] = useState('')
  const [stats, setStats] = useState<PuzzleStats | null>(null)
  const [progress, setProgress] = useState<DailyProgress>(DEFAULT_PROGRESS)
  const [countdown, setCountdown] = useState<string>('')
  const [alreadyPlayed, setAlreadyPlayed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const recordedRef = useRef(false)

  // ── 마운트 후 localStorage 하이드레이션 ───────────────────────
  useEffect(() => {
    // 저장된 게임 상태 복원
    const saved = loadDayState(today)
    if (saved) setState(saved)

    // 스트릭 복원
    setProgress(getProgress())

    // 하루 1회 잠금 여부
    setAlreadyPlayed(hasPlayedToday(today))

    setMounted(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── 카운트다운 타이머 (1초마다 갱신) ─────────────────────────
  useEffect(() => {
    function tick() {
      setCountdown(formatCountdown(msUntilNextKSTMidnight(new Date())))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // ── 게임 종료 시 통계 기록/조회 (won/lost 한 번만 실행) ───────
  useEffect(() => {
    if (state.status === 'playing') return
    if (recordedRef.current) return
    recordedRef.current = true

    async function handleGameEnd() {
      const newProgress = applyDailyResult(today)
      setProgress(newProgress)

      await recordPlay({
        puzzleId: puzzle.id,
        mode: puzzle.mode,
        hintsUsed: state.hintsRevealed,
        solved: state.status === 'won',
      })
      const result = await getPuzzleStats(puzzle.id, state.hintsRevealed)
      setStats(result)
      setShareText(buildShareGrid(state, puzzleNumber, result?.avgHints ?? undefined))
    }

    handleGameEnd()
  }, [state.status]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || state.status !== 'playing') return
    const next = submitGuess(state, puzzle, input.trim())
    setState(next)
    saveDayState(today, next)
    setInput('')
  }

  function handleReveal() {
    const next = revealNextHint(state)
    setState(next)
    saveDayState(today, next)
  }

  const isFinished = state.status !== 'playing'
  // mounted 전에는 isLocked를 false로 유지 → 서버/초기 렌더 일치
  const isLocked = mounted && alreadyPlayed && state.status === 'playing'

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* 중앙 정렬 컨테이너 */}
      <div className="w-full max-w-[480px] mx-auto flex flex-col flex-1">

        {/* 헤더 — mounted 전엔 스트릭 배지 숨김(progress=기본값이라 자동으로 미표시) */}
        <GameHeader
          puzzleNumber={puzzleNumber}
          mode={puzzle.mode}
          difficulty={puzzle.difficulty}
          today={today}
          progress={mounted ? progress : DEFAULT_PROGRESS}
        />

        {/* 구분선 */}
        <div
          className="mx-4 mb-4 h-px"
          style={{ background: 'var(--bg-card)' }}
        />

        {/* 힌트 영역 */}
        <HintArea
          hints={puzzle.hints}
          revealedCount={state.hintsRevealed}
          mode={puzzle.mode}
        />

        {/* 추측 기록 */}
        <GuessHistory guesses={state.guesses} />

        {/* 입력 영역 — 진행 중이고 잠기지 않았을 때만 */}
        {state.status === 'playing' && !isLocked && (
          <InputArea
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            onReveal={handleReveal}
            canReveal={state.hintsRevealed < 5}
            mode={puzzle.mode}
          />
        )}

        {/* 이미 플레이함 (새로고침 후 진행 중 상태) */}
        {isLocked && (
          <div className="px-4 mb-4">
            <div
              className="px-4 py-3 rounded-xl text-sm text-center"
              style={{
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
              }}
            >
              오늘의 퍼즐은 이미 완료했습니다.
              <br />
              <span style={{ color: '#facc15' }}>다음 퍼즐까지: </span>
              <span
                className="font-bold tabular-nums font-mono"
                style={{ color: '#facc15' }}
              >
                {countdown}
              </span>
            </div>
          </div>
        )}

        {/* 결과 카드 */}
        {isFinished && (
          <ResultCard
            state={state}
            mode={puzzle.mode}
            answer={puzzle.answer}
            shareText={shareText}
            stats={stats}
            countdown={countdown}
            puzzleNumber={puzzleNumber}
          />
        )}

      </div>
    </div>
  )
}
