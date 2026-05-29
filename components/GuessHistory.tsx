'use client'

import type { Guess } from '@/lib/engine/types'

interface GuessHistoryProps {
  guesses: Guess[]
}

export default function GuessHistory({ guesses }: GuessHistoryProps) {
  if (guesses.length === 0) return null

  return (
    <section className="px-4 mb-4">
      <h2
        className="text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: 'var(--text-muted)' }}
      >
        추측 기록
      </h2>
      <div className="flex flex-wrap gap-2">
        {guesses.map((g, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{
              background: g.correct ? '#22c55e1a' : '#ef44441a',
              color: g.correct ? '#22c55e' : '#ef4444',
              border: `1px solid ${g.correct ? '#22c55e33' : '#ef444433'}`,
            }}
          >
            <span className="text-xs">{g.correct ? '✓' : '✗'}</span>
            <span>{g.value}</span>
          </span>
        ))}
      </div>
    </section>
  )
}
