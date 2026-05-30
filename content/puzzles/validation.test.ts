import { describe, it, expect } from 'vitest'
import { allPuzzles } from './index'
import { normalizeAnswer } from '@/lib/engine/engine'

const VALID_MODES = new Set(['idiom', 'proverb', 'retro', 'hanja', 'person', 'trivia', 'mixed'])

describe('puzzle validation gate', () => {
  it('id: 비어있지 않음', () => {
    const violations = allPuzzles.filter((p) => !p.id || p.id.trim() === '')
    expect(violations, `id가 비어있는 퍼즐: ${violations.map((p) => p.id || '(empty)').join(', ')}`).toHaveLength(0)
  })

  it('id: 전체 고유 (중복 금지)', () => {
    const ids = allPuzzles.map((p) => p.id)
    const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx)
    expect(duplicates, `중복 id: ${duplicates.join(', ')}`).toHaveLength(0)
  })

  it('mode: 유효한 PuzzleMode 7종 중 하나', () => {
    const violations = allPuzzles.filter((p) => !VALID_MODES.has(p.mode))
    expect(
      violations,
      `유효하지 않은 mode를 가진 퍼즐: ${violations.map((p) => `${p.id}(mode=${p.mode})`).join(', ')}`
    ).toHaveLength(0)
  })

  it('answer: 비어있지 않음', () => {
    const violations = allPuzzles.filter((p) => !p.answer || p.answer.trim() === '')
    expect(violations, `answer가 비어있는 퍼즐: ${violations.map((p) => p.id).join(', ')}`).toHaveLength(0)
  })

  it('answer: normalize 기준 전체 고유 (중복 정답 금지)', () => {
    const normalized = allPuzzles.map((p) => normalizeAnswer(p.answer))
    const duplicates: string[] = []
    normalized.forEach((norm, idx) => {
      const firstIdx = normalized.indexOf(norm)
      if (firstIdx !== idx) {
        duplicates.push(`${allPuzzles[firstIdx].id} & ${allPuzzles[idx].id} (정답: "${allPuzzles[idx].answer}")`)
      }
    })
    expect(duplicates, `중복 정답 쌍: ${duplicates.join(', ')}`).toHaveLength(0)
  })

  it('hints: 정확히 5개', () => {
    const violations = allPuzzles.filter((p) => p.hints.length !== 5)
    expect(
      violations,
      `hints가 5개가 아닌 퍼즐: ${violations.map((p) => `${p.id}(hints=${p.hints.length})`).join(', ')}`
    ).toHaveLength(0)
  })

  it('hints: 각 항목 비어있지 않음', () => {
    const violations = allPuzzles.filter((p) =>
      p.hints.some((h) => !h || h.trim() === '')
    )
    expect(violations, `빈 hint가 있는 퍼즐: ${violations.map((p) => p.id).join(', ')}`).toHaveLength(0)
  })

  it('hints: 정답 누설 금지 (어떤 힌트에도 정답이 그대로 포함되면 안 됨)', () => {
    const violations: string[] = []
    for (const p of allPuzzles) {
      const normAnswer = normalizeAnswer(p.answer)
      for (let i = 0; i < p.hints.length; i++) {
        const normHint = normalizeAnswer(p.hints[i])
        if (normHint.includes(normAnswer)) {
          violations.push(`${p.id} - hint[${i + 1}]에 정답("${p.answer}")이 노출됨`)
        }
      }
    }
    expect(violations, `정답 누설 위반:\n${violations.join('\n')}`).toHaveLength(0)
  })

  it('acceptAlts: 배열이어야 함 (빈 배열 허용)', () => {
    const violations = allPuzzles.filter((p) => !Array.isArray(p.acceptAlts))
    expect(violations, `acceptAlts가 배열이 아닌 퍼즐: ${violations.map((p) => p.id).join(', ')}`).toHaveLength(0)
  })

  it('difficulty: 1~5 정수', () => {
    const violations = allPuzzles.filter(
      (p) =>
        typeof p.difficulty !== 'number' ||
        !Number.isInteger(p.difficulty) ||
        p.difficulty < 1 ||
        p.difficulty > 5
    )
    expect(
      violations,
      `difficulty가 1~5 정수가 아닌 퍼즐: ${violations.map((p) => `${p.id}(difficulty=${p.difficulty})`).join(', ')}`
    ).toHaveLength(0)
  })

  it('date: 존재 시 YYYY-MM-DD 형식', () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    const violations = allPuzzles.filter(
      (p) => p.date !== undefined && !dateRegex.test(p.date)
    )
    expect(
      violations,
      `date 형식 위반 퍼즐: ${violations.map((p) => `${p.id}(date="${p.date}")`).join(', ')}`
    ).toHaveLength(0)
  })

  it('info: 모든 퍼즐에 존재', () => {
    const violations = allPuzzles.filter((p) => !p.info)
    expect(violations, `info가 없는 퍼즐: ${violations.map((p) => p.id).join(', ')}`).toHaveLength(0)
  })

  it('info.summary: 비어있지 않음', () => {
    const violations = allPuzzles.filter(
      (p) => p.info && (!p.info.summary || p.info.summary.trim() === '')
    )
    expect(violations, `info.summary가 비어있는 퍼즐: ${violations.map((p) => p.id).join(', ')}`).toHaveLength(0)
  })

  it('info.facts: 1개 이상의 비어있지 않은 항목', () => {
    const violations = allPuzzles.filter(
      (p) =>
        p.info &&
        (!Array.isArray(p.info.facts) ||
          p.info.facts.length < 1 ||
          p.info.facts.some((f) => !f || f.trim() === ''))
    )
    expect(
      violations,
      `info.facts가 유효하지 않은 퍼즐: ${violations.map((p) => p.id).join(', ')}`
    ).toHaveLength(0)
  })
})
