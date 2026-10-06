"use client"

// Task form state

// Transaction form state

// Goal form state

// Project form state
// Reset fields
/* Abas */

import React, { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function QuickAddModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}) {
  const router = useRouter()
  const [tab, setTab] = useState<"task" | "transaction" | "goal" | "project">(
    "task",
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [taskText, setTaskText] = useState("")
  const [taskPriority, setTaskPriority] = useState<"Alta" | "Média" | "Baixa">(
    "Média",
  )
  const [taskDue, setTaskDue] = useState("Hoje")
  const [taskGroup, setTaskGroup] =
    useState<"Hoje" | "Próximos 7 Dias" | "Mais Tarde">("Hoje")
  const [txDesc, setTxDesc] = useState("")
  const [txAmt, setTxAmt] = useState("")
  const [txType, setTxType] = useState<"expense" | "income">("expense")
  const [txCat, setTxCat] = useState("Alimentação")
  const [goalTitle, setGoalTitle] = useState("")
  const [goalTarget, setGoalTarget] = useState("")
  const [goalDeadline, setGoalDeadline] = useState("31 Dez, 2026")
  const [projTitle, setProjTitle] = useState("")
  const [projCategory, setProjCategory] = useState("Trabalho")
  const [projDeadline, setProjDeadline] = useState("30 Nov, 2026")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (tab === "task") {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: taskText,
            priority: taskPriority,
            due: taskDue,
            group: taskGroup,
          }),
        })
        if (!res.ok) throw new Error("Erro ao adicionar tarefa")
        toast.success("Tarefa diária adicionada!")
      } else if (tab === "transaction") {
        const numAmt = Math.abs(parseFloat(txAmt || "0"))
        const finalAmt = txType === "expense" ? -numAmt : numAmt
        const res = await fetch("/api/finance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            desc: txDesc,
            amt: finalAmt,
            cat: txCat,
            date: new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            }),
            account: "Corrente",
            status: "Pago",
          }),
        })
        if (!res.ok) throw new Error("Erro ao criar transação")
        toast.success("Transação registrada!")
      } else if (tab === "goal") {
        const res = await fetch("/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: goalTitle,
            target: parseFloat(goalTarget || "1000"),
            deadline: goalDeadline,
            cat: "Financeira",
            unit: "$",
          }),
        })
        if (!res.ok) throw new Error("Erro ao criar meta")
        toast.success("Meta cadastrada!")
      } else if (tab === "project") {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: projTitle,
            category: projCategory,
            deadline: projDeadline,
          }),
        })
        if (!res.ok) throw new Error("Erro ao criar projeto")
        toast.success("Projeto criado!")
      }

      onClose()
      if (onSuccess) onSuccess()
      router.refresh()
      setTaskText("")
      setTxDesc("")
      setTxAmt("")
      setGoalTitle("")
      setProjTitle("")
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Ocorreu um erro ao salvar"
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Rápido">
      {}
      <div className="flex gap-1 bg-[rgba(4,70,67,0.05)] p-1 rounded-xl mb-4">
        {([
          { id: "task", label: "Tarefa Diária" },
          { id: "transaction", label: "Transação" },
          { id: "goal", label: "Meta" },
          { id: "project", label: "Projeto" },
        ] as const).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
              tab === t.id
                ? "bg-[#044643] text-white shadow-sm"
                : "text-[#5c757a] hover:text-[#032228]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === "task" && (
          <>
            <Input
              label="O que precisa ser feito?"
              placeholder="Ex: Pagar fatura do cartão..."
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
                    setTaskPriority(
                      e.target.value as "Alta" | "Média" | "Baixa",
                    )
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
                  value={taskGroup}
                  onChange={(e) =>
                    setTaskGroup(
                      e.target
                        .value as "Hoje" | "Próximos 7 Dias" | "Mais Tarde",
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
            <Input
              label="Prazo"
              placeholder="Ex: Hoje ou Amanhã"
              value={taskDue}
              onChange={(e) => setTaskDue(e.target.value)}
              required
            />
          </>
        )}

        {tab === "transaction" && (
          <>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTxType("expense")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border ${
                  txType === "expense"
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Despesa (-)
              </button>
              <button
                type="button"
                onClick={() => setTxType("income")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border ${
                  txType === "income"
                    ? "bg-green-50 border-green-300 text-green-600"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Receita (+)
              </button>
            </div>
            <Input
              label="Descrição"
              placeholder="Ex: Supermercado, Salário, Café..."
              value={txDesc}
              onChange={(e) => setTxDesc(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Valor ($)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={txAmt}
                onChange={(e) => setTxAmt(e.target.value)}
                required
              />
              <div>
                <label className="text-xs font-semibold text-[#032228] block mb-1">
                  Categoria
                </label>
                <select
                  value={txCat}
                  onChange={(e) => setTxCat(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[rgba(4,70,67,0.2)] text-sm text-[#032228] outline-none"
                >
                  <option value="Alimentação">Alimentação</option>
                  <option value="Moradia">Moradia</option>
                  <option value="Assinaturas">Assinaturas</option>
                  <option value="Receitas">Receitas</option>
                  <option value="Investimentos">Investimentos</option>
                  <option value="Software">Software</option>
                  <option value="Utilidades">Utilidades</option>
                </select>
              </div>
            </div>
          </>
        )}

        {tab === "goal" && (
          <>
            <Input
              label="Título da Meta"
              placeholder="Ex: Fundo de Viagem..."
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Alvo ($)"
                type="number"
                placeholder="5000"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                required
              />
              <Input
                label="Prazo"
                placeholder="Ex: 31 Dez, 2026"
                value={goalDeadline}
                onChange={(e) => setGoalDeadline(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {tab === "project" && (
          <>
            <Input
              label="Nome do Projeto"
              placeholder="Ex: Redesenho do Produto, Curso..."
              value={projTitle}
              onChange={(e) => setProjTitle(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#032228] block mb-1">
                  Categoria
                </label>
                <select
                  value={projCategory}
                  onChange={(e) => setProjCategory(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[rgba(4,70,67,0.2)] text-sm text-[#032228] outline-none"
                >
                  <option value="Trabalho">Trabalho</option>
                  <option value="Finanças">Finanças</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Estudos">Estudos</option>
                  <option value="Pessoal">Pessoal</option>
                </select>
              </div>
              <Input
                label="Prazo"
                placeholder="Ex: 15 Dez, 2026"
                value={projDeadline}
                onChange={(e) => setProjDeadline(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
