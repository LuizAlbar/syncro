import { NextResponse } from "next/server"
import { getCurrentUser } from "@/server/auth/session"
import { connectToDatabase } from "@/server/db/mongodb"
import { FinanceAccount } from "@/server/models/FinanceAccount"
import { FinanceTransaction } from "@/server/models/FinanceTransaction"
import { createTransactionSchema } from "@/shared/validators/finance"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  await connectToDatabase()
  const [accounts, transactions] = await Promise.all([
    FinanceAccount.find({ userId: user.id }).lean(),
    FinanceTransaction.find({ userId: user.id }).sort({ createdAt: -1 }).lean(),
  ])

  return NextResponse.json({
    accounts: accounts.map((a) => ({
      id: a._id.toString(),
      label: a.label,
      amount: a.amount,
      change: a.change,
      bank: a.bank,
      color: a.color,
    })),
    transactions: transactions.map((t) => ({
      id: t._id.toString(),
      date: t.date,
      desc: t.desc,
      cat: t.cat,
      account: t.account,
      amt: t.amt,
      status: t.status,
      createdAt: t.createdAt,
    })),
  })
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const result = createTransactionSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    await connectToDatabase()
    const newTx = await FinanceTransaction.create({
      ...result.data,
      userId: user.id,
    })

    // Se houver conta associada, atualiza saldo
    if (result.data.account) {
      await FinanceAccount.findOneAndUpdate(
        {
          userId: user.id,
          label: { $regex: new RegExp(result.data.account, "i") },
        },
        { $inc: { amount: result.data.amt } },
      )
    }

    return NextResponse.json(
      {
        transaction: {
          id: newTx._id.toString(),
          date: newTx.date,
          desc: newTx.desc,
          cat: newTx.cat,
          account: newTx.account,
          amt: newTx.amt,
          status: newTx.status,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create transaction error:", error)
    return NextResponse.json({ error: "Erro ao criar transação" }, {
      status: 500,
    })
  }
}
