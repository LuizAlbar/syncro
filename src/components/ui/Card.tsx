import React from "react"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  className = "",
  ...props
}) => {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(4, 70, 67, 0.08)",
        boxShadow: "0 1px 3px rgba(4, 70, 67, 0.04)",
        borderRadius: 12,
        padding: 20,
        ...style,
      }}
      className={`transition-shadow hover:shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<{
  title: string
  subtitle?: string
  action?: React.ReactNode
}> = ({ title, subtitle, action }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    }}
  >
    <div>
      <h3
        style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#032228" }}
      >
        {title}
      </h3>
      {subtitle && (
        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#5c757a" }}>
          {subtitle}
        </p>
      )}
    </div>
    {action}
  </div>
)
