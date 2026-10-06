import { NextResponse } from "next/server"
import { getCurrentUser } from "@/server/auth/session"
import { connectToDatabase } from "@/server/db/mongodb"
import { FinanceModule } from "@/server/models/FinanceModule"
import { FinanceExpenseItem } from "@/server/models/FinanceExpenseItem"

// Calcula mês anterior a partir de YYYY-MM
function getPreviousMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-").map(Number)
  if (month === 1) {
    return `${year - 1}-12`
  }
  const prevM = month - 1
  return `${year}-${prevM < 10 ? `0${prevM}` : prevM}`
}

export async function GET(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const now = new Date()
  const defaultMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`
  const currentMonth = searchParams.get("month") || defaultMonth
  const prevMonth = getPreviousMonth(currentMonth)

  await connectToDatabase()

  const modules = await FinanceModule.find({ userId: user.id }).lean()

  // Busca todos os itens do usuário no mês atual e no mês anterior
  const [currentItems, prevItems] = await Promise.all([
    FinanceExpenseItem.find({
      userId: user.id,
      monthYear: currentMonth,
    }).lean(),
    FinanceExpenseItem.find({ userId: user.id, monthYear: prevMonth }).lean(),
  ])

  const modulesWithStats = modules.map((m) => {
    const modId = m._id.toString()
    const itemsThisMonth = currentItems.filter(
      (i) => i.moduleId.toString() === modId,
    )
    const itemsPrevMonth = prevItems.filter(
      (i) => i.moduleId.toString() === modId,
    )

    const totalCurrent = itemsThisMonth.reduce(
      (acc, i) => acc + (i.amount || 0),
      0,
    )
    const totalPrev = itemsPrevMonth.reduce(
      (acc, i) => acc + (i.amount || 0),
      0,
    )

    const diffValue = totalCurrent - totalPrev
    const diffPct =
      totalPrev > 0
        ? Math.round((diffValue / totalPrev) * 100)
        : totalCurrent > 0
          ? 100
          : 0

    return {
      id: modId,
      name: m.name,
      category: m.category,
      icon: m.icon,
      color: m.color,
      budget: m.budget || 0,
      description: m.description,
      currentMonthTotal: totalCurrent,
      prevMonthTotal: totalPrev,
      diffValue,
      diffPct,
      entriesCount: itemsThisMonth.length,
      items: itemsThisMonth.map((it) => ({
        id: it._id.toString(),
        title: it.title,
        amount: it.amount,
        date: it.date,
        quantity: it.quantity,
        notes: it.notes,
      })),
    }
  })

  return NextResponse.json({
    month: currentMonth,
    prevMonth,
    modules: modulesWithStats,
  })
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "O nome do módulo é obrigatório" }, {
        status: 400,
      })
    }

    await connectToDatabase()
    const newModule = await FinanceModule.create({
      userId: user.id,
      name: body.name.trim(),
      category: body.category || "Geral",
      icon: body.icon || "Wallet",
      color: body.color || "#315d68",
      budget: body.budget ? parseFloat(body.budget) : 0,
      description: body.description || "",
    })

    return NextResponse.json(
      {
        module: {
          id: newModule._id.toString(),
          name: newModule.name,
          category: newModule.category,
          color: newModule.color,
          budget: newModule.budget,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create module error:", error)
    return NextResponse.json({ error: "Erro ao criar módulo financeiro" }, {
      status: 500,
    })
  }
}
