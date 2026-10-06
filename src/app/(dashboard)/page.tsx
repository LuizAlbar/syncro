"use client" /* Cartões Métricos Responsivos */ /* Card 1 - Saldo */ /* Card 2 - Fluxo de Caixa */ /* Card 3 - Metas & Projetos */ /* Grid Principal Responsivo */ /* Coluna Esquerda (2 colunas em telas grandes) */ /* Gráfico Visão Geral */ /* Tarefas em Foco */ /* Coluna Direita (1 coluna em telas grandes) */ /* Próximas Metas */ /* Transações Recentes */
import React, { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { TopBar } from "@/components/layout/TopBar"
import { Card } from "@/components/ui/Card"
import { Badge, PriorityBadge } from "@/components/ui/Badge"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Sparkline } from "@/components/charts/Sparkline"
import { AreaChart } from "@/components/charts/AreaChart"
import { TrendingUp, ArrowRight, Clock, Check } from "lucide-react"

interface DashboardData {
  metrics: {
    totalBalance: number
    monthlyIncome: number
    monthlyExpenses: number
    netCashFlow: number
    activeGoalsCount: number
    completedGoalsCount: number
    totalProjectsCount: number
    tasksTodayTotal: number
    tasksTodayDone: number
  }
  focusTasks: {
    id: string
    text: string
    priority: "Alta" | "Média" | "Baixa"
    done: boolean
    tag: string
  }[]
  upcomingGoals: {
    id: string
    label: string
    pct: number
    color: string
    deadline?: string
  }[]
  recentTransactions: {
    id: string
    date: string
    desc: string
    cat: string
    amt: number
    status: string
  }[]
  incomeChart: number[]
  expensesChart: number[]
}

