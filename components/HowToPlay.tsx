'use client'

import { useEffect, useCallback, type ReactNode } from 'react'

interface HowToPlayProps {
  open: boolean
  onClose: () => void
}

const RULES: { num: number; icon: string; text: ReactNode }[] = [
  {
    num: 1,
    icon: '📅',
    text: '매일 새로운 퍼즐 1판이 제공됩니다 (자정 갱신)',
  },
  {
    num: 2,
    icon: '🔍',
    text: '5단계 힌트가 점점 쉬워집니다',
  },
  {
    num: 3,
    icon: '⭐',
    text: (
      <>
        <strong style={{ color: '#facc15' }}>적은 힌트로 맞힐수록 고득점</strong>
        {'  '}
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8em' }}>
          (1힌트 = 100점)
        </span>
      </>
    ),
  },
  {
    num: 4,
    icon: '❌',
    text: '오답이면 다음 힌트가 자동으로 열립니다',
  },
  {
    num: 5,
    icon: '📤',
    text: '결과를 친구와 공유해 보세요',
  },
]

const DAY_MODES = [
  { day: '월', mode: '사자성어', accent: '#60a5fa', emoji: '📚' },
  { day: '화', mode: '속담',     accent: '#a78bfa', emoji: '🗣️' },
  { day: '수', mode: '레트로',   accent: '#fb923c', emoji: '📟' },
  { day: '목', mode: '한자어',   accent: '#34d399', emoji: '🀄' },
  { day: '금', mode: '인물',     accent: '#f472b6', emoji: '🧑' },
  { day: '토', mode: '상식반전', accent: '#38bdf8', emoji: '🎯' },
  { day: '일', mode: '종합',     accent: '#c084fc', emoji: '🌀' },
]

export default function HowToPlay({ open, onClose }: HowToPlayProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleKeyDown])

  // 모달 열릴 때 body 스크롤 잠금
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    /* 오버레이 */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="howtoplay-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'modalOverlayIn 0.2s ease both',
      }}
    >
      {/* 카드 — 클릭 버블링 차단 */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          maxHeight: '90dvh',
          overflowY: 'auto',
          borderRadius: '20px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--bg-card)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          animation: 'modalCardIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
      >
        {/* 상단 헤더 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 20px 0',
          }}
        >
          <h2
            id="howtoplay-title"
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            오늘의 한 판 — 게임 방법
          </h2>

          {/* X 닫기 */}
          <button
            onClick={onClose}
            aria-label="닫기"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              lineHeight: 1,
              flexShrink: 0,
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = '#333'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
            }}
          >
            ✕
          </button>
        </div>

        {/* 구분선 */}
        <div
          style={{
            margin: '14px 20px 0',
            height: '1px',
            background: 'var(--bg-card)',
          }}
        />

        {/* 규칙 목록 */}
        <div style={{ padding: '16px 20px 0' }}>
          <p
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '10px',
            }}
          >
            규칙
          </p>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {RULES.map((rule) => (
              <li
                key={rule.num}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'var(--bg-card)',
                }}
              >
                {/* 번호 배지 */}
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--bg-input)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                >
                  {rule.num}
                </span>

                {/* 아이콘 */}
                <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '1px' }}>
                  {rule.icon}
                </span>

                {/* 텍스트 */}
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.55,
                  }}
                >
                  {rule.text}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* 요일별 모드 */}
        <div style={{ padding: '16px 20px 0' }}>
          <p
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '10px',
            }}
          >
            요일별 테마
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
            }}
          >
            {DAY_MODES.map(({ day, mode, accent, emoji }) => (
              <div
                key={day}
                title={mode}
                style={{
                  borderRadius: '8px',
                  background: 'var(--bg-card)',
                  padding: '8px 4px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: accent,
                    lineHeight: 1,
                  }}
                >
                  {day}
                </span>
                <span style={{ fontSize: '1rem', lineHeight: 1 }}>{emoji}</span>
                <span
                  style={{
                    fontSize: '0.6rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.2,
                    wordBreak: 'keep-all',
                  }}
                >
                  {mode}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 시작하기 버튼 */}
        <div style={{ padding: '20px' }}>
          <button
            onClick={onClose}
            autoFocus
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              border: 'none',
              background: '#facc15',
              color: '#0d0d0d',
              fontSize: '0.9375rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.88'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
            }}
          >
            시작하기
          </button>
        </div>
      </div>

      {/* 모달 애니메이션 keyframes */}
      <style>{`
        @keyframes modalOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalCardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  )
}
