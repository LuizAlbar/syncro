import { NextResponse } from "next/server"
import { getCurrentUser } from "@/server/auth/session"
import { connectToDatabase } from "@/server/db/mongodb"
import { FinanceModule } from "@/server/models/FinanceModule"
import { FinanceExpenseItem } from "@/server/models/FinanceExpenseItem"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await params
  const { searchParams } = new URL(req.url)
  const now = new Date()
  const defaultMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`
  const month = searchParams.get("month") || defaultMonth

  await connectToDatabase()
  const [moduleData, items] = await Promise.all([
    FinanceModule.findOne({ _id: id, userId: user.id }).lean(),
    FinanceExpenseItem.find({ moduleId: id, userId: user.id, monthYear: month })
      .sort({ createdAt: -1 })
      .lean(),
  ])

  if (!moduleData) {
    return NextResponse.json({ error: "Módulo não encontrado" }, {
      status: 404,
    })
  }

  const totalSpent = items.reduce((acc, i) => acc + (i.amount || 0), 0)

  return NextResponse.json({
    module: {
      id: moduleData._id.toString(),
      name: moduleData.name,
      category: moduleData.category,
      icon: moduleData.icon,
      color: moduleData.color,
      budget: moduleData.budget,
      description: moduleData.description,
      totalSpent,
    },
    items: items.map((it) => ({
      id: it._id.toString(),
      title: it.title,
      amount: it.amount,
      date: it.date,
      quantity: it.quantity,
      notes: it.notes,
      monthYear: it.monthYear,
    })),
  })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await params

  await connectToDatabase()
  const [mod] = await Promise.all([
    FinanceModule.findOneAndDelete({ _id: id, userId: user.id }),
    FinanceExpenseItem.deleteMany({ moduleId: id, userId: user.id }),
  ])

  if (!mod) {
    return NextResponse.json({ error: "Módulo não encontrado" }, {
      status: 404,
    })
  }

  return NextResponse.json({
    success: true,
    message: "Módulo financeiro excluído",
  })
}
