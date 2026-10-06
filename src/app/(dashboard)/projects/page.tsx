"use client"

// New project form state
/* Filtros e Ação */ /* Grid de Projetos */ /* Barra de Progresso */ /* Rodapé do Card */ /* Modal Novo Projeto */ /* Confirm Modal Excluir Projeto */

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { TopBar } from "@/components/layout/TopBar"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { ConfirmModal } from "@/components/ui/ConfirmModal"
import { Clock, Plus, ArrowRight, Trash2, FolderKanban } from "lucide-react"

interface Project {
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

type StatusFilter = "Todos" | "Em Andamento" | "Planejamento" | "Pausado" | "Concluído"

const statusFilters: StatusFilter[] = [
  "Todos",
  "Em Andamento",
  "Planejamento",
  "Pausado",
  "Concluído",
]

const statusColors: Record<string, string> = {
  Planejamento: "#9495a8",
  "Em Andamento": "#315d68",
  Pausado: "#d4914a",
  Concluído: "#4a9d6a",
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter] = useState<StatusFilter>("Todos")
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Trabalho")
  const [status, setStatus] =
    useState<"Planejamento" | "Em Andamento" | "Pausado" | "Concluído">(
      "Em Andamento",
    )
  const [deadline, setDeadline] = useState("30 Nov, 2026")
  const [budget, setBudget] = useState("")
  const [color, setColor] = useState("#315d68")

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        const data = await res.json()
        setProjects(data.projects || [])
      }
    } catch {
      toast.error("Erro ao carregar projetos")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          status,
          deadline,
          budget: budget ? parseFloat(budget) : 0,
          color,
          progress: status === "Concluído" ? 100 : 0,
        }),
      })

      if (!res.ok) throw new Error()

      toast.success("Projeto criado com sucesso!")
      setIsModalOpen(false)
      setTitle("")
      setDescription("")
      setBudget("")
      fetchProjects()
    } catch {
      toast.error("Erro ao criar projeto")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return
    const id = projectToDelete
    setProjectToDelete(null)

    setProjects((prev) => prev.filter((p) => p.id !== id))
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Projeto excluído com sucesso")
      fetchProjects()
    } catch {
      toast.error("Erro ao excluir projeto")
      fetchProjects()
    }
  }

  const visible = projects.filter((p) => {
    if (filter === "Todos") return true
    return p.status === filter
  })

  return (
    <div className="space-y-6">
      <TopBar title="Projetos" onRefresh={fetchProjects} />

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[rgba(4,70,67,0.08)]">
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {statusFilters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                filter === f
                  ? "bg-[#044643] text-white"
                  : "bg-[rgba(4,70,67,0.04)] text-[#5c757a] hover:text-[#032228]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
          className="shrink-0"
        >
          Novo Projeto
        </Button>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((p) => (
          <Card
            key={p.id}
            className="flex flex-col justify-between bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Link
                  href={`/projects/${p.id}`}
                  className="text-base font-bold text-[#032228] group-hover:text-[#044643] transition-colors leading-snug line-clamp-1"
                >
                  {p.title}
                </Link>
                <Badge
                  label={p.status}
                  color={statusColors[p.status] || "#315d68"}
                  textColor={statusColors[p.status] || "#315d68"}
                />
              </div>

              <span className="text-xs text-[#5c757a] font-medium block mb-2">
                {p.category}
              </span>

              {p.description && (
                <p className="text-xs sm:text-sm text-[#5c757a] line-clamp-2 leading-relaxed mb-4">
                  {p.description}
                </p>
              )}

              {}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs text-[#5c757a]">
                  <span>Progresso</span>
                  <span className="font-mono font-bold text-[#032228]">
                    {p.progress}%
                  </span>
                </div>
                <ProgressBar
                  value={p.progress}
                  color={p.progress >= 100 ? "#4a9d6a" : p.color || "#044643"}
                  height={6}
                />
              </div>
            </div>

            {}
            <div className="pt-3 border-t border-[rgba(4,70,67,0.06)] flex items-center justify-between text-xs text-[#5c757a]">
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> {p.deadline}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/projects/${p.id}`}
                  className="flex items-center gap-1 text-[#044643] font-semibold hover:underline"
                >
                  <span>Abrir ({p.tasksCount})</span>
                  <ArrowRight size={13} />
                </Link>

                <button
                  onClick={() => setProjectToDelete(p.id)}
                  className="p-1 text-slate-300 hover:text-red-500 rounded"
                  title="Excluir projeto"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {visible.length === 0 && !isLoading && (
        <div className="py-16 text-center text-[#5c757a] bg-white rounded-2xl border border-[rgba(4,70,67,0.08)]">
          <FolderKanban
            size={36}
            className="mx-auto mb-2 text-[#9495a8] opacity-50"
          />
          <p className="text-sm font-medium">
            Nenhum projeto encontrado nesta categoria.
          </p>
        </div>
      )}

      {}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Projeto"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Título do Projeto"
            placeholder="Ex: Reforma da Casa, Lançamento v1..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-semibold text-[#032228] block mb-1">
              Descrição
            </label>
            <textarea
              rows={3}
              placeholder="Descreva os objetivos principais..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[rgba(4,70,67,0.2)] text-sm text-[#032228] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#032228] block mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 rounded-lg border border-[rgba(4,70,67,0.2)] text-sm text-[#032228] outline-none"
              >
                <option value="Trabalho">Trabalho</option>
                <option value="Finanças">Finanças</option>
                <option value="Saúde">Saúde</option>
                <option value="Estudos">Estudos</option>
                <option value="Pessoal">Pessoal</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#032228] block mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target
                      .value as "Planejamento" | "Em Andamento" | "Pausado" | "Concluído",
                  )
                }
                className="w-full p-2 rounded-lg border border-[rgba(4,70,67,0.2)] text-sm text-[#032228] outline-none"
              >
                <option value="Planejamento">Planejamento</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Pausado">Pausado</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prazo"
              placeholder="Ex: 15 Dez, 2026"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
            <Input
              label="Orçamento ($)"
              type="number"
              placeholder="0.00"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
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
              Salvar Projeto
            </Button>
          </div>
        </form>
      </Modal>

      {}
      <ConfirmModal
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Projeto"
        description="Tem certeza de que deseja excluir este projeto? Todas as tarefas pertencentes a ele também serão excluídas."
      />
    </div>
  )
}
