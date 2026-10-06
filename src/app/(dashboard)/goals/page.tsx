"use client"

// New Goal Form State
/* Abas de Filtro e Ação */ /* Grid de Metas */ /* Modal Nova Meta */ /* Confirm Modal Excluir Meta */

import React, { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { TopBar } from "@/components/layout/TopBar"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { ConfirmModal } from "@/components/ui/ConfirmModal"
import { Clock, ChevronDown, Check, Plus, Trash2, Target } from "lucide-react"

interface Milestone {
  label: string
  done: boolean
}

interface Goal {
  id: string
  title: string
  cat: string
  catColor: string
  deadline: string
  current: number
  target: number
  unit: string
  pct: number
  status: "all" | "inprogress" | "financial" | "milestone" | "completed"
  milestones: Milestone[]
}

type GoalFilter = "all" | "inprogress" | "financial" | "milestone" | "completed"

interface FilterOption {
  id: GoalFilter
  label: string
}

const filters: FilterOption[] = [
  { id: "all", label: "Tudo" },
  { id: "inprogress", label: "Em Andamento" },
  { id: "financial", label: "Financeiras" },
  { id: "milestone", label: "Marcos" },
  { id: "completed", label: "Concluídas" },
]

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [filter, setFilter] = useState<GoalFilter>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [cat, setCat] = useState("Financeira")
  const [target, setTarget] = useState("")
  const [current, setCurrent] = useState("0")
  const [unit, setUnit] = useState("$")
  const [deadline, setDeadline] = useState("31 Dez, 2026")
  const [milestonesText, setMilestonesText] = useState("")

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch("/api/goals")
      if (res.ok) {
        const data = await res.json()
        setGoals(data.goals || [])
      }
    } catch {
      toast.error("Erro ao carregar metas")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const toggleMilestone = async (goalId: string, index: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g
        const updatedMs = [...g.milestones]
        if (updatedMs[index]) {
          updatedMs[index] = {
            ...updatedMs[index],
            done: !updatedMs[index].done,
          }
        }
        const doneCount = updatedMs.filter((m) => m.done).length
        const total = updatedMs.length
        const pct =
          g.unit !== "$" && total > 0
            ? Math.round((doneCount / total) * 100)
            : g.pct
        return {
          ...g,
          milestones: updatedMs,
          pct,
          status: pct >= 100 ? "completed" : g.status,
        }
      }),
    )

    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleMilestoneIndex: index }),
      })
      if (!res.ok) throw new Error()
      toast.success("Marco atualizado!")
    } catch {
      toast.error("Erro ao atualizar marco")
      fetchGoals()
    }
  }

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return
    const id = goalToDelete
    setGoalToDelete(null)

    setGoals((prev) => prev.filter((g) => g.id !== id))
    try {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Meta excluída")
    } catch {
      toast.error("Erro ao excluir meta")
      fetchGoals()
    }
  }

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    const msArray = milestonesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((label) => ({ label, done: false }))

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          cat,
          catColor: cat === "Financeira" ? "#315d68" : "#a78bfa",
          target: parseFloat(target || "100"),
          current: parseFloat(current || "0"),
          unit,
          deadline,
          status: cat === "Financeira" ? "financial" : "milestone",
          milestones: msArray,
        }),
      })

      if (!res.ok) throw new Error()

      toast.success("Meta criada com sucesso!")
      setIsModalOpen(false)
      setTitle("")
      setTarget("")
      setCurrent("0")
      setMilestonesText("")
      fetchGoals()
    } catch {
      toast.error("Erro ao criar meta")
    } finally {
      setIsSubmitting(false)
    }
  }

  const visible = goals.filter((g) => {
    if (filter === "all") return true
    if (filter === "inprogress") return g.pct < 100
    if (filter === "completed") return g.pct >= 100
    return g.status === filter
  })

  return (
    <div className="space-y-6">
      <TopBar title="Metas de Vida" onRefresh={fetchGoals} />

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[rgba(4,70,67,0.08)]">
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                filter === f.id
                  ? "bg-[#044643] text-white"
                  : "bg-[rgba(4,70,67,0.04)] text-[#5c757a] hover:text-[#032228]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
          className="shrink-0"
        >
          Nova Meta
        </Button>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((g) => (
          <GoalCardItem
            key={g.id}
            goal={g}
            onToggleMilestone={toggleMilestone}
            onDelete={() => setGoalToDelete(g.id)}
          />
        ))}
      </div>

      {visible.length === 0 && !isLoading && (
        <div className="py-16 text-center text-[#5c757a] bg-white rounded-2xl border border-[rgba(4,70,67,0.08)]">
          <Target
            size={36}
            className="mx-auto mb-2 text-[#9495a8] opacity-50"
          />
          <p className="text-sm font-medium">
            Nenhuma meta encontrada nesta categoria.
          </p>
        </div>
      )}

      {}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Meta"
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <Input
            label="Título da Meta"
            placeholder="Ex: Fundo de Viagem, Comprar Carro..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#032228] block mb-1">
                Categoria
              </label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full p-2 rounded-lg border border-[rgba(4,70,67,0.2)] text-sm text-[#032228] outline-none"
              >
                <option value="Financeira">Financeira</option>
                <option value="Marco">Marco / Conquista</option>
                <option value="Saúde">Saúde & Bem-estar</option>
                <option value="Educação">Educação & Carreira</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#032228] block mb-1">
                Unidade
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2 rounded-lg border border-[rgba(4,70,67,0.2)] text-sm text-[#032228] outline-none"
              >
                <option value="$">Moeda ($)</option>
                <option value="livros">Livros</option>
                <option value="km">Quilômetros (km)</option>
                <option value="horas">Horas</option>
                <option value="marco">Marcos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Progresso Atual"
              type="number"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
            />
            <Input
              label="Alvo Final"
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
            />
          </div>

          <Input
            label="Data Limite"
            placeholder="Ex: 31 Dez, 2026"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-semibold text-[#032228] block mb-1">
              Etapas / Marcos Intermediários (1 por linha)
            </label>
            <textarea
              rows={3}
              placeholder="Ex: 1º aporte realizado&#10;Metade alcançada&#10;Meta final batida"
              value={milestonesText}
              onChange={(e) => setMilestonesText(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[rgba(4,70,67,0.2)] text-sm text-[#032228] outline-none font-sans"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Salvar Meta
            </Button>
          </div>
        </form>
      </Modal>

      {}
      <ConfirmModal
        isOpen={Boolean(goalToDelete)}
        onClose={() => setGoalToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Meta"
        description="Tem certeza de que deseja excluir esta meta?"
      />
    </div>
  )
}

function GoalCardItem({
  goal,
  onToggleMilestone,
  onDelete,
}: {
  goal: Goal
  onToggleMilestone: (goalId: string, index: number) => void
  onDelete: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const isCompleted = goal.pct >= 100
  const milestones = goal.milestones || []
  const completedMilestones = milestones.filter((m) => m.done).length

  return (
    <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all">
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-base font-bold text-[#032228] leading-tight m-0">
            {goal.title}
          </h3>
          <Badge label={goal.cat} color={goal.catColor || "#315d68"} />
        </div>

        <div className="flex justify-between items-center text-xs text-[#5c757a] mb-3">
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> {goal.deadline}
          </span>
          {isCompleted && (
            <Badge label="Concluída" color="#4a9d6a" textColor="#4a9d6a" />
          )}
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5 font-mono">
            <span className="text-[#032228] font-semibold">
              {goal.unit === "$"
                ? `$${goal.current.toLocaleString()}`
                : goal.current}{" "}
              {goal.unit !== "$" ? goal.unit : ""}
            </span>
            <span className="text-[#5c757a]">
              /{" "}
              {goal.unit === "$"
                ? `$${goal.target.toLocaleString()}`
                : `${goal.target} ${goal.unit}`}
            </span>
          </div>
          <ProgressBar
            value={goal.pct}
            color={isCompleted ? "#4a9d6a" : "#044643"}
            height={6}
          />
          <span className="text-xs text-[#5c757a] block mt-1 font-mono">
            {goal.pct}% concluído
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-[rgba(4,70,67,0.06)] space-y-2">
        {milestones.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center justify-between w-full bg-[#f9fafb] border border-[rgba(4,70,67,0.06)] rounded-lg p-2 text-xs text-[#5c757a] hover:text-[#032228]"
            >
              <span>
                Marcos ({completedMilestones}/{milestones.length})
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {expanded && (
              <div className="space-y-1.5 pt-1">
                {milestones.map((m, i) => (
                  <div
                    key={i}
                    onClick={() => onToggleMilestone(goal.id, i)}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-teal-50/40 cursor-pointer text-xs"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        m.done
                          ? "bg-[#4a9d6a] border-[#4a9d6a] text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {m.done && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span
                      className={
                        m.done
                          ? "line-through text-slate-400"
                          : "text-[#032228]"
                      }
                    >
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="flex justify-end pt-1">
          <button
            onClick={onDelete}
            className="p-1 text-slate-300 hover:text-red-500 rounded text-xs flex items-center gap-1"
            title="Excluir meta"
          >
            <Trash2 size={13} />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </Card>
  )
}
