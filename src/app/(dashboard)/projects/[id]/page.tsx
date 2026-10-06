"use client"

// Task delete state for confirm modal

// New task form fields

// Otimista
/* Navegação Superior / Breadcrumb */ /* Cartão de Cabeçalho do Projeto */ /* Métricas e Progresso */ /* Barra de Visualizações (Todo, Tabela, Kanban) */ /* Renderização Condicional da Visualização */ /* 1. TO-DO LIST VIEW */ /* 2. TABELA VIEW */ /* 3. KANBAN VIEW */ /* Modal Nova Tarefa no Projeto */ /* Reusable Confirm Modal for Deletion */

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card } from "@/components/ui/Card"
import { Badge, PriorityBadge } from "@/components/ui/Badge"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { ConfirmModal } from "@/components/ui/ConfirmModal"
import {
  ArrowLeft,
  ListTodo,
  Table as TableIcon,
  Kanban,
  Plus,
  Clock,
  Check,
  Trash2,
  DollarSign,
  ChevronRight,
} from "lucide-react"

interface ProjectTask {
  id: string
  projectId: string
  text: string
  priority: "Alta" | "Média" | "Baixa"
  done: boolean
  due: string
  goal?: string
  group: "Hoje" | "Próximos 7 Dias" | "Mais Tarde"
  kanban: "todo" | "inprogress" | "done"
  stage: string
}

interface ProjectData {
  id: string
  title: string
  description: string
  category: string
  status: "Planejamento" | "Em Andamento" | "Pausado" | "Concluído"
  progress: number
  deadline: string
  color: string
  budget?: number
  tasksCount: number
  completedTasksCount: number
}

type ViewOption = "todo" | "table" | "kanban"

