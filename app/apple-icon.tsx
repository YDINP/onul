import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
            gap: "8px",
          }}
        >
          {/* Row 1 */}
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                background: "#6b7280",
                borderRadius: "6px",
              }}
            />
            <div
              style={{
                width: "42px",
                height: "42px",
                background: "#3b82f6",
                borderRadius: "6px",
              }}
            />
            <div
              style={{
                width: "42px",
                height: "42px",
                background: "#6b7280",
                borderRadius: "6px",
              }}
            />
          </div>
          {/* Row 2 */}
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                background: "#3b82f6",
                borderRadius: "6px",
              }}
            />
            <div
              style={{
                width: "42px",
                height: "42px",
                background: "#10b981",
                borderRadius: "6px",
              }}
            />
            <div
              style={{
                width: "42px",
                height: "42px",
                background: "#3b82f6",
                borderRadius: "6px",
              }}
            />
          </div>
          {/* Row 3 */}
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                background: "#6b7280",
                borderRadius: "6px",
              }}
            />
            <div
              style={{
                width: "42px",
                height: "42px",
                background: "#10b981",
                borderRadius: "6px",
              }}
            />
            <div
              style={{
                width: "42px",
                height: "42px",
                background: "#6b7280",
                borderRadius: "6px",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
