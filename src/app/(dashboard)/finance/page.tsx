"use client"

// Modules State

// New Module Form

// New Expense Item Form

// Transactions State

// New Transaction Form State

// Fetch Modules Data
// Se houver módulo aberto no modal de detalhes, atualiza-o

// Fetch Accounts & Transactions

// Criar Módulo

// Excluir Módulo

// Adicionar gasto dentro de um módulo

// Criar Transação Geral
/* Alternância de Abas: Módulos de Custos vs Contas & Extrato */ /* Seletor do Mês de Análise */ /* ========================================================
          ABA 1: MÓDULOS DE CUSTOS (Moto, Academia, Feira, etc.)
         ======================================================== */ /* Cartões Resumo dos Módulos */ /* Grid de Módulos (Moto, Academia, Feira, Energia...) */ /* Total gasto no mês */ /* Diferença mês a mês */ /* Resumo de lançamentos */ /* Botões do Módulo */ /* ========================================================
          ABA 2: CONTAS & EXTRATO GERAL DE TRANSAÇÕES
         ======================================================== */ /* Cartões de Contas Bancárias */ /* Barra de Busca e Filtros */ /* Tabela de Transações Geral */ /* ========================================================
          MODAL DETALHES DO MÓDULO (Lançamentos e Itens)
         ======================================================== */ /* Lista dos Gastos Catalogados */ /* ========================================================
          MODAL ADICIONAR GASTO DENTRO DO MÓDULO
         ======================================================== */ /* ========================================================
          MODAL NOVO MÓDULO DE CUSTOS (Moto, Academia, etc.)
         ======================================================== */ /* ========================================================
          MODAL NOVA TRANSAÇÃO GERAL
         ======================================================== */ /* Reusable Confirm Modal para Excluir Módulo */

