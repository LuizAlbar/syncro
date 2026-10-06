import { NextResponse } from "next/server"
import { getCurrentUser } from "@/server/auth/session"
import { connectToDatabase } from "@/server/db/mongodb"
import { FinanceModule } from "@/server/models/FinanceModule"
import { FinanceExpenseItem } from "@/server/models/FinanceExpenseItem"
import { FinanceTransaction } from "@/server/models/FinanceTransaction"
import mongoose from "mongoose"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    if (!body.title?.trim() || !body.amount) {
      return NextResponse.json({ error: "Título e valor são obrigatórios" }, {
        status: 400,
      })
    }

    await connectToDatabase()
    const mod = await FinanceModule.findOne({ _id: id, userId: user.id })
    if (!mod) {
      return NextResponse.json({ error: "Módulo não encontrado" }, {
        status: 404,
      })
    }

    const now = new Date()
    const defaultMonthYear = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`
    const dateFormatted =
      body.date ||
      now.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    const monthYear = body.monthYear || defaultMonthYear
    const amount = Math.abs(parseFloat(body.amount))
    const quantity = body.quantity ? parseInt(body.quantity, 10) : 1

    // 1. Cria o item detalhado no módulo
    const item = await FinanceExpenseItem.create({
      userId: user.id,
      moduleId: new mongoose.Types.ObjectId(id),
      title: body.title.trim(),
      amount,
      date: dateFormatted,
      monthYear,
      quantity,
      notes: body.notes || "",
    })

    // 2. Registra também no extrato geral de transações para manter sincronizado
    await FinanceTransaction.create({
      userId: user.id,
      date: dateFormatted,
      desc: `[${mod.name}] ${body.title.trim()}`,
      cat: mod.name,
      account: "Corrente",
      amt: -amount,
      status: "Pago",
    })

    return NextResponse.json(
      {
        item: {
          id: item._id.toString(),
          title: item.title,
          amount: item.amount,
          date: item.date,
          monthYear: item.monthYear,
          quantity: item.quantity,
          notes: item.notes,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Add module expense error:", error)
    return NextResponse.json({ error: "Erro ao adicionar gasto no módulo" }, {
      status: 500,
    })
  }
}
