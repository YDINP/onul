import type { Metadata } from "next";
import Link from "next/link";
import { allPuzzles } from "@/content/puzzles";
import { getModeInfo } from "@/components/ModeConfig";
import type { PuzzleMode } from "@/lib/engine/types";

export const metadata: Metadata = {
  title: "퍼즐 아카이브 | 오늘의 한 판",
  description:
    "지금까지의 모든 단어를 뜻·핵심 사실과 함께 살펴보세요. 사자성어, 속담, 레트로, 한자, 인물, 상식, 혼합 7가지 테마의 퍼즐 아카이브.",
};

const MODE_ORDER: PuzzleMode[] = [
  "idiom",
  "proverb",
  "hanja",
  "retro",
  "person",
  "trivia",
  "mixed",
];

export default function ArchivePage() {
  // 모드별 그룹핑
  const grouped = MODE_ORDER.map((mode) => ({
    mode,
    modeInfo: getModeInfo(mode),
    puzzles: allPuzzles.filter((p) => p.mode === mode),
  })).filter((group) => group.puzzles.length > 0);

  const totalCount = allPuzzles.length;

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 상단 네비 */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-white/50 hover:text-white/80 transition-colors text-sm mb-8"
        >
          ← 홈
        </Link>

        {/* 페이지 헤더 */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">퍼즐 아카이브</h1>
          <p className="text-white/50 leading-relaxed">
            지금까지의 모든 단어를 뜻·핵심 사실과 함께 살펴보세요.
          </p>
          <p className="text-white/25 text-sm mt-1">
            총 {totalCount}개 단어 · 7가지 테마
          </p>
        </div>

        {/* 모드별 섹션 */}
        <div className="space-y-12">
          {grouped.map(({ mode, modeInfo, puzzles }) => (
            <section key={mode}>
              {/* 섹션 헤더 */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <span className="text-xl">{modeInfo.emoji}</span>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: modeInfo.accentHex }}
                >
                  {modeInfo.label}
                </h2>
                <span className="text-white/25 text-sm ml-auto">
                  {puzzles.length}개
                </span>
              </div>

              {/* 퍼즐 카드 그리드 */}
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {puzzles.map((puzzle) => (
                  <li key={puzzle.id}>
                    <Link
                      href={`/puzzle/${puzzle.id}`}
                      className="group flex flex-col gap-1 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.07] hover:border-white/20 transition-all"
                    >
                      <span className="font-semibold text-white group-hover:text-white/90 transition-colors">
                        {puzzle.answer}
                      </span>
                      {puzzle.category && (
                        <span className="text-xs text-white/35 truncate">
                          {puzzle.category}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* 하단 CTA */}
        <div className="mt-14 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm mb-4">
            매일 새로운 퍼즐에 도전해보세요.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white/[0.08] text-white/70 border border-white/[0.15] hover:bg-white/[0.12] hover:text-white/90 transition-all"
          >
            오늘의 퍼즐 풀러 가기 →
          </Link>
        </div>
      </div>
    </main>
  );
}
