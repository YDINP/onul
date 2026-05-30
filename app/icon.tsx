import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0d0d0d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 3×3 워들식 컬러 블록 그리드 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Row 1 */}
          <div style={{ display: "flex", gap: "24px" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "#6b7280",
                borderRadius: "16px",
              }}
            />
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "#3b82f6",
                borderRadius: "16px",
              }}
            />
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "#6b7280",
                borderRadius: "16px",
              }}
            />
          </div>
          {/* Row 2 */}
          <div style={{ display: "flex", gap: "24px" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "#3b82f6",
                borderRadius: "16px",
              }}
            />
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "#10b981",
                borderRadius: "16px",
              }}
            />
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "#3b82f6",
                borderRadius: "16px",
              }}
            />
          </div>
          {/* Row 3 */}
          <div style={{ display: "flex", gap: "24px" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "#6b7280",
                borderRadius: "16px",
              }}
            />
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "#10b981",
                borderRadius: "16px",
              }}
            />
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "#6b7280",
                borderRadius: "16px",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