const catColors: Record<string, string> = {
  Assinaturas: "#9495a8",
  Receitas: "#4a9d6a",
  Alimentação: "#d4914a",
  Software: "#315d68",
  Moradia: "#e05252",
  Investimentos: "#a78bfa",
  Utilidades: "#60a5fa",
  Poupança: "#34d399",
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard")
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch {
      toast.error("Erro ao carregar dados do painel")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const toggleTask = async (taskId: string, currentDone: boolean) => {
    const newDone = !currentDone
    setData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        focusTasks: prev.focusTasks.map((t) =>
          t.id === taskId ? { ...t, done: newDone } : t,
        ),
        metrics: {
          ...prev.metrics,
          tasksTodayDone: currentDone
            ? prev.metrics.tasksTodayDone - 1
            : prev.metrics.tasksTodayDone + 1,
        },
      }
    })

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: newDone }),
      })
      if (!res.ok) throw new Error()
      toast.success(newDone ? "Tarefa concluída!" : "Tarefa reaberta!")
    } catch {
      toast.error("Erro ao atualizar tarefa")
      fetchDashboard()
    }
  }

  const labelStyle: React.CSSProperties = {
    margin: "0 0 4px",
    fontSize: 11.5,
    color: "#5c757a",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    fontFamily: "'DM Mono', monospace",
  }

  const bigNumStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 28,
    fontWeight: 700,
    color: "#032228",
    letterSpacing: "-0.02em",
    fontFamily: "'DM Mono', monospace",
  }

  if (isLoading && !data) {
    return (
      <div className="py-20 text-center text-[#5c757a]">
        <div className="inline-block w-8 h-8 border-4 border-[#044643] border-t-transparent rounded-full animate-spin mb-3" />
        <p>Carregando dados do Syncro...</p>
      </div>
    )
  }

  const metrics = data?.metrics || {
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    netCashFlow: 0,
    activeGoalsCount: 0,
    completedGoalsCount: 0,
    totalProjectsCount: 0,
    tasksTodayTotal: 0,
    tasksTodayDone: 0,
  }

  const focusTasks = data?.focusTasks || []
  const upcomingGoals = data?.upcomingGoals || []
  const recentTransactions = data?.recentTransactions || []
  const incomeChart = data?.incomeChart || [0, 0, 0, 0, 0, 0, 0, 0]
  const expensesChart = data?.expensesChart || [0, 0, 0, 0, 0, 0, 0, 0]

  return (
    <div className="space-y-6">
      <TopBar title="Painel Geral" onRefresh={fetchDashboard} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p style={labelStyle}>Saldo Total</p>
              <p style={{ ...bigNumStyle, marginBottom: 6 }}>
                ${Math.floor(metrics.totalBalance).toLocaleString("en-US")}
                <span className="text-lg opacity-80">
                  ,{(metrics.totalBalance % 1).toFixed(2).slice(2) || "00"}
                </span>
              </p>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#4a9d6a] flex items-center gap-1 font-semibold">
                  <TrendingUp size={14} /> Atualizado
                </span>
              </div>
            </div>
          </div>
        </Card>

        {}
        <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl shadow-sm">
          <p style={labelStyle}>Fluxo de Caixa Mensal</p>
          <div className="flex justify-between mb-2">
            <div>
              <p className="text-xs text-[#5c757a] m-0">Receitas</p>
              <p className="text-lg font-bold text-[#4a9d6a] font-mono m-0">
                ${metrics.monthlyIncome.toLocaleString("en-US")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#5c757a] m-0">Despesas</p>
              <p className="text-lg font-bold text-[#e05252] font-mono m-0">
                ${metrics.monthlyExpenses.toLocaleString("en-US")}
              </p>
            </div>
          </div>
          <div className="relative h-1.5 bg-[rgba(4,70,67,0.08)] rounded-full overflow-hidden my-2">
            <div className="absolute left-0 top-0 h-full w-full bg-[#4a9d6a]" />
            <div
              className="absolute left-0 top-0 h-full bg-[#e05252]"
              style={{
                width: `${Math.min(100, (metrics.monthlyExpenses / (metrics.monthlyIncome || 1)) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-[#5c757a] m-0 mt-2">
            Líquido:{" "}
            <span
              className={`font-semibold ${
                metrics.netCashFlow >= 0 ? "text-[#4a9d6a]" : "text-[#e05252]"
              }`}
            >
              {metrics.netCashFlow >= 0 ? "+" : "-"}$
              {Math.abs(metrics.netCashFlow).toLocaleString("en-US")}
            </span>{" "}
            este mês
          </p>
        </Card>

        {}
        <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl shadow-sm">
          <p style={labelStyle}>Metas & Projetos</p>
          <p style={{ ...bigNumStyle, marginBottom: 4 }}>
            {metrics.activeGoalsCount}{" "}
            <span className="text-sm font-normal text-[#5c757a]">
              metas ativas
            </span>
          </p>
          <div className="flex gap-2 mt-3 flex-wrap text-xs">
            <span className="bg-red-50 text-[#e05252] border border-red-200 px-2 py-0.5 rounded font-medium">
              {metrics.totalProjectsCount} projetos ativos
            </span>
            <span className="bg-green-50 text-[#4a9d6a] border border-green-200 px-2 py-0.5 rounded font-medium">
              {metrics.completedGoalsCount} concluídas
            </span>
          </div>
        </Card>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2 space-y-6">
          {}
          <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#032228] m-0">
                Evolução Financeira Mensal
              </h3>
              <span className="text-xs text-[#5c757a] font-mono">
                Jan – Out 2026
              </span>
            </div>
            <AreaChart income={incomeChart} expenses={expensesChart} />
          </Card>

          {}
          <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#032228] m-0">
                Tarefas em Foco Hoje
              </h3>
              <Link
                href="/tasks"
                className="text-xs font-semibold text-[#044643] hover:underline"
              >
                {focusTasks.filter((t) => t.done).length}/{focusTasks.length}{" "}
                concluídas →
              </Link>
            </div>
            <div className="space-y-2">
              {focusTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id, t.done)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    t.done
                      ? "bg-slate-50 border-slate-100 opacity-60"
                      : "bg-[#f9fafb] border-[rgba(4,70,67,0.06)] hover:bg-teal-50/30"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      t.done
                        ? "bg-[#044643] border-[#044643] text-white"
                        : "border-slate-300 hover:border-[#044643]"
                    }`}
                  >
                    {t.done && <Check size={11} strokeWidth={3} />}
                  </div>
                  <span
                    className={`flex-1 text-xs sm:text-sm text-[#032228] ${
                      t.done ? "line-through text-slate-400" : ""
                    }`}
                  >
                    {t.text}
                  </span>
                  <PriorityBadge level={t.priority} />
                  <Badge label={t.tag} color="#315d68" />
                </div>
              ))}
              {focusTasks.length === 0 && (
                <p className="text-center text-xs text-[#5c757a] py-6">
                  Nenhuma tarefa pendente para hoje.
                </p>
              )}
            </div>
          </Card>
        </div>

        {}
        <div className="space-y-6">
          {}
          <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#032228] m-0">
                Metas em Andamento
              </h3>
              <Link
                href="/goals"
                className="text-[#5c757a] hover:text-[#032228]"
              >
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingGoals.map((g) => (
                <div key={g.id}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#032228] truncate mr-2">
                      {g.label}
                    </span>
                    <span className="text-[#5c757a] font-mono flex items-center gap-1 shrink-0">
                      <Clock size={11} /> {g.deadline || "Em andamento"}
                    </span>
                  </div>
                  <ProgressBar value={g.pct} color={g.color} height={6} />
                  <span className="text-[11px] text-[#5c757a] block mt-1">
                    {g.pct}% concluído
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {}
          <Card className="bg-white border border-[rgba(4,70,67,0.08)] p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#032228] m-0">
                Últimas Transações
              </h3>
              <Link
                href="/finance"
                className="text-xs font-semibold text-[#044643] hover:underline"
              >
                Ver tudo
              </Link>
            </div>
            <div className="divide-y divide-[rgba(4,70,67,0.06)]">
              {recentTransactions.map((t, i) => (
                <div
                  key={t.id || i}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-[#032228] truncate m-0">
                      {t.desc}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#5c757a]">
                      <span className="font-mono">{t.date}</span>
                      <span>•</span>
                      <span
                        className="px-1.5 py-0.2 rounded"
                        style={{
                          background: `${catColors[t.cat] || "#5c757a"}18`,
                          color: catColors[t.cat] || "#5c757a",
                        }}
                      >
                        {t.cat}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-mono font-semibold shrink-0 ${
                      t.amt > 0 ? "text-[#4a9d6a]" : "text-[#032228]"
                    }`}
                  >
                    {t.amt > 0 ? "+" : ""}
                    {t.amt.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
