"use client";

export default function DJLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="djGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1a1a1a", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#404040", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      <rect
        x="8"
        y="8"
        width="84"
        height="84"
        rx="18"
        fill="url(#djGradient)"
      />

      <text
        x="50"
        y="68"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="48"
        fontWeight="800"
        fill="white"
        textAnchor="middle"
        letterSpacing="-2"
      >
        DJ
      </text>

      <circle cx="24" cy="30" r="3" fill="#10b981" opacity="0.8" />
    </svg>
  );
}
