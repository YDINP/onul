import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allPuzzles } from "@/content/puzzles";
import { getModeInfo } from "@/components/ModeConfig";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return allPuzzles.map((puzzle) => ({ id: puzzle.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const puzzle = allPuzzles.find((p) => p.id === id);

  if (!puzzle) {
    return { title: "단어를 찾을 수 없습니다 | 오늘의 한 판" };
  }

  const description =
    puzzle.info?.summary ??
    `${puzzle.category ?? ""}${puzzle.category ? " 분야의 " : ""}한국어 단어 "${puzzle.answer}"의 뜻과 핵심 사실을 알아보세요.`;

  return {
    title: `${puzzle.answer} — 뜻과 핵심 사실 | 오늘의 한 판`,
    description,
    openGraph: {
      title: `${puzzle.answer} — 뜻과 핵심 사실 | 오늘의 한 판`,
      description,
    },
  };
}

export default async function PuzzleKnowledgePage({ params }: Props) {
  const { id } = await params;
  const puzzle = allPuzzles.find((p) => p.id === id);

  if (!puzzle) notFound();

  const modeInfo = getModeInfo(puzzle.mode);

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* 뒤로 가기 */}
        <Link
          href="/archive"
          className="inline-flex items-center gap-1 text-white/50 hover:text-white/80 transition-colors text-sm mb-8"
        >
          ← 아카이브
        </Link>

        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* 모드 배지 */}
            <span
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${modeInfo.accentHex}22`,
                color: modeInfo.accentHex,
                border: `1px solid ${modeInfo.accentHex}44`,
              }}
            >
              {modeInfo.emoji} {modeInfo.label}
            </span>
            {/* 카테고리 배지 */}
            {puzzle.category && (
              <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/10">
                {puzzle.category}
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            {puzzle.answer}
          </h1>
        </div>

        <div className="space-y-8">
          {/* 정의 */}
          {puzzle.info?.summary && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                정의
              </h2>
              <p className="text-white/85 leading-relaxed text-[1.05rem]">
                {puzzle.info.summary}
              </p>
            </section>
          )}

          {/* 핵심 사실 */}
          {puzzle.info?.facts && puzzle.info.facts.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                핵심 사실
              </h2>
              <ol className="space-y-3">
                {puzzle.info.facts.map((fact, index) => (
                  <li key={index} className="flex gap-3 text-white/75 leading-relaxed">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{
                        backgroundColor: `${modeInfo.accentHex}22`,
                        color: modeInfo.accentHex,
                      }}
                    >
                      {index + 1}
                    </span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* 힌트 */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
              참고 — 힌트
            </h2>
            <p className="text-white/30 text-xs mb-3">
              퍼즐에서 이 단어를 맞추기 위해 제공되는 5단계 단서입니다.
            </p>
            <ul className="space-y-2">
              {puzzle.hints.map((hint, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-white/60 text-sm leading-relaxed p-3 rounded-lg bg-white/[0.03] border border-white/[0.07]"
                >
                  <span className="flex-shrink-0 text-white/25 font-mono text-xs mt-0.5">
                    {index + 1}
                  </span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* 하단 CTA */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 text-center py-3 px-4 rounded-xl font-semibold text-sm transition-all"
            style={{
              backgroundColor: `${modeInfo.accentHex}22`,
              color: modeInfo.accentHex,
              border: `1px solid ${modeInfo.accentHex}44`,
            }}
          >
            오늘의 퍼즐 풀러 가기 →
          </Link>
          <Link
            href="/archive"
            className="flex-1 text-center py-3 px-4 rounded-xl font-semibold text-sm bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all"
          >
            다른 단어 보기
          </Link>
        </div>
      </div>
    </main>
  );
}
