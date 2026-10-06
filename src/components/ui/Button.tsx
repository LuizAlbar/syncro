import React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = "",
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    borderRadius: 8,
    border: "1px solid transparent",
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
    opacity: disabled || isLoading ? 0.65 : 1,
    transition: "all 0.15s ease-in-out",
    textDecoration: "none",
    outline: "none",
  }

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 12px", fontSize: 12 },
    md: { padding: "8px 16px", fontSize: 13 },
    lg: { padding: "11px 22px", fontSize: 14.5 },
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "#044643",
      color: "#ffffff",
      borderColor: "rgba(4, 70, 67, 0.4)",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    secondary: {
      background: "#315d68",
      color: "#ffffff",
      borderColor: "rgba(49, 93, 104, 0.4)",
    },
    outline: {
      background: "transparent",
      color: "#044643",
      borderColor: "rgba(4, 70, 67, 0.2)",
    },
    ghost: {
      background: "transparent",
      color: "#5c757a",
      borderColor: "transparent",
    },
    danger: {
      background: "rgba(224, 82, 82, 0.12)",
      color: "#e05252",
      borderColor: "rgba(224, 82, 82, 0.3)",
    },
  }

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      className={`hover:brightness-110 active:scale-[0.99] ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  )
}
