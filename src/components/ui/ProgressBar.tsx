import React from "react"

export const ProgressBar: React.FC<{
  value: number
  color?: string
  height?: number
  className?: string
}> = ({ value, color = "#315d68", height = 6, className = "" }) => {
  const safeVal = Math.max(0, Math.min(100, isNaN(value) ? 0 : value))
  return (
    <div
      style={{
        height,
        background: "rgba(4, 70, 67, 0.08)",
        borderRadius: height / 2,
        overflow: "hidden",
      }}
      className={className}
    >
      <div
        style={{
          width: `${safeVal}%`,
          height: "100%",
          background: color,
          borderRadius: height / 2,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  )
}

export const CircularProgress: React.FC<{
  value: number
  size?: number
  stroke?: number
  color?: string
}> = ({ value, size = 64, stroke = 5, color = "#315d68" }) => {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const safeVal = Math.max(0, Math.min(100, isNaN(value) ? 0 : value))
  const offset = circ - (safeVal / 100) * circ

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(4, 70, 67, 0.08)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  )
}
