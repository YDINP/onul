'use client'

import type { GameState, PuzzleMode } from '@/lib/engine/types'
import type { PuzzleStats } from '@/lib/stats'
import { getModeInfo } from './ModeConfig'

interface ResultCardProps {
  state: GameState
  mode: PuzzleMode
  answer: string
  shareText: string
  stats: PuzzleStats | null
  countdown: string
  puzzleNumber: number
}

/** retro 모드 세대 배지 계산 */
function getRetroBadge(hintsUsed: number, won: boolean): { emoji: string; label: string } | null {
  if (!won) return { emoji: '👶', label: 'MZ인증' }
  if (hintsUsed <= 2) return { emoji: '🏆', label: '찐 X세대' }
  if (hintsUsed <= 4) return { emoji: '🤔', label: '알듯 말듯' }
  return { emoji: '👶', label: 'MZ인증' }
}

/** 상위 % → 텍스트 */
function topPercentText(tp: number): string {
  if (tp <= 5) return `상위 ${Math.round(tp)}% 🌟`
  if (tp <= 20) return `상위 ${Math.round(tp)}%`
  return `상위 ${Math.round(tp)}%`
}

export default function ResultCard({
  state,
  mode,
  answer,
  shareText,
  stats,
  countdown,
  puzzleNumber,
}: ResultCardProps) {
  const modeInfo = getModeInfo(mode)
  const won = state.status === 'won'
  const retroBadge = mode === 'retro' ? getRetroBadge(state.hintsRevealed, won) : null

  async function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ text: shareText })
        return
      } catch {
        // 취소 또는 미지원 → 클립보드로 폴백
      }
    }
    await navigator.clipboard.writeText(shareText)
    alert('클립보드에 복사했습니다!')
  }

  return (
    <div className="px-4 pb-8 result-enter">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border: `1px solid ${won ? '#22c55e33' : '#ef444433'}`,
        }}
      >
        {/* 상단 컬러 스트라이프 */}
        <div
          className="h-1 w-full"
          style={{ background: won ? '#22c55e' : '#ef4444' }}
        />

        <div className="p-5">
          {/* 승/패 헤더 */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p
                className="text-2xl font-bold leading-tight"
                style={{ color: won ? '#22c55e' : '#ef4444' }}
              >
                {won ? '정답! 🎉' : '아쉽게도 미해결 😢'}
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {won
                  ? `${state.hintsRevealed}번째 힌트에서 맞혔습니다`
                  : '내일 다시 도전해보세요'}
              </p>
            </div>
            {won && (
              <div
                className="text-right flex-shrink-0"
              >
                <p
                  className="text-3xl font-bold tabular-nums leading-none"
                  style={{ color: modeInfo.accentHex }}
                >
                  {state.score}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>점수</p>
              </div>
            )}
          </div>

          {/* 정답 공개 */}
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4"
            style={{ background: 'var(--bg-surface)' }}
          >
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>정답</span>
            <span
              className="text-lg font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {answer}
            </span>
          </div>

          {/* retro 세대 배지 */}
          {retroBadge && (
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-4"
              style={{
                background: '#fb923c14',
                border: '1px solid #fb923c33',
              }}
            >
              <span className="text-lg">{retroBadge.emoji}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#fb923c' }}>
                  {retroBadge.label}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {won
                    ? retroBadge.label === '찐 X세대'
                      ? '1~2힌트 클리어! 레트로 고수시네요'
                      : '3~4힌트 클리어, 어릴 때 기억 더듬었죠?'
                    : '아직 MZ감성이 강한가봐요 😄'}
                </p>
              </div>
            </div>
          )}

          {/* 사회적 비교 통계 */}
          {stats && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <StatChip
                label="정답률"
                value={`${Math.round(stats.solveRate)}%`}
                accent={modeInfo.accentHex}
              />
              {stats.avgHints !== null && (
                <StatChip
                  label="평균 힌트"
                  value={`${stats.avgHints.toFixed(1)}개`}
                  accent={modeInfo.accentHex}
                />
              )}
              {stats.topPercent !== null && (
                <StatChip
                  label="내 순위"
                  value={topPercentText(stats.topPercent)}
                  accent={modeInfo.accentHex}
                />
              )}
            </div>
          )}

          {/* 이모지 그리드 공유 미리보기 */}
          <div
            className="px-4 py-3 rounded-xl mb-4 font-mono text-base leading-relaxed select-all"
            style={{
              background: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {shareText}
          </div>

          {/* 공유 버튼 */}
          <button
            onClick={handleShare}
            aria-label="결과 공유하기"
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 mb-4"
            style={{
              background: modeInfo.accentHex,
              color: '#0d0d0d',
            }}
          >
            <span>공유하기</span>
            <span>→</span>
          </button>

          {/* 다음 퍼즐 카운트다운 */}
          <div
            className="flex items-center justify-center gap-2 py-2 rounded-xl"
            style={{
              background: 'var(--bg-surface)',
            }}
          >
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              다음 퍼즐까지
            </span>
            <span
              className="text-sm font-bold tabular-nums font-mono"
              style={{ color: '#facc15' }}
            >
              {countdown}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatChip({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: string
}) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 py-2.5 px-2 rounded-xl"
      style={{
        background: `${accent}0d`,
        border: `1px solid ${accent}22`,
      }}
    >
      <span className="text-base font-bold leading-none" style={{ color: accent }}>
        {value}
      </span>
      <span className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  )
}
