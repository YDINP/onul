import { idiomPuzzles } from './modes/idiom'
import { proverbPuzzles } from './modes/proverb'
import { retroPuzzles } from './modes/retro'
import { hanjaPuzzles } from './modes/hanja'
import { personPuzzles } from './modes/person'
import { triviaPuzzles } from './modes/trivia'
import { mixedPuzzles } from './modes/mixed'
import type { Puzzle } from '@/lib/engine/types'

export const allPuzzles: Puzzle[] = [
  ...idiomPuzzles,
  ...proverbPuzzles,
  ...retroPuzzles,
  ...hanjaPuzzles,
  ...personPuzzles,
  ...triviaPuzzles,
  ...mixedPuzzles,
]
