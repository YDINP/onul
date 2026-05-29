# 오늘의 한 판 (ONUL)

한국어 네이티브 **데일리 추리 게임**. 하루 한 판, 적은 힌트로 맞히고, 결과를 자랑하며 친구를 소환한다.

## 게임 방식
- 매일 KST 자정에 새 퍼즐 1판이 열린다.
- 5단계 힌트가 점점 구체화된다. **적은 힌트로 맞힐수록 고득점**(1힌트=100점).
- 오답이면 다음 힌트가 열린다. 5힌트 후에도 못 맞히면 종료.
- 클리어하면 "정답률 / 평균 힌트 / 상위 %" 사회적 비교 통계와 공유 그리드가 나온다.

## 요일별 모드
| 요일 | 모드 |
|---|---|
| 월 사자성어 · 화 속담 · 수 레트로(90~00년대) · 목 한자어 · 금 인물 · 토 상식반전 · 일 종합 |

## 기술 스택
- **Next.js 16** (App Router) + TypeScript + Tailwind v4
- **Supabase** — 익명 플레이 집계 + 사회적 비교 통계 RPC (런타임 LLM 비용 0)
- **Vitest** — 엔진/데일리/콘텐츠 검수 단위 테스트 110개

## 구조
```
app/            화면(클라이언트 컴포넌트)
components/      UI 컴포넌트 (ModeConfig, GameHeader, HintArea, ResultCard ...)
lib/engine/      퍼즐 엔진 (순수 함수 + 테스트)
lib/daily/       KST 날짜/요일모드/스트릭 (순수 함수 + 테스트)
lib/stats.ts     Supabase 플레이 기록 + 통계 조회
content/puzzles/ 모드별 퍼즐 데이터 + 자동 검수 게이트(validation.test.ts)
```

## 개발
```bash
npm install
npm run dev      # http://localhost:3000
npm test         # vitest 110개
npm run build
```

## 환경변수
`.env.local` (커밋 금지, `.env.local.example` 참고):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
