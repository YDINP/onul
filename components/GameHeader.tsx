'use client'

import type { PuzzleMode } from '@/lib/engine/types'
import type { DailyProgress } from '@/lib/daily/streak'
import { getModeInfo } from './ModeConfig'

interface GameHeaderProps {
  puzzleNumber: number
  mode: PuzzleMode
  difficulty: number
  today: string
  progress: DailyProgress
}

export default function GameHeader({
  puzzleNumber,
  mode,
  difficulty,
  today,
  progress,
}: GameHeaderProps) {
  const modeInfo = getModeInfo(mode)

  // YYYY-MM-DD → M월 D일 (요일)
  const dateDisplay = (() => {
    const [y, m, d] = today.split('-').map(Number)
    const weekdays = ['일', '월', '화', '수', '목', '금', '토']
    const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
    return `${m}월 ${d}일 (${weekdays[dow]})`
  })()

  return (
    <header className="text-center pt-6 pb-4 px-4">
      {/* 앱 이름 */}
      <h1
        className="text-2xl font-bold tracking-tight mb-1"
        style={{ color: 'var(--text-primary)' }}
      >
        오늘의 한 판
      </h1>

      {/* 퍼즐 번호 + 날짜 */}
      <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
        <span className="font-semibold" style={{ color: modeInfo.accentHex }}>
          #{puzzleNumber}
        </span>
        {' · '}
        {dateDisplay}
      </p>

      {/* 모드 배지 + 난이도 + 스트릭 */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* 모드 배지 */}
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: `${modeInfo.accentHex}1a`,
            color: modeInfo.accentHex,
            border: `1px solid ${modeInfo.accentHex}33`,
          }}
        >
          <span>{modeInfo.emoji}</span>
          <span>{modeInfo.label}</span>
        </span>

        {/* 난이도 */}
        <span
          className="inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-xs"
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
          }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              style={{ color: i < difficulty ? '#facc15' : 'var(--text-muted)' }}
            >
              ★
            </span>
          ))}
        </span>

        {/* 스트릭 */}
        {progress.currentStreak > 0 && (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: '#facc1514',
              color: '#facc15',
              border: '1px solid #facc1533',
            }}
          >
            🔥
            <span>{progress.currentStreak}</span>
            {progress.maxStreak > progress.currentStreak && (
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                / 최고 {progress.maxStreak}
              </span>
            )}
          </span>
        )}
      </div>
    </header>
  )
}
