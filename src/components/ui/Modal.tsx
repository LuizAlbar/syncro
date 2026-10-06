import React, { useEffect } from "react"
import { X } from "lucide-react"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: number
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 480,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(3, 34, 40, 0.75)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth,
          background: "#ffffff",
          borderRadius: 14,
          boxShadow: "0 20px 40px rgba(3, 34, 40, 0.3)",
          border: "1px solid rgba(4, 70, 67, 0.15)",
          overflow: "hidden",
          animation: "scaleIn 0.2s ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(4, 70, 67, 0.08)",
            background: "#f9fafb",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#032228",
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#5c757a",
              cursor: "pointer",
              padding: 4,
              borderRadius: 6,
              display: "flex",
            }}
            className="hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  )
}
