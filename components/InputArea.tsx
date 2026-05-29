'use client'

import type { PuzzleMode } from '@/lib/engine/types'
import { getModeInfo } from './ModeConfig'

interface InputAreaProps {
  input: string
  onInputChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onReveal: () => void
  canReveal: boolean
  mode: PuzzleMode
}

export default function InputArea({
  input,
  onInputChange,
  onSubmit,
  onReveal,
  canReveal,
  mode,
}: InputAreaProps) {
  const modeInfo = getModeInfo(mode)

  return (
    <section className="px-4 mb-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        {/* 입력창 + 제출 버튼 한 줄 */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="정답을 입력하세요..."
            aria-label="정답 입력"
            autoComplete="off"
            autoCorrect="off"
            className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              border: '1px solid var(--bg-card)',
              ['--tw-ring-color' as string]: `${modeInfo.accentHex}44`,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = `${modeInfo.accentHex}66`
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--bg-card)'
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="정답 제출"
            className="flex-shrink-0 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: modeInfo.accentHex,
              color: '#0d0d0d',
              minWidth: '72px',
            }}
          >
            제출
          </button>
        </div>

        {/* 힌트 더 보기 버튼 */}
        {canReveal && (
          <button
            type="button"
            onClick={onReveal}
            aria-label="다음 힌트 보기"
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              border: `1px solid ${modeInfo.accentHex}22`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${modeInfo.accentHex}55`
              e.currentTarget.style.color = modeInfo.accentHex
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${modeInfo.accentHex}22`
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <span>💡</span>
            <span>힌트 더 보기</span>
          </button>
        )}
      </form>
    </section>
  )
}
