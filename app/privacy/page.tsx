import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 — 오늘의 한 판",
  description: "오늘의 한 판 서비스의 개인정보처리방침입니다.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white px-4 py-8">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-white/50 hover:text-white/80 transition-colors text-sm mb-8"
        >
          ← 오늘의 한 판
        </Link>

        <h1 className="text-2xl font-bold mb-2">개인정보처리방침</h1>
        <p className="text-white/40 text-sm mb-8">최종 수정일: 2026년 5월 30일</p>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              1. 수집하는 정보
            </h2>
            <p className="mb-3">
              오늘의 한 판은 서비스 개선을 위해 다음과 같은 정보를 수집할 수
              있습니다.
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong className="text-white">로컬 플레이 기록:</strong> 오늘의
                게임 결과, 힌트 사용 횟수, 연속 플레이 기록 등은 사용자의 기기
                내 localStorage에만 저장되며 서버로 전송되지 않습니다.
              </li>
              <li>
                <strong className="text-white">익명 통계:</strong> 서비스 품질
                향상을 위해 개인을 특정할 수 없는 집계 데이터(총 플레이 수,
                정답률 등)를 수집할 수 있습니다.
              </li>
              <li>
                <strong className="text-white">기기 정보:</strong> 브라우저
                종류, 운영체제 등 기술적 정보가 자동으로 수집될 수 있습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              2. 제3자 서비스
            </h2>
            <p className="mb-3">
              본 서비스는 다음 제3자 서비스를 사용합니다.
            </p>
            <ul className="space-y-3 list-disc list-inside">
              <li>
                <strong className="text-white">Google AdSense:</strong> 광고
                게재를 위해 Google의 광고 서비스를 사용합니다. Google은 광고
                맞춤화를 위해 쿠키를 사용할 수 있습니다. Google의 개인정보
                처리방침은{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  policies.google.com/privacy
                </a>
                에서 확인하실 수 있습니다.
              </li>
              <li>
                <strong className="text-white">Supabase:</strong> 서비스 운영에
                필요한 데이터 저장을 위해 Supabase를 사용합니다. 저장되는
                데이터는 익명화된 게임 통계이며, 개인을 식별하는 정보는
                포함되지 않습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              3. 쿠키 사용
            </h2>
            <p>
              본 서비스는 게임 상태 유지 및 광고 서비스 제공을 위해 쿠키를
              사용할 수 있습니다. 브라우저 설정에서 쿠키를 비활성화할 수
              있으나, 일부 기능이 정상적으로 작동하지 않을 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              4. 정보의 보유 및 삭제
            </h2>
            <p>
              localStorage에 저장된 게임 기록은 사용자가 브라우저 데이터를
              삭제하거나 직접 초기화할 때까지 기기에 유지됩니다. 서버에 저장된
              익명 통계는 서비스 종료 시 함께 삭제됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              5. 미성년자 보호
            </h2>
            <p>
              본 서비스는 만 14세 미만 아동으로부터 의도적으로 개인정보를
              수집하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              6. 방침 변경
            </h2>
            <p>
              개인정보처리방침이 변경될 경우 본 페이지를 통해 공지합니다.
              중요한 변경 사항이 있을 경우 서비스 내 안내를 통해 별도로
              알려드립니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. 문의</h2>
            <p>
              개인정보 처리에 관한 문의사항은 아래 이메일로 연락주시기 바랍니다.
            </p>
            <p className="mt-2">
              <a
                href="mailto:tinycell001@gmail.com"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                tinycell001@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
