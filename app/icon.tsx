import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #f97316, #7c2d12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
          <path
            d="M11 15.5 C8 14.5 4.5 14 2 14 L2 3 C4.5 3 8 3.5 11 4.5 Z"
            fill="rgba(255,255,255,0.95)"
          />
          <path
            d="M11 15.5 C14 14.5 17.5 14 20 14 L20 3 C17.5 3 14 3.5 11 4.5 Z"
            fill="rgba(255,255,255,0.75)"
          />
          <line
            x1="11"
            y1="4.5"
            x2="11"
            y2="15.5"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
          />
          <line
            x1="3.5"
            y1="7"
            x2="9.5"
            y2="7.5"
            stroke="rgba(255,220,180,0.7)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="3.5"
            y1="9.5"
            x2="9.5"
            y2="10"
            stroke="rgba(255,220,180,0.7)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="3.5"
            y1="12"
            x2="8"
            y2="12.4"
            stroke="rgba(255,220,180,0.7)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="12.5"
            y1="7.5"
            x2="18.5"
            y2="7"
            stroke="rgba(255,200,160,0.6)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="12.5"
            y1="10"
            x2="18.5"
            y2="9.5"
            stroke="rgba(255,200,160,0.6)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="12.5"
            y1="12.4"
            x2="17"
            y2="12"
            stroke="rgba(255,200,160,0.6)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
