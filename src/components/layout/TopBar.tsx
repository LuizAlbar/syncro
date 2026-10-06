"use client"

import React, { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { QuickAddModal } from "./QuickAddModal"

interface TopBarProps {
  title: string
  onRefresh?: () => void
}

export function TopBar({ title, onRefresh }: TopBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const now = new Date()
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-[#032228] tracking-tight m-0">
            {title}
          </h1>
          <span className="bg-[rgba(4,70,67,0.06)] border border-[rgba(4,70,67,0.15)] rounded-md px-2.5 py-1 text-xs text-[#044643] font-mono capitalize">
            {dateStr}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={15} />}
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto"
          >
            Adicionar Rápido
          </Button>
        </div>
      </div>

      <QuickAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
      />
    </>
  )
}
