import React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  className = "",
  style,
  ...props
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        width: "100%",
      }}
    >
      {label && (
        <label
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#032228",
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#ffffff",
          border: error
            ? "1.5px solid #e05252"
            : "1px solid rgba(4, 70, 67, 0.2)",
          borderRadius: 8,
          padding: "8px 12px",
          transition: "border-color 0.15s ease",
        }}
        className="focus-within:border-[#044643] focus-within:ring-1 focus-within:ring-[#044643]"
      >
        {leftIcon && (
          <span style={{ color: "#5c757a", display: "flex", flexShrink: 0 }}>
            {leftIcon}
          </span>
        )}
        <input
          style={{
            background: "none",
            border: "none",
            outline: "none",
            color: "#032228",
            fontSize: 13,
            width: "100%",
            fontFamily: "'Inter', sans-serif",
            ...style,
          }}
          className={className}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: 11, color: "#e05252" }}>{error}</span>}
    </div>
  )
}