import React, { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { TopBar } from "@/components/layout/TopBar"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { ConfirmModal } from "@/components/ui/ConfirmModal"
import { Badge } from "@/components/ui/Badge"
import {
  Search,
  Filter,
  Plus,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  Calendar,
  Wallet,
  Receipt,
  Layers,
  ArrowRight,
  Trash2,
} from "lucide-react"

interface Account {
  id: string
  label: string
  amount: number
  change: string
  bank: string
  color: string
}

interface Transaction {
  id: string
  date: string
  desc: string
  cat: string
  account: string
  amt: number
  status: "Pago" | "Pendente"
}

interface ModuleItem {
  id: string
  title: string
  amount: number
  date: string
  quantity: number
  notes?: string
}

interface FinanceModuleData {
  id: string
  name: string
  category: string
  color: string
  budget: number
  description?: string
  currentMonthTotal: number
  prevMonthTotal: number
  diffValue: number
  diffPct: number
  entriesCount: number
  items: ModuleItem[]
}

const availableMonths = [
  { id: "2026-10", label: "Outubro 2026 (Atual)" },
  { id: "2026-09", label: "Setembro 2026" },
  { id: "2026-08", label: "Agosto 2026" },
]

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<"modules" | "transactions">(
    "modules",
  )
  const [selectedMonth, setSelectedMonth] = useState("2026-10")
  const [modules, setModules] = useState<FinanceModuleData[]>([])
  const [selectedModuleForDetails, setSelectedModuleForDetails] =
    useState<FinanceModuleData | null>(null)
  const [isNewModuleModalOpen, setIsNewModuleModalOpen] = useState(false)
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
  const [isSubmittingModule, setIsSubmittingModule] = useState(false)
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null)
  const [modName, setModName] = useState("")
  const [modCategory, setModCategory] = useState("Transporte")
  const [modBudget, setModBudget] = useState("")
  const [modColor, setModColor] = useState("#315d68")
  const [modDescription, setModDescription] = useState("")
  const [itemTitle, setItemTitle] = useState("")
  const [itemAmount, setItemAmount] = useState("")
  const [itemQuantity, setItemQuantity] = useState("1")
  const [itemNotes, setItemNotes] = useState("")
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCat, setSelectedCat] = useState("Tudo")
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false)
  const [isSubmittingTx, setIsSubmittingTx] = useState(false)
  const [desc, setDesc] = useState("")
  const [amt, setAmt] = useState("")
  const [cat, setCat] = useState("Alimentação")
  const [account, setAccount] = useState("Corrente")
  const [type, setType] = useState<"expense" | "income">("expense")
  const fetchModules = useCallback(async () => {
    try {
      const res = await fetch(`/api/finance/modules?month=${selectedMonth}`)
      if (res.ok) {
        const data = await res.json()
        setModules(data.modules || [])
        if (selectedModuleForDetails) {
          const updated = (data.modules as FinanceModuleData[]).find(
            (m) => m.id === selectedModuleForDetails.id,
          )
          if (updated) setSelectedModuleForDetails(updated)
        }
      }
    } catch {
      toast.error("Erro ao carregar módulos de gastos")
    }
  }, [selectedMonth, selectedModuleForDetails])
  const fetchFinanceData = useCallback(async () => {
    try {
      const res = await fetch("/api/finance")
      if (res.ok) {
        const data = await res.json()
        setAccounts(data.accounts || [])
        setTransactions(data.transactions || [])
      }
    } catch {
      toast.error("Erro ao carregar extrato financeiro")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchModules()
    fetchFinanceData()
  }, [fetchModules, fetchFinanceData])
  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!modName.trim()) return

    setIsSubmittingModule(true)
    try {
      const res = await fetch("/api/finance/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: modName,
          category: modCategory,
          color: modColor,
          budget: modBudget ? parseFloat(modBudget) : 0,
          description: modDescription,
        }),
      })

      if (!res.ok) throw new Error()

      toast.success(`Módulo "${modName}" criado com sucesso!`)
      setIsNewModuleModalOpen(false)
      setModName("")
      setModBudget("")
      setModDescription("")
      fetchModules()
    } catch {
      toast.error("Erro ao criar módulo financeiro")
    } finally {
      setIsSubmittingModule(false)
    }
  }
  const handleConfirmDeleteModule = async () => {
    if (!moduleToDelete) return
    const id = moduleToDelete
    setModuleToDelete(null)

    setModules((prev) => prev.filter((m) => m.id !== id))
    if (selectedModuleForDetails?.id === id) {
      setSelectedModuleForDetails(null)
    }

    try {
      const res = await fetch(`/api/finance/modules/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      toast.success("Módulo financeiro excluído")
      fetchModules()
      fetchFinanceData()
    } catch {
      toast.error("Erro ao excluir módulo")
      fetchModules()
    }
  }
  const handleAddModuleExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedModuleForDetails || !itemTitle.trim() || !itemAmount) return

    try {
      const res = await fetch(
        `/api/finance/modules/${selectedModuleForDetails.id}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: itemTitle,
            amount: parseFloat(itemAmount),
            quantity: itemQuantity ? parseInt(itemQuantity, 10) : 1,
            monthYear: selectedMonth,
            notes: itemNotes,
          }),
        },
      )

      if (!res.ok) throw new Error()

      toast.success(`Gasto adicionado em "${selectedModuleForDetails.name}"!`)
      setIsAddItemModalOpen(false)
      setItemTitle("")
      setItemAmount("")
      setItemQuantity("1")
      setItemNotes("")
      fetchModules()
      fetchFinanceData()
    } catch {
      toast.error("Erro ao salvar lançamento no módulo")
    }
  }
  const handleCreateTx = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!desc.trim() || !amt) return

    setIsSubmittingTx(true)
    const numericAmt = Math.abs(parseFloat(amt))
    const finalAmt = type === "expense" ? -numericAmt : numericAmt
    const today = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    })

    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          desc,
          amt: finalAmt,
          cat,
          account,
          date: today,
          status: "Pago",
        }),
      })

      if (!res.ok) throw new Error()

      toast.success("Transação registrada!")
      setIsAddTxModalOpen(false)
      setDesc("")
      setAmt("")
      fetchFinanceData()
    } catch {
      toast.error("Erro ao registrar transação")
    } finally {
      setIsSubmittingTx(false)
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    const matchesCat = selectedCat === "Tudo" || t.cat === selectedCat
    const matchesSearch = t.desc.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  const totalSpentInModules = modules.reduce(
    (acc, m) => acc + m.currentMonthTotal,
    0,
  )
  const totalPrevSpentInModules = modules.reduce(
    (acc, m) => acc + m.prevMonthTotal,
    0,
  )
  const totalMonthDiff = totalSpentInModules - totalPrevSpentInModules

  return (
    <div className="space-y-6">
      <TopBar
        title="Financeiro"
        onRefresh={() => {
          fetchModules()
          fetchFinanceData()
        }}
      />

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-[rgba(4,70,67,0.08)]">
        <div className="flex gap-1.5 bg-[rgba(4,70,67,0.04)] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("modules")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "modules"
                ? "bg-[#044643] text-white shadow-sm"
                : "text-[#5c757a] hover:text-[#032228]"
            }`}
          >
            <Layers size={16} /> Módulos de Custos (Moto, Academia, etc.)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("transactions")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "transactions"
                ? "bg-[#044643] text-white shadow-sm"
                : "text-[#5c757a] hover:text-[#032228]"
            }`}
          >
            <Receipt size={16} /> Contas & Extrato Geral
          </button>
        </div>

        {}
        <div className="flex items-center gap-2 bg-[#f9fafb] border border-[rgba(4,70,67,0.12)] px-3 py-1.5 rounded-lg text-xs text-[#032228]">
          <Calendar size={14} className="text-[#315d68]" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent border-none outline-none font-medium cursor-pointer"
          >
            {availableMonths.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {}
      {activeTab === "modules" && (
        <div className="space-y-6">
          {}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl">
              <span className="text-xs uppercase text-[#5c757a] font-mono tracking-wider">
                Gasto em Módulos no Mês
              </span>
              <p className="text-2xl font-bold text-[#032228] font-mono mt-1">
                $
                {totalSpentInModules.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                {totalMonthDiff >= 0 ? (
                  <span className="text-[#e05252] flex items-center gap-1 font-semibold">
                    <TrendingUp size={14} /> +${totalMonthDiff.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-[#4a9d6a] flex items-center gap-1 font-semibold">
                    <TrendingDown size={14} /> -$
                    {Math.abs(totalMonthDiff).toFixed(2)}
                  </span>
                )}
                <span className="text-[#5c757a]">vs mês anterior</span>
              </div>
            </Card>

            <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl">
              <span className="text-xs uppercase text-[#5c757a] font-mono tracking-wider">
                Total de Módulos Ativos
              </span>
              <p className="text-2xl font-bold text-[#044643] font-mono mt-1">
                {modules.length} categorias
              </p>
              <p className="text-xs text-[#5c757a] mt-2">
                Acompanhamento contínuo mês a mês
              </p>
            </Card>

            <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase text-[#5c757a] font-mono tracking-wider">
                  Ação Rápida
                </span>
                <p className="text-xs text-[#5c757a] mt-1">
                  Crie novos grupos de gastos específicos para gerenciar seu
                  custo de vida.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus size={15} />}
                onClick={() => setIsNewModuleModalOpen(true)}
                className="mt-3 w-full"
              >
                Novo Módulo de Custo
              </Button>
            </Card>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m) => {
              const isHigher = m.diffValue > 0
              return (
                <Card
                  key={m.id}
                  className="bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ background: m.color || "#044643" }}
                        />
                        <h3 className="text-base font-bold text-[#032228] m-0">
                          {m.name}
                        </h3>
                      </div>
                      <Badge label={m.category} color={m.color} />
                    </div>

                    {m.description && (
                      <p className="text-xs text-[#5c757a] mt-1 line-clamp-1">
                        {m.description}
                      </p>
                    )}

                    {}
                    <div className="mt-4 p-3 rounded-xl bg-[#f9fafb] border border-[rgba(4,70,67,0.06)]">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-[#5c757a]">
                          Gasto neste mês
                        </span>
                        <span className="text-xl font-bold text-[#032228] font-mono">
                          ${m.currentMonthTotal.toFixed(2)}
                        </span>
                      </div>

                      {}
                      <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-[rgba(4,70,67,0.04)]">
                        <span className="text-[#5c757a]">Comparativo:</span>
                        <span
                          className={`flex items-center gap-1 font-semibold ${
                            isHigher ? "text-[#e05252]" : "text-[#4a9d6a]"
                          }`}
                        >
                          {isHigher ? (
                            <TrendingUp size={13} />
                          ) : (
                            <TrendingDown size={13} />
                          )}
                          {m.diffValue >= 0 ? "+" : ""}${m.diffValue.toFixed(2)}{" "}
                          ({m.diffPct}%)
                        </span>
                      </div>
                    </div>

                    {}
                    <div className="mt-3 flex items-center justify-between text-xs text-[#5c757a]">
                      <span className="font-medium">
                        {m.entriesCount} registro
                        {m.entriesCount === 1 ? "" : "s"} no mês
                      </span>
                      {m.budget > 0 && (
                        <span className="font-mono">Teto: ${m.budget}</span>
                      )}
                    </div>
                  </div>

                  {}
                  <div className="pt-3 border-t border-[rgba(4,70,67,0.06)] flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      rightIcon={<ArrowRight size={14} />}
                      onClick={() => setSelectedModuleForDetails(m)}
                      className="flex-1"
                    >
                      Ver Lançamentos
                    </Button>

                    <button
                      onClick={() => setModuleToDelete(m.id)}
                      className="p-2 text-slate-300 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                      title="Excluir módulo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>

          {modules.length === 0 && (
            <div className="py-16 text-center text-[#5c757a] bg-white rounded-2xl border border-[rgba(4,70,67,0.08)]">
              <Layers
                size={36}
                className="mx-auto mb-2 text-[#9495a8] opacity-50"
              />
              <p className="text-sm font-medium">
                Nenhum módulo de custo criado ainda.
              </p>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus size={15} />}
                onClick={() => setIsNewModuleModalOpen(true)}
                className="mt-3"
              >
                Criar Meu Primeiro Módulo
              </Button>
            </div>
          )}
        </div>
      )}

      {}
      {activeTab === "transactions" && (
        <div className="space-y-6">
          {}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {accounts.map((a) => (
              <Card
                key={a.id || a.label}
                className="bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs uppercase text-[#5c757a] font-mono">
                      {a.label}
                    </span>
                    <p className="text-2xl font-bold text-[#032228] font-mono mt-1">
                      $
                      {a.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-[#4a9d6a] mt-1">
                      {a.change} este mês
                    </p>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full mt-1"
                    style={{ background: a.color || "#315d68" }}
                  />
                </div>
                <p className="text-xs text-[#5c757a] mt-3">{a.bank}</p>
              </Card>
            ))}
          </div>

          {}
          <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-3 rounded-xl">
            <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
              <div className="flex items-center gap-2 bg-[#f9fafb] border border-[rgba(4,70,67,0.12)] rounded-lg px-3 py-1.5 w-full sm:w-80">
                <Search size={14} className="text-[#5c757a]" />
                <input
                  placeholder="Buscar transações..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs sm:text-sm text-[#032228] w-full"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus size={15} />}
                  onClick={() => setIsAddTxModalOpen(true)}
                >
                  Nova Transação
                </Button>
              </div>
            </div>
          </Card>

          {}
          <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-0 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-[rgba(4,70,67,0.08)] text-[11px] font-mono text-[#5c757a] uppercase">
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Descrição</th>
                    <th className="py-3 px-4">Categoria / Módulo</th>
                    <th className="py-3 px-4">Conta</th>
                    <th className="py-3 px-4 text-right">Valor</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(4,70,67,0.06)]">
                  {filteredTransactions.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-teal-50/20 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-[#5c757a] whitespace-nowrap">
                        {t.date}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#032228]">
                        {t.desc}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-xs bg-[rgba(4,70,67,0.08)] text-[#044643] font-medium">
                          {t.cat}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#5c757a]">{t.account}</td>
                      <td
                        className={`py-3 px-4 text-right font-mono font-medium ${
                          t.amt > 0 ? "text-[#4a9d6a]" : "text-[#032228]"
                        }`}
                      >
                        {t.amt > 0 ? "+" : ""}
                        {t.amt.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            t.status === "Pago"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && !isLoading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-[#5c757a]"
                      >
                        Nenhuma transação encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {}
      {selectedModuleForDetails && (
        <Modal
          isOpen={Boolean(selectedModuleForDetails)}
          onClose={() => setSelectedModuleForDetails(null)}
          title={`Gastos em "${selectedModuleForDetails.name}" (${selectedMonth})`}
          maxWidth={560}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f9fafb] border border-[rgba(4,70,67,0.08)]">
              <div>
                <span className="text-xs text-[#5c757a]">
                  Total gasto neste módulo:
                </span>
                <p className="text-xl font-bold text-[#032228] font-mono mt-0.5">
                  ${selectedModuleForDetails.currentMonthTotal.toFixed(2)}
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={() => setIsAddItemModalOpen(true)}
              >
                Novo Lançamento
              </Button>
            </div>

            {}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {selectedModuleForDetails.items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[rgba(4,70,67,0.08)] bg-white text-xs sm:text-sm"
                >
                  <div>
                    <p className="font-semibold text-[#032228] m-0">
                      {it.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#5c757a] mt-0.5 font-mono">
                      <span>{it.date}</span>
                      {it.quantity > 1 && <span>• {it.quantity}x</span>}
                      {it.notes && <span>• {it.notes}</span>}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#e05252]">
                    -${it.amount.toFixed(2)}
                  </span>
                </div>
              ))}

              {selectedModuleForDetails.items.length === 0 && (
                <div className="py-8 text-center text-[#5c757a] text-xs">
                  Nenhum gasto catalogado neste módulo para o mês selecionado.
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {}
      {selectedModuleForDetails && (
        <Modal
          isOpen={isAddItemModalOpen}
          onClose={() => setIsAddItemModalOpen(false)}
          title={`Novo Lançamento em ${selectedModuleForDetails.name}`}
        >
          <form onSubmit={handleAddModuleExpense} className="space-y-4">
            <Input
              label="Item / Descrição"
              placeholder="Ex: Gasolina Posto Shell, Troca de Óleo, etc."
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Valor Total ($)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={itemAmount}
                onChange={(e) => setItemAmount(e.target.value)}
                required
              />
              <Input
                label="Quantidade / Frequência"
                type="number"
                placeholder="1"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
              />
            </div>

            <Input
              label="Observações (Opcional)"
              placeholder="Ex: Km 12.400, Tanque cheio..."
              value={itemNotes}
              onChange={(e) => setItemNotes(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddItemModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Salvar Gasto
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {}
      <Modal
        isOpen={isNewModuleModalOpen}
        onClose={() => setIsNewModuleModalOpen(false)}
        title="Novo Módulo de Custos"
      >
        <form onSubmit={handleCreateModule} className="space-y-4">
          <Input
            label="Nome do Módulo"
            placeholder="Ex: Moto, Academia, Feira, Energia, etc."
            value={modName}
            onChange={(e) => setModName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#032228] block mb-1">
                Categoria
              </label>
              <select
                value={modCategory}
                onChange={(e) => setModCategory(e.target.value)}
                className="w-full p-2 rounded-lg border border-[rgba(4,70,67,0.2)] text-sm text-[#032228] outline-none"
              >
                <option value="Transporte">Transporte</option>
                <option value="Saúde">Saúde & Bem-estar</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Utilidades">Utilidades / Moradia</option>
                <option value="Educação">Educação</option>
                <option value="Lazer">Lazer</option>
              </select>
            </div>

            <Input
              label="Orçamento Mensal Estimado ($)"
              type="number"
              placeholder="Ex: 350"
              value={modBudget}
              onChange={(e) => setModBudget(e.target.value)}
            />
          </div>

          <Input
            label="Descrição Curta"
            placeholder="Ex: Manutenções e abastecimentos semanais..."
            value={modDescription}
            onChange={(e) => setModDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsNewModuleModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmittingModule}
            >
              Criar Módulo
            </Button>
          </div>
        </form>
      </Modal>

      {}
      <Modal
        isOpen={isAddTxModalOpen}
        onClose={() => setIsAddTxModalOpen(false)}
        title="Nova Transação Geral"
      >
        <form onSubmit={handleCreateTx} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${
                type === "expense"
                  ? "bg-red-50 border-red-300 text-red-600"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              Despesa (-)
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${
                type === "income"
                  ? "bg-green-50 border-green-300 text-green-600"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              Receita (+)
            </button>
          </div>

          <Input
            label="Descrição"
            placeholder="Ex: Supermercado, Salário, Internet..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Valor ($)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
              required
            />
            <div>
              <label className="text-xs font-semibold text-[#032228] block mb-1">
                Categoria
              </label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
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

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddTxModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmittingTx}>
              Salvar Transação
            </Button>
          </div>
        </form>
      </Modal>

      {}
      <ConfirmModal
        isOpen={Boolean(moduleToDelete)}
        onClose={() => setModuleToDelete(null)}
        onConfirm={handleConfirmDeleteModule}
        title="Excluir Módulo Financeiro"
        description="Tem certeza de que deseja remover este módulo de custos e todos os seus lançamentos catalogados?"
      />
    </div>
  )
}
