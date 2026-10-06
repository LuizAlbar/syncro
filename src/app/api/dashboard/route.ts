import { NextResponse } from "next/server"
import { getCurrentUser } from "@/server/auth/session"
import { connectToDatabase } from "@/server/db/mongodb"
import { Task } from "@/server/models/Task"
import { Goal } from "@/server/models/Goal"
import { FinanceAccount } from "@/server/models/FinanceAccount"
import { FinanceTransaction } from "@/server/models/FinanceTransaction"
import { Project } from "@/server/models/Project"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  await connectToDatabase()

  const [accounts, transactions, tasks, goals, projects] = await Promise.all([
    FinanceAccount.find({ userId: user.id }).lean(),
    FinanceTransaction.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    Task.find({ userId: user.id, projectId: null }).lean(),
    Goal.find({ userId: user.id }).lean(),
    Project.find({ userId: user.id }).lean(),
  ])

  // Saldo total real
  const totalBalance = accounts.reduce((acc, a) => acc + (a.amount || 0), 0)

  // Receitas e despesas reais
  let monthlyIncome = 0
  let monthlyExpenses = 0
  for (const t of transactions) {
    if (t.amt > 0) {
      monthlyIncome += t.amt
    } else {
      monthlyExpenses += Math.abs(t.amt)
    }
  }

  // Metas ativas e concluídas
  const activeGoals = goals.filter((g) => g.pct < 100)
  const completedGoals = goals.filter((g) => g.pct >= 100)

  // Tarefas diárias para hoje
  const todayTasks = tasks.filter((t) => t.group === "Hoje" || !t.done)
  const completedTodayTasks = todayTasks.filter((t) => t.done)

  return NextResponse.json({
    metrics: {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      netCashFlow: monthlyIncome - monthlyExpenses,
      activeGoalsCount: activeGoals.length,
      completedGoalsCount: completedGoals.length,
      totalProjectsCount: projects.length,
      tasksTodayTotal: todayTasks.length,
      tasksTodayDone: completedTodayTasks.length,
    },
    accounts: accounts.map((a) => ({
      id: a._id.toString(),
      label: a.label,
      amount: a.amount,
      change: a.change,
      bank: a.bank,
      color: a.color,
    })),
    recentTransactions: transactions.slice(0, 5).map((t) => ({
      id: t._id.toString(),
      date: t.date,
      desc: t.desc,
      cat: t.cat,
      amt: t.amt,
      status: t.status,
    })),
    focusTasks: todayTasks.slice(0, 5).map((t) => ({
      id: t._id.toString(),
      text: t.text,
      priority: t.priority,
      done: t.done,
      tag: t.goal || "Geral",
    })),
    upcomingGoals: goals.slice(0, 3).map((g) => ({
      id: g._id.toString(),
      label: g.title,
      pct: g.pct,
      color: g.catColor || "#044643",
      deadline: g.deadline,
    })),
    incomeChart: [0, 0, 0, 0, 0, 0, 0, Math.round(monthlyIncome)],
    expensesChart: [0, 0, 0, 0, 0, 0, 0, Math.round(monthlyExpenses)],
  })
}
