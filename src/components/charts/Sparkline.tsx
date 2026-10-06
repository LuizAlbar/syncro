import React from "react"

export function Sparkline({
  data,
  color = "#315d68",
  width = 80,
  height = 28,
}: {
  data: number[]
  color?: string
  width?: number
  height?: number
}) {
  if (!data || data.length < 2) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / (max - min || 1)) * height
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const area = `M${pts.join("L")} L${width},${height} L0,${height} Z`
  const line = `M${pts.join("L")}`
  const gradId = `sg-${color.replace(/[^a-zA-Z0-9]/g, "")}`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
