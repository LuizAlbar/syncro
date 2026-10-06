import React from "react"

export function AreaChart({
  income,
  expenses,
}: {
  income: number[]
  expenses: number[]
}) {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"]
  const w = 100,
    h = 100
  const maxVal = Math.max(...income, ...expenses, 1)

  const toPath = (data: number[], fill: boolean) => {
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - (v / maxVal) * (h - 10)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    const line = `M${pts.join(" L")}`
    if (!fill) return line
    return `${line} L${w},${h} L0,${h} Z`
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height={160}
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="income-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#315d68" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#315d68" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="exp-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9495a8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#9495a8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={toPath(expenses, true)} fill="url(#exp-grad)" />
        <path d={toPath(income, true)} fill="url(#income-grad)" />
        <path
          d={toPath(expenses, false)}
          fill="none"
          stroke="#9495a8"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d={toPath(income, false)}
          fill="none"
          stroke="#315d68"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
        }}
      >
        {months.map((m) => (
          <span
            key={m}
            style={{
              fontSize: 10,
              color: "#5c757a",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {m}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 12,
              height: 2,
              background: "#315d68",
              borderRadius: 1,
            }}
          />
          <span style={{ fontSize: 11, color: "#5c757a" }}>Receitas</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 12,
              height: 2,
              background: "#9495a8",
              borderRadius: 1,
            }}
          />
          <span style={{ fontSize: 11, color: "#5c757a" }}>Despesas</span>
        </div>
      </div>
    </div>
  )
}
