import type { PuzzleMode } from '@/lib/engine/types'

export interface ModeInfo {
  emoji: string
  label: string
  accentVar: string   // CSS 변수명 (var(...) 형식)
  accentHex: string   // 인라인 스타일용 hex
}

export const MODE_CONFIG: Record<PuzzleMode, ModeInfo> = {
  idiom:   { emoji: '📚', label: '사자성어', accentVar: 'var(--accent-idiom)',   accentHex: '#60a5fa' },
  proverb: { emoji: '🗣️', label: '속담',     accentVar: 'var(--accent-proverb)', accentHex: '#a78bfa' },
  retro:   { emoji: '📟', label: '레트로',   accentVar: 'var(--accent-retro)',   accentHex: '#fb923c' },
  hanja:   { emoji: '🀄', label: '한자',     accentVar: 'var(--accent-hanja)',   accentHex: '#34d399' },
  person:  { emoji: '🧑', label: '인물',     accentVar: 'var(--accent-person)',  accentHex: '#f472b6' },
  trivia:  { emoji: '🎯', label: '상식',     accentVar: 'var(--accent-trivia)',  accentHex: '#38bdf8' },
  mixed:   { emoji: '🌀', label: '혼합',     accentVar: 'var(--accent-mixed)',   accentHex: '#c084fc' },
}

export function getModeInfo(mode: PuzzleMode): ModeInfo {
  return MODE_CONFIG[mode] ?? MODE_CONFIG.mixed
}
