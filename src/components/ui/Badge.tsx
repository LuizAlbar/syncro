import React from "react"

export interface BadgeProps {
  label: string
  color?: string
  textColor?: string
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = "#315d68",
  textColor,
  className = "",
}) => {
  const finalTextColor = textColor || color
  return (
    <span
      style={{
        background: `${color}1a`,
        color: finalTextColor,
        border: `1px solid ${color}33`,
        borderRadius: 4,
        padding: "2px 7px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
      className={className}
    >
      {label}
    </span>
  )
}

export const PriorityBadge: React.FC<{ level: "Alta" | "Média" | "Baixa" }> = ({
  level,
}) => {
  const colors: Record<string, string> = {
    Alta: "#e05252",
    Média: "#d4914a",
    Baixa: "#4a9d6a",
  }
  const color = colors[level] || "#315d68"
  return <Badge label={level} color={color} textColor={color} />
}
