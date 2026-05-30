import type { Puzzle } from '@/lib/engine/types'
import { getModeInfo } from './ModeConfig'

interface InfoCardProps {
  puzzle: Puzzle
}

export default function InfoCard({ puzzle }: InfoCardProps) {
  const modeInfo = getModeInfo(puzzle.mode)
  const accent = modeInfo.accentHex

  // info가 있으면 summary + facts, 없으면 hints를 사실 목록으로 활용
  const hasDedicatedInfo = !!puzzle.info
  const items: string[] = hasDedicatedInfo
    ? puzzle.info!.facts
    : puzzle.hints

  return (
    <div
      className="mt-4 rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${accent}22`,
      }}
    >
      {/* 액센트 상단 스트라이프 */}
      <div
        className="h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}44)` }}
      />

      <div className="p-4">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-base"
            aria-hidden="true"
          >
            💡
          </span>
          <h3
            className="text-sm font-bold tracking-wide"
            style={{ color: accent }}
          >
            이 단어, 더 알아보기
          </h3>
          {/* 카테고리 배지 */}
          {puzzle.category && (
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: `${accent}1a`,
                color: accent,
                border: `1px solid ${accent}33`,
              }}
            >
              {modeInfo.emoji} {puzzle.category}
            </span>
          )}
        </div>

        {/* 구분선 */}
        <div
          className="mb-3 h-px"
          style={{ background: 'var(--bg-card)' }}
        />

        {/* summary (info가 있을 때만) */}
        {hasDedicatedInfo && puzzle.info!.summary && (
          <p
            className="text-sm leading-relaxed mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            {puzzle.info!.summary}
          </p>
        )}

        {/* 사실 목록 */}
        <ol className="flex flex-col gap-2.5">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5"
            >
              {/* 번호 배지 */}
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold tabular-nums leading-none mt-0.5"
                style={{
                  background: `${accent}22`,
                  color: accent,
                  border: `1px solid ${accent}33`,
                  fontSize: '10px',
                }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
