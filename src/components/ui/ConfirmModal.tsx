import React from "react"
import { Modal } from "./Modal"
import { Button } from "./Button"
import { AlertTriangle } from "lucide-react"

export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  variant?: "danger" | "primary"
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar ação",
  description = "Tem certeza de que deseja realizar esta ação? Esta operação não pode ser desfeita.",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isLoading = false,
  variant = "danger",
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth={420}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              padding: 10,
              borderRadius: "50%",
              background:
                variant === "danger"
                  ? "rgba(224, 82, 82, 0.12)"
                  : "rgba(4, 70, 67, 0.12)",
              color: variant === "danger" ? "#e05252" : "#044643",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13.5,
              color: "#5c757a",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 8,
          }}
        >
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm()
            }}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