export default function ProjectProfilePage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params?.id as string

  const [project, setProject] = useState<ProjectData | null>(null)
  const [tasks, setTasks] = useState<ProjectTask[]>([])
  const [activeView, setActiveView] = useState<ViewOption>("todo")
  const [isLoading, setIsLoading] = useState(true)
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [taskText, setTaskText] = useState("")
  const [taskPriority, setTaskPriority] = useState<"Alta" | "Média" | "Baixa">(
    "Média",
  )
  const [taskDue, setTaskDue] = useState("Esta semana")
  const [taskStage, setTaskStage] = useState("Execução")

  const fetchProjectDetails = useCallback(async () => {
    if (!projectId) return
    try {
      const res = await fetch(`/api/projects/${projectId}`)
      if (!res.ok) {
        if (res.status === 404) {
          toast.error("Projeto não encontrado")
          router.push("/projects")
          return
        }
        throw new Error("Erro ao buscar projeto")
      }
      const data = await res.json()
      setProject(data.project)
      setTasks(data.tasks || [])
    } catch {
      toast.error("Falha ao carregar detalhes do projeto")
    } finally {
      setIsLoading(false)
    }
  }, [projectId, router])

  useEffect(() => {
    fetchProjectDetails()
  }, [fetchProjectDetails])

  const handleToggleTask = async (taskId: string, currentDone: boolean) => {
    const newDone = !currentDone
    const newKanban = newDone ? "done" : "inprogress"
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, done: newDone, kanban: newKanban } : t,
      ),
    )

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: newDone, kanban: newKanban }),
      })
      if (!res.ok) throw new Error()
      toast.success(newDone ? "Tarefa concluída!" : "Tarefa reaberta!")
      fetchProjectDetails()
    } catch {
      toast.error("Erro ao atualizar status da tarefa")
      fetchProjectDetails()
    }
  }

  const handleUpdateKanban = async (
    taskId: string,
    newKanban: "todo" | "inprogress" | "done",
  ) => {
    const isDone = newKanban === "done"
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, kanban: newKanban, done: isDone } : t,
      ),
    )

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kanban: newKanban, done: isDone }),
      })
      toast.success("Status atualizado!")
      fetchProjectDetails()
    } catch {
      toast.error("Erro ao atualizar status")
      fetchProjectDetails()
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
      toast.success("Tarefa removida do projeto")
      fetchProjectDetails()
    } catch {
      toast.error("Erro ao excluir tarefa")
      fetchProjectDetails()
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskText.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: taskText,
          priority: taskPriority,
          due: taskDue,
          stage: taskStage,
          projectId,
          kanban: "todo",
          group: "Hoje",
        }),
      })

      if (!res.ok) throw new Error()

      toast.success("Tarefa adicionada ao projeto!")
      setIsNewTaskModalOpen(false)
      setTaskText("")
      fetchProjectDetails()
    } catch {
      toast.error("Erro ao criar tarefa no projeto")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && !project) {
    return (
      <div className="py-20 text-center text-[#5c757a]">
        <div className="inline-block w-8 h-8 border-4 border-[#044643] border-t-transparent rounded-full animate-spin mb-3" />
        <p>Carregando projeto...</p>
      </div>
    )
  }

  if (!project) return null

  const completedCount = tasks.filter((t) => t.done).length
  const progressPct =
    tasks.length > 0
      ? Math.round((completedCount / tasks.length) * 100)
      : project.progress

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center gap-2 text-sm text-[#5c757a]">
        <Link
          href="/projects"
          className="flex items-center gap-1 hover:text-[#044643] transition-colors"
        >
          <ArrowLeft size={16} /> Projetos
        </Link>
        <ChevronRight size={14} />
        <span className="font-semibold text-[#032228]">{project.title}</span>
      </div>

      {}
      <Card className="bg-white border border-[rgba(4,70,67,0.1)] p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[rgba(4,70,67,0.08)]">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-[#032228] tracking-tight m-0">
                {project.title}
              </h1>
              <Badge label={project.category} color="#315d68" />
              <Badge
                label={project.status}
                color={
                  project.status === "Concluído"
                    ? "#4a9d6a"
                    : project.status === "Pausado"
                      ? "#d4914a"
                      : "#315d68"
                }
              />
            </div>
            {project.description && (
              <p className="mt-2 text-sm text-[#5c757a] max-w-2xl">
                {project.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => setIsNewTaskModalOpen(true)}
            >
              Nova Tarefa
            </Button>
          </div>
        </div>

        {}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div>
            <span className="text-xs uppercase text-[#5c757a] font-mono">
              Progresso
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-[#032228] font-mono">
                {progressPct}%
              </span>
              <span className="text-xs text-[#5c757a]">
                ({completedCount}/{tasks.length})
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar value={progressPct} color="#044643" height={6} />
            </div>
          </div>

          <div>
            <span className="text-xs uppercase text-[#5c757a] font-mono">
              Prazo Final
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-sm font-semibold text-[#032228]">
              <Clock size={16} className="text-[#315d68]" />
              <span>{project.deadline}</span>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase text-[#5c757a] font-mono">
              Orçamento
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-sm font-semibold text-[#032228] font-mono">
              <DollarSign size={16} className="text-[#4a9d6a]" />
              <span>
                {project.budget && project.budget > 0
                  ? `$${project.budget.toLocaleString()}`
                  : "Sem orçamento"}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase text-[#5c757a] font-mono">
              Pendências
            </span>
            <div className="mt-1">
              <span className="text-2xl font-bold text-[#e05252] font-mono">
                {tasks.length - completedCount}
              </span>
              <span className="text-xs text-[#5c757a] ml-1.5">restantes</span>
            </div>
          </div>
        </div>
      </Card>

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-[rgba(4,70,67,0.08)]">
        <div className="flex gap-1.5 bg-[rgba(4,70,67,0.04)] p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveView("todo")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeView === "todo"
                ? "bg-[#044643] text-white shadow-sm"
                : "text-[#5c757a] hover:text-[#032228]"
            }`}
          >
            <ListTodo size={15} /> To-Do List
          </button>
          <button
            type="button"
            onClick={() => setActiveView("table")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeView === "table"
                ? "bg-[#044643] text-white shadow-sm"
                : "text-[#5c757a] hover:text-[#032228]"
            }`}
          >
            <TableIcon size={15} /> Tabela
          </button>
          <button
            type="button"
            onClick={() => setActiveView("kanban")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeView === "kanban"
                ? "bg-[#044643] text-white shadow-sm"
                : "text-[#5c757a] hover:text-[#032228]"
            }`}
          >
            <Kanban size={15} /> Kanban
          </button>
        </div>

        <span className="text-xs text-[#5c757a] px-2 font-mono">
          {tasks.length} tarefas cadastradas
        </span>
      </div>

      {}
      {}
      {activeView === "todo" && (
        <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-4 rounded-xl">
          <div className="flex flex-col gap-2.5">
            {tasks.map((t) => (
              <div
                key={t.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  t.done
                    ? "bg-[#f9fafb] border-slate-100 opacity-60"
                    : "bg-white border-[rgba(4,70,67,0.06)] hover:border-[rgba(4,70,67,0.15)] shadow-sm"
                }`}
              >
                <div
                  onClick={() => handleToggleTask(t.id, t.done)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                    t.done
                      ? "bg-[#044643] border-[#044643] text-white"
                      : "border-slate-300 hover:border-[#044643]"
                  }`}
                >
                  {t.done && <Check size={13} strokeWidth={3} />}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium text-[#032228] truncate ${
                      t.done ? "line-through text-slate-400" : ""
                    }`}
                  >
                    {t.text}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge label={t.stage || "Geral"} color="#9495a8" />
                  <PriorityBadge level={t.priority} />
                  <span className="text-xs text-[#5c757a] font-mono hidden sm:inline-flex items-center gap-1">
                    <Clock size={12} /> {t.due}
                  </span>
                  <button
                    onClick={() => setTaskToDelete(t.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                    title="Excluir tarefa"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="py-12 text-center text-[#5c757a]">
                <p className="text-sm">
                  Nenhuma tarefa criada para este projeto ainda.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus size={14} />}
                  onClick={() => setIsNewTaskModalOpen(true)}
                  className="mt-3"
                >
                  Adicionar Primeira Tarefa
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {}
      {activeView === "table" && (
        <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-0 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-[rgba(4,70,67,0.08)] text-[11px] font-mono text-[#5c757a] uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Tarefa</th>
                  <th className="py-3 px-4">Prioridade</th>
                  <th className="py-3 px-4">Etapa</th>
                  <th className="py-3 px-4">Fluxo Kanban</th>
                  <th className="py-3 px-4">Prazo</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(4,70,67,0.06)] text-xs sm:text-sm">
                {tasks.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-teal-50/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => handleToggleTask(t.id, t.done)}
                        className="rounded border-slate-300 text-[#044643] focus:ring-[#044643] cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-[#032228]">
                      <span
                        className={t.done ? "line-through text-slate-400" : ""}
                      >
                        {t.text}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge level={t.priority} />
                    </td>
                    <td className="py-3 px-4">
                      <Badge label={t.stage || "Geral"} color="#315d68" />
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={t.kanban}
                        onChange={(e) =>
                          handleUpdateKanban(
                            t.id,
                            e.target.value as "todo" | "inprogress" | "done",
                          )
                        }
                        className="text-xs bg-[#f9fafb] border border-[rgba(4,70,67,0.15)] rounded px-2 py-1 outline-none text-[#032228]"
                      >
                        <option value="todo">A Fazer</option>
                        <option value="inprogress">Em Andamento</option>
                        <option value="done">Concluído</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[#5c757a]">
                      {t.due}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setTaskToDelete(t.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-[#5c757a]"
                    >
                      Nenhuma tarefa encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {}
      {activeView === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([
            { id: "todo", title: "A Fazer", color: "#9495a8" },
            { id: "inprogress", title: "Em Andamento", color: "#d4914a" },
            { id: "done", title: "Concluído", color: "#4a9d6a" },
          ] as const).map((col) => {
            const colTasks = tasks.filter((t) => t.kanban === col.id)
            return (
              <div
                key={col.id}
                className="bg-[#f9fafb] border border-[rgba(4,70,67,0.06)] rounded-xl p-3 flex flex-col gap-3 min-h-[340px]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(4,70,67,0.06)]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: col.color }}
                    />
                    <span className="text-xs font-bold text-[#032228] font-mono uppercase tracking-wider">
                      {col.title}
                    </span>
                  </div>
                  <span className="bg-[rgba(4,70,67,0.08)] text-[#5c757a] text-xs px-2 py-0.5 rounded-full font-mono">
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 flex-1">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white border border-[rgba(4,70,67,0.08)] rounded-lg p-3 shadow-sm hover:shadow transition-shadow"
                    >
                      <p className="text-sm font-medium text-[#032228] mb-2">
                        {t.text}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <PriorityBadge level={t.priority} />
                        <Badge label={t.stage || "Geral"} color="#315d68" />
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#5c757a] pt-2 border-t border-[rgba(4,70,67,0.04)]">
                        <span className="font-mono flex items-center gap-1">
                          <Clock size={11} /> {t.due}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleUpdateKanban(
                                t.id,
                                col.id === "todo"
                                  ? "inprogress"
                                  : col.id === "inprogress"
                                    ? "done"
                                    : "todo",
                              )
                            }
                            className="text-xs px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                            title="Mover para próxima etapa"
                          >
                            Avançar →
                          </button>
                          <button
                            onClick={() => setTaskToDelete(t.id)}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-xs text-[#9495a8] italic">
                      Nenhuma tarefa nesta coluna
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {}
      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        title={`Adicionar Tarefa — ${project.title}`}
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Descrição da Tarefa"
            placeholder="Ex: Definir arquitetura de dados..."
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#032228] block mb-1">
                Prioridade
              </label>
              <select
                value={taskPriority}
                onChange={(e) =>
                  setTaskPriority(e.target.value as "Alta" | "Média" | "Baixa")
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
                Etapa do Projeto
              </label>
              <select
                value={taskStage}
                onChange={(e) => setTaskStage(e.target.value)}
                className="w-full p-2 rounded-lg border border-[rgba(4,70,67,0.2)] text-sm text-[#032228] outline-none"
              >
                <option value="Planejamento">Planejamento</option>
                <option value="Execução">Execução</option>
                <option value="Revisão">Revisão / QA</option>
                <option value="Entrega">Entrega Final</option>
              </select>
            </div>
          </div>

          <Input
            label="Prazo de Conclusão"
            placeholder="Ex: 25 Out ou Sexta-feira"
            value={taskDue}
            onChange={(e) => setTaskDue(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsNewTaskModalOpen(false)}
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
        title="Excluir Tarefa do Projeto"
        description="Tem certeza de que deseja remover esta tarefa deste projeto? O progresso do projeto será recalculado."
      />
    </div>
  )
}
