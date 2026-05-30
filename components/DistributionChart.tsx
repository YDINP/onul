'use client'

/**
 * DistributionChart
 *
 * Wordle식 힌트 분포 가로 막대 차트.
 * distribution: [1힌트, 2힌트, 3힌트, 4힌트, 5힌트, 실패] — 6개 숫자
 * playerBucket:  1~5 = 클리어(몇 번째 힌트), 0 = 실패, null = 표시 안 함
 * accent:        모드 대표 hex 색상
 */

interface DistributionChartProps {
  distribution: number[]
  playerBucket: number | null
  accent: string
}

const ROW_LABELS = ['1 힌트', '2 힌트', '3 힌트', '4 힌트', '5 힌트', '실패']

export default function DistributionChart({
  distribution,
  playerBucket,
  accent,
}: DistributionChartProps) {
  // 합계가 0이면 렌더링 생략
  const total = distribution.reduce((acc, n) => acc + (Number.isFinite(n) ? n : 0), 0)
  if (total === 0) return null

  // 최대값 (막대 너비 비례 기준)
  const maxVal = Math.max(...distribution.map((n) => (Number.isFinite(n) ? n : 0)), 1)

  return (
    <div
      className="px-4 py-3 rounded-xl mb-4"
      style={{ background: 'var(--bg-surface)' }}
      aria-label="힌트 분포 차트"
      role="img"
    >
      {/* 섹션 제목 */}
      <p
        className="text-xs font-semibold mb-3 tracking-wide"
        style={{ color: 'var(--text-muted)' }}
      >
        📊 오늘의 분포
      </p>

      <div className="flex flex-col gap-1.5">
        {ROW_LABELS.map((label, idx) => {
          const count = Number.isFinite(distribution[idx]) ? distribution[idx] : 0
          // 막대 너비: 최소 4%로 bar가 항상 보이도록
          const widthPct = Math.max(4, Math.round((count / maxVal) * 100))

          // 본인 버킷 판정
          // idx 0~4 → 1~5힌트, idx 5 → 실패(bucket=0)
          const isPlayer =
            playerBucket !== null &&
            ((playerBucket >= 1 && playerBucket <= 5 && idx === playerBucket - 1) ||
              (playerBucket === 0 && idx === 5))

          return (
            <div
              key={label}
              className="flex items-center gap-2"
              aria-label={`${label}: ${count}명${isPlayer ? ' (나)' : ''}`}
            >
              {/* 라벨 */}
              <span
                className="text-xs tabular-nums shrink-0"
                style={{
                  width: '3.5rem',
                  color: isPlayer ? accent : 'var(--text-secondary)',
                  fontWeight: isPlayer ? 700 : 400,
                }}
              >
                {label}
              </span>

              {/* 막대 + 카운트 */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <div
                  className="rounded-sm h-5 transition-all duration-500"
                  style={{
                    width: `${widthPct}%`,
                    background: isPlayer ? accent : 'var(--text-muted, #4b5563)',
                    opacity: isPlayer ? 1 : 0.45,
                    minWidth: '4px',
                  }}
                />
                <span
                  className="text-xs tabular-nums shrink-0"
                  style={{
                    color: isPlayer ? accent : 'var(--text-muted)',
                    fontWeight: isPlayer ? 700 : 400,
                  }}
                >
                  {count}
                  {isPlayer && (
                    <span
                      className="ml-1 text-xs"
                      style={{ color: accent }}
                      aria-hidden="true"
                    >
                      ← 나
                    </span>
                  )}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
