'use client'

import { useEffect, useRef, useState } from 'react'
import type { PuzzleMode } from '@/lib/engine/types'
import { getModeInfo } from './ModeConfig'

interface HintAreaProps {
  hints: string[]           // 전체 5개
  revealedCount: number     // 공개된 수
  mode: PuzzleMode
}

export default function HintArea({ hints, revealedCount, mode }: HintAreaProps) {
  const modeInfo = getModeInfo(mode)
  const TOTAL = 5
  const prevCountRef = useRef(revealedCount)
  const [newlyRevealedIdx, setNewlyRevealedIdx] = useState<number | null>(null)

  // 새 힌트 해금 감지 → 애니메이션 트리거
  useEffect(() => {
    if (revealedCount > prevCountRef.current) {
      setNewlyRevealedIdx(revealedCount - 1)
      const t = setTimeout(() => setNewlyRevealedIdx(null), 600)
      prevCountRef.current = revealedCount
      return () => clearTimeout(t)
    }
    prevCountRef.current = revealedCount
  }, [revealedCount])

  return (
    <section className="px-4 mb-4">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          힌트
        </h2>
        <span
          className="text-xs font-semibold tabular-nums"
          style={{ color: modeInfo.accentHex }}
        >
          {revealedCount} / {TOTAL}
        </span>
      </div>

      {/* 힌트 진행 바 */}
      <div
        className="h-0.5 rounded-full mb-3 overflow-hidden"
        style={{ background: 'var(--bg-card)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${(revealedCount / TOTAL) * 100}%`,
            background: modeInfo.accentHex,
          }}
        />
      </div>

      {/* 힌트 카드 목록 */}
      <ol className="space-y-2">
        {Array.from({ length: TOTAL }, (_, i) => {
          const isRevealed = i < revealedCount
          const isNew = i === newlyRevealedIdx

          return (
            <li
              key={i}
              className={isNew ? 'hint-card-enter' : ''}
            >
              {isRevealed ? (
                /* 공개된 힌트 */
                <div
                  className="flex gap-3 items-start px-3.5 py-3 rounded-xl"
                  style={{
                    background: 'var(--bg-card)',
                    border: isNew
                      ? `1px solid ${modeInfo.accentHex}44`
                      : '1px solid transparent',
                    transition: 'border-color 0.4s ease',
                  }}
                >
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
                    style={{
                      background: `${modeInfo.accentHex}22`,
                      color: modeInfo.accentHex,
                    }}
                  >
                    {i + 1}
                  </span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {hints[i]}
                  </p>
                </div>
              ) : (
                /* 잠긴 힌트 */
                <div
                  className="flex gap-3 items-center px-3.5 py-2.5 rounded-xl"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px dashed var(--bg-card)',
                  }}
                >
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center"
                    style={{
                      background: 'var(--bg-card)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    🔒 힌트 {i + 1}
                  </p>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
