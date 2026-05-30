import { supabase } from './supabase/client'

export interface PuzzleStats {
  totalPlays: number
  solvedCount: number
  solveRate: number
  avgHints: number | null
  topPercent: number | null
  /** 힌트별 클리어 분포: [1힌트, 2힌트, 3힌트, 4힌트, 5힌트, 실패] — 6개 */
  distribution: number[]
}

/** localStorage에서 세션 ID를 가져오거나 새로 생성한다. SSR 환경에서는 빈 문자열 반환. */
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  const KEY = 'onul_session_id'
  const existing = localStorage.getItem(KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  localStorage.setItem(KEY, id)
  return id
}

/**
 * 게임 결과를 onul_plays 테이블에 기록한다.
 * - supabase 클라이언트가 null이면 no-op
 * - unique(puzzle_id, session_id) 충돌은 조용히 무시
 * - 모든 에러는 조용히 삼킴
 */
export async function recordPlay(args: {
  puzzleId: string
  mode: string
  hintsUsed: number
  solved: boolean
}): Promise<void> {
  if (!supabase) return
  const sessionId = getSessionId()
  if (!sessionId) return

  try {
    // anon은 INSERT만 허용(SELECT 정책 없음) → upsert(ON CONFLICT)는 RLS 충돌검사에서 401.
    // 평범한 insert를 사용하고, unique(puzzle_id,session_id) 중복(409)은 조용히 무시한다.
    // 데일리 잠금이 재플레이를 막으므로 정상 흐름에선 중복이 거의 없다.
    const { error } = await supabase.from('onul_plays').insert({
      puzzle_id: args.puzzleId,
      session_id: sessionId,
      mode: args.mode,
      hints_used: args.hintsUsed,
      solved: args.solved,
    })
    // error(중복 등)는 의도적으로 무시
    void error
  } catch {
    // 네트워크 등 예외 조용히 삼킴
  }
}

/**
 * RPC get_onul_puzzle_stats를 호출해 퍼즐 통계를 반환한다.
 * - supabase 클라이언트가 null이면 null 반환
 * - 에러 시 null 반환
 */
export async function getPuzzleStats(
  puzzleId: string,
  hintsUsed: number
): Promise<PuzzleStats | null> {
  if (!supabase) return null

  try {
    const { data, error } = await supabase.rpc('get_onul_puzzle_stats', {
      p_puzzle_id: puzzleId,
      p_hints_used: hintsUsed,
    })
    if (error || !data || !data[0]) return null

    const row = data[0]
    return {
      totalPlays: Number(row.total_plays),
      solvedCount: Number(row.solved_count),
      solveRate: Number(row.solve_rate),
      avgHints: row.avg_hints !== null && row.avg_hints !== undefined ? Number(row.avg_hints) : null,
      topPercent: row.top_percent !== null && row.top_percent !== undefined ? Number(row.top_percent) : null,
      distribution: Array.isArray(row.distribution)
        ? (row.distribution as unknown[]).map(Number)
        : [0, 0, 0, 0, 0, 0],
    }
  } catch {
    return null
  }
}
