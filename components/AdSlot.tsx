'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

interface AdSlotProps {
  /** 광고 유닛 slot ID. 미전달 시 NEXT_PUBLIC_ADSENSE_SLOT_RESULT 사용 */
  slot?: string
  className?: string
}

const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
const defaultSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT

export default function AdSlot({ slot, className }: AdSlotProps) {
  const pushed = useRef(false)
  const resolvedSlot = slot ?? defaultSlot ?? ''

  useEffect(() => {
    if (!client || !resolvedSlot) return
    if (pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense push 에러 무시
    }
  }, [])

  // 광고 유닛이 준비되지 않음(게시자 ID 또는 슬롯 ID 미설정)
  // - 헤드 로더 스크립트(layout)는 client만 있으면 로드되어 사이트 검증/Auto ads에 사용됨
  // - 수동 <ins> 유닛은 client + slot 둘 다 있어야 렌더
  const ready = Boolean(client && resolvedSlot)

  // 미준비 + 프로덕션 → 렌더 안 함
  if (!ready && process.env.NODE_ENV === 'production') {
    return null
  }

  // 미준비 + 개발 → 점선 플레이스홀더
  if (!ready) {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90px',
          border: '1px dashed #444',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.03)',
          color: '#666',
          fontSize: '12px',
          letterSpacing: '0.02em',
        }}
      >
        광고 영역 (AdSense)
      </div>
    )
  }

  // env 있음 → 실제 AdSense 유닛
  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={resolvedSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
