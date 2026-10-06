"use client"

// New task form state
/* Barra de controle */ /* Visualização Lista */
/* Visualização Kanban */ /* Modal Nova Tarefa Diária */ /* Confirm Modal Excluir Tarefa */

import React, { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { TopBar } from "@/components/layout/TopBar"
import { PriorityBadge, Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { ConfirmModal } from "@/components/ui/ConfirmModal"
import {
  List,
  Kanban,
  Clock,
  Check,
  Plus,
  Trash2,
  CheckSquare,
} from "lucide-react"

interface TaskItem {
  id: string
  text: string
  priority: "Alta" | "Média" | "Baixa"
  done: boolean
  due: string
  goal?: string
  group: "Hoje" | "Próximos 7 Dias" | "Mais Tarde"
  kanban: "todo" | "inprogress" | "done"
}

type TaskView = "list" | "kanban"

const groups: ("Hoje" | "Próximos 7 Dias" | "Mais Tarde")[] = [
  "Hoje",
  "Próximos 7 Dias",
  "Mais Tarde",
]

const kanbanCols = [
  { id: "todo", label: "A Fazer", color: "#9495a8" },
  { id: "inprogress", label: "Em Andamento", color: "#d4914a" },
  { id: "done", label: "Concluído", color: "#4a9d6a" },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [viewMode, setViewMode] = useState<TaskView>("list")
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [priority, setPriority] = useState<"Alta" | "Média" | "Baixa">("Média")
  const [due, setDue] = useState("Hoje")
  const [goal, setGoal] = useState("")
  const [group, setGroup] = useState<"Hoje" | "Próximos 7 Dias" | "Mais Tarde">(
    "Hoje",
  )

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks")
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || [])
      }
    } catch {
      toast.error("Erro ao buscar tarefas diárias")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const toggleTask = async (id: string, currentDone: boolean) => {
    const newDone = !currentDone
    const newKanban = newDone ? "done" : "todo"

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: newDone, kanban: newKanban } : t,
      ),
    )

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: newDone, kanban: newKanban }),
      })
      if (!res.ok) throw new Error()
      toast.success(newDone ? "Tarefa concluída!" : "Tarefa reaberta")
    } catch {
      toast.error("Erro ao atualizar tarefa")
      fetchTasks()
    }
  }

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return
    const id = taskToDelete
    setTaskToDelete(null)

    setTasks((prev) => prev.filter((t) => t.id !== id))
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Tarefa excluída")
    } catch {
      toast.error("Erro ao excluir tarefa")
      fetchTasks()
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          priority,
          due,
          goal,
          group,
          kanban: "todo",
        }),
      })

      if (!res.ok) throw new Error()

      toast.success("Tarefa criada!")
      setIsModalOpen(false)
      setText("")
      setGoal("")
      setDue("Hoje")
      fetchTasks()
    } catch {
      toast.error("Erro ao criar tarefa")
    } finally {
      setIsSubmitting(false)
    }
  }

  const remainingCount = tasks.filter((t) => !t.done).length
  const doneCount = tasks.filter((t) => t.done).length

  return (
    <div className="space-y-6">
      <TopBar title="Tarefas Diárias" onRefresh={fetchTasks} />

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[rgba(4,70,67,0.08)]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-[rgba(4,70,67,0.04)] p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                viewMode === "list"
                  ? "bg-[#044643] text-white"
                  : "text-[#5c757a] hover:text-[#032228]"
              }`}
            >
              <List size={15} /> Lista
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                viewMode === "kanban"
                  ? "bg-[#044643] text-white"
                  : "text-[#5c757a] hover:text-[#032228]"
              }`}
            >
              <Kanban size={15} /> Kanban
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#5c757a] font-mono">
            <span>{remainingCount} pendentes</span>
            <span className="opacity-40">·</span>
            <span className="text-[#4a9d6a]">{doneCount} concluídas</span>
          </div>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
          className="shrink-0"
        >
          Nova Tarefa Diária
        </Button>
      </div>

      {}
      {viewMode === "list" ? (
        <div className="space-y-6">
          {groups.map((g) => {
            const groupTasks = tasks.filter((t) => t.group === g)
            return (
              <div key={g} className="space-y-2">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-xs font-bold text-[#5c757a] tracking-wider uppercase font-mono">
                    {g}
                  </span>
                  <span className="bg-[rgba(4,70,67,0.08)] text-[#5c757a] text-xs px-2 py-0.5 rounded-full font-mono">
                    {groupTasks.length}
                  </span>
                  <div className="flex-1 h-[1px] bg-[rgba(4,70,67,0.08)]" />
                </div>

                <div className="space-y-2">
                  {groupTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border bg-white transition-all shadow-sm ${
                        t.done
                          ? "opacity-60 bg-slate-50 border-slate-100"
                          : "border-[rgba(4,70,67,0.06)] hover:border-[rgba(4,70,67,0.15)]"
                      }`}
                    >
                      <div
                        onClick={() => toggleTask(t.id, t.done)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                          t.done
                            ? "bg-[#044643] border-[#044643] text-white"
                            : "border-slate-300 hover:border-[#044643]"
                        }`}
                      >
                        {t.done && <Check size={13} strokeWidth={3} />}
                      </div>

                      <span
                        onClick={() => toggleTask(t.id, t.done)}
                        className={`flex-1 text-sm font-medium text-[#032228] cursor-pointer ${
                          t.done ? "line-through text-slate-400" : ""
                        }`}
                      >
                        {t.text}
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        <PriorityBadge level={t.priority} />
                        {t.goal && <Badge label={t.goal} color="#315d68" />}
                        <span className="text-xs text-[#5c757a] font-mono hidden sm:inline-flex items-center gap-1">
                          <Clock size={12} /> {t.due}
                        </span>
                        <button
                          onClick={() => setTaskToDelete(t.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 rounded hover:bg-red-50"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {groupTasks.length === 0 && (
                    <p className="text-xs text-[#9495a8] italic py-2 px-1">
                      Nenhuma tarefa neste bloco.
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kanbanCols.map((col) => {
            const colTasks = tasks.filter((t) => t.kanban === col.id)
            return (
              <div
                key={col.id}
                className="bg-[#f9fafb] border border-[rgba(4,70,67,0.06)] rounded-xl p-3 flex flex-col gap-3 min-h-[300px]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(4,70,67,0.06)]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: col.color }}
                    />
                    <span className="text-xs font-bold text-[#032228] font-mono uppercase tracking-wider">
                      {col.label}
                    </span>
                  </div>
                  <span className="bg-[rgba(4,70,67,0.08)] text-[#5c757a] text-xs px-2 py-0.5 rounded-full font-mono">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white border border-[rgba(4,70,67,0.08)] rounded-lg p-3 shadow-sm space-y-2"
                    >
                      <p className="text-sm font-medium text-[#032228]">
                        {t.text}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <PriorityBadge level={t.priority} />
                        {t.goal && <Badge label={t.goal} color="#315d68" />}
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#5c757a] pt-2 border-t border-[rgba(4,70,67,0.04)]">
                        <span className="font-mono flex items-center gap-1">
                          <Clock size={11} /> {t.due}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleTask(t.id, t.done)}
                            className="text-xs px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                          >
                            {t.done ? "Reabrir" : "Concluir"}
                          </button>
                          <button
                            onClick={() => setTaskToDelete(t.id)}
                            className="text-slate-300 hover:text-red-500 p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="h-28 flex items-center justify-center text-xs text-[#9495a8] italic">
                      Nenhuma tarefa
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tasks.length === 0 && !isLoading && (
        <div className="py-16 text-center text-[#5c757a] bg-white rounded-2xl border border-[rgba(4,70,67,0.08)]">
          <CheckSquare
            size={36}
            className="mx-auto mb-2 text-[#9495a8] opacity-50"
          />
          <p className="text-sm font-medium">
            Tudo limpo! Nenhuma tarefa diária pendente.
          </p>
        </div>
      )}

      {}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Tarefa Diária"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="O que você precisa fazer?"
            placeholder="Ex: Comprar suplemento, Responder e-mails..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#032228] block mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "Alta" | "Média" | "Baixa")
                }
                className="w-full p-2 rounded-lg border border-[rgba(4,70,67,0.2)] text-sm text-[#032228] outline-none"
              >
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#032228] block mb-1">
                Agrupamento
              </label>
              <select
                value={group}
                onChange={(e) =>
                  setGroup(
                    e.target.value as "Hoje" | "Próximos 7 Dias" | "Mais Tarde",
                  )
                }
                className="w-full p-2 rounded-lg border border-[rgba(4,70,67,0.2)] text-sm text-[#032228] outline-none"
              >
                <option value="Hoje">Hoje</option>
                <option value="Próximos 7 Dias">Próximos 7 Dias</option>
                <option value="Mais Tarde">Mais Tarde</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prazo"
              placeholder="Ex: Hoje ou Amanhã"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              required
            />
            <Input
              label="Tag / Categoria"
              placeholder="Ex: Pessoal, Rotina..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
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
              Salvar Tarefa
            </Button>
          </div>
        </form>
      </Modal>

      {}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Tarefa"
        description="Tem certeza de que deseja excluir esta tarefa diária?"
      />
    </div>
  )
}
