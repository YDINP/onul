import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "소개 — 오늘의 한 판",
  description:
    "오늘의 한 판은 하루 한 번, 5단계 힌트로 정답을 추리하는 한국어 데일리 퍼즐 게임입니다.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white px-4 py-8">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-white/50 hover:text-white/80 transition-colors text-sm mb-8"
        >
          ← 오늘의 한 판
        </Link>

        <h1 className="text-2xl font-bold mb-6">오늘의 한 판 소개</h1>

        <section className="space-y-6 text-white/80 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              어떤 게임인가요?
            </h2>
            <p>
              오늘의 한 판은 매일 새로운 퍼즐이 출제되는 한국어 추리 게임입니다.
              하루에 한 판, 5단계 힌트를 단계적으로 공개하며 정답을 맞혀보세요.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              게임 방법
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>매일 자정에 새 퍼즐이 시작됩니다.</li>
              <li>
                처음에는 첫 번째 힌트만 공개됩니다. 정답을 입력하거나 다음 힌트
                보기를 선택할 수 있습니다.
              </li>
              <li>
                힌트는 최대 5단계까지 있으며, 힌트를 덜 사용할수록 높은 점수를
                받습니다.
              </li>
              <li>정답을 맞히면 결과 카드를 친구들과 공유할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              7가지 요일별 모드
            </h2>
            <p>
              월요일부터 일요일까지 각기 다른 테마의 퍼즐이 출제됩니다. 인물,
              장소, 사물, 사건 등 다양한 카테고리로 구성되어 매일 새로운 재미를
              느낄 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">
              결과 공유
            </h2>
            <p>
              게임이 끝나면 힌트 사용 단계와 정답 여부를 이모지 블록으로 표현한
              결과 카드를 소셜 미디어에 공유할 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">제작 취지</h2>
            <p>
              바쁜 일상 속에서도 하루 한 번, 짧은 시간에 즐길 수 있는 두뇌
              자극 게임을 만들고 싶었습니다. 한국어와 한국 문화를 소재로, 누구나
              부담 없이 즐길 수 있는 일상의 소소한 재미가 되길 바랍니다.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
