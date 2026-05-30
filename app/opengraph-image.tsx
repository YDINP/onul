import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = '오늘의 한 판 — 한국어 데일리 추리 게임'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// 한글 폰트 로드 — 우선순위:
//  1. 로컬 파일 (public/fonts/NotoSansKR-Bold.woff) — 빌드/배포 모두 안정
//  2. Google Fonts gstatic CDN fetch — 로컬 파일 없을 때 폴백
// 반환값이 null이면 호출부에서 기본 sans-serif 사용 (한글 깨짐 허용 폴백)
export async function loadNotoSansKR(): Promise<ArrayBuffer | null> {
  // 1. 로컬 파일 먼저 시도
  try {
    const localPath = join(process.cwd(), 'public', 'fonts', 'NotoSansKR-Bold.woff')
    const data = await readFile(localPath)
    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
  } catch {
    // 로컬 파일 없음 → CDN 폴백
  }

  // 2. Google Fonts CSS API에서 woff URL 추출
  try {
    const cssRes = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0)' } }
    )
    if (cssRes.ok) {
      const css = await cssRes.text()
      const urlMatch = css.match(/url\((https:\/\/[^)]+\.(?:ttf|woff))\)/)
      if (urlMatch) {
        const fontRes = await fetch(urlMatch[1])
        if (fontRes.ok) return await fontRes.arrayBuffer()
      }
    }
  } catch {
    // CDN도 실패
  }

  return null
}

export default async function Image() {
  const fontData = await loadNotoSansKR()

  const fonts = fontData
    ? [
        {
          name: 'NotoSansKR',
          data: fontData,
          weight: 700 as const,
          style: 'normal' as const,
        },
      ]
    : []

  const fontFamily = fontData ? 'NotoSansKR' : 'sans-serif'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#0d0d0d',
          padding: '64px 72px',
          position: 'relative',
          fontFamily,
        }}
      >
        {/* 배경 그라데이션 — 우측 상단 blue glow */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.06) 55%, transparent 100%)',
          }}
        />
        {/* 배경 그라데이션 — 좌측 하단 green glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '40px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          }}
        />

        {/* 상단 영역 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 배지 — fit-content 대신 고정 padding + inline-flex 대체 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.35)',
              borderRadius: '32px',
              padding: '8px 24px',
              alignSelf: 'flex-start',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '22px',
                color: '#93c5fd',
                fontFamily,
                letterSpacing: '0.02em',
              }}
            >
              데일리 추리 게임
            </span>
          </div>

          {/* 메인 타이틀 */}
          <div
            style={{
              fontSize: '100px',
              fontWeight: 700,
              color: '#f8fafc',
              fontFamily,
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
            }}
          >
            오늘의 한 판
          </div>

          {/* 부제 */}
          <div
            style={{
              fontSize: '34px',
              color: '#94a3b8',
              fontFamily,
              letterSpacing: '0.01em',
              lineHeight: 1.3,
            }}
          >
            하루 한 판, 한국어 추리 게임
          </div>
        </div>

        {/* 하단 영역 — 컬러 블록 모티프 + URL */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* 워들 스타일 컬러 블록 그리드 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* row 1: 회색·회색·파랑·회색·회색 */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {['#374151', '#374151', '#3b82f6', '#374151', '#374151'].map(
                (bg, i) => (
                  <div
                    key={i}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '7px',
                      backgroundColor: bg,
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  />
                )
              )}
            </div>
            {/* row 2: 회색·초록·파랑·초록·회색 */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {['#374151', '#10b981', '#3b82f6', '#10b981', '#374151'].map(
                (bg, i) => (
                  <div
                    key={i}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '7px',
                      backgroundColor: bg,
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  />
                )
              )}
            </div>
            {/* row 3: 초록·파랑·파랑·파랑·초록 */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {['#10b981', '#3b82f6', '#3b82f6', '#3b82f6', '#10b981'].map(
                (bg, i) => (
                  <div
                    key={i}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '7px',
                      backgroundColor: bg,
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  />
                )
              )}
            </div>
          </div>

          {/* 우측 하단: 설명 + URL */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '10px',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#64748b',
                fontFamily,
                letterSpacing: '0.01em',
              }}
            >
              5단계 힌트로 정답을 맞혀보세요
            </div>
            <div
              style={{
                fontSize: '22px',
                color: '#3b82f6',
                fontFamily,
                letterSpacing: '0.05em',
              }}
            >
              onul.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  )
}
