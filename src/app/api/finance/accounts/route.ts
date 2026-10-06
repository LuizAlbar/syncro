import { NextResponse } from "next/server"
import { getCurrentUser } from "@/server/auth/session"
import { connectToDatabase } from "@/server/db/mongodb"
import { FinanceAccount } from "@/server/models/FinanceAccount"
import { createAccountSchema } from "@/shared/validators/finance"

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const result = createAccountSchema.safeParse(body)

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
    const account = await FinanceAccount.create({
      ...result.data,
      userId: user.id,
    })

    return NextResponse.json(
      {
        account: {
          id: account._id.toString(),
          label: account.label,
          amount: account.amount,
          change: account.change,
          bank: account.bank,
          color: account.color,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create account error:", error)
    return NextResponse.json({ error: "Erro ao criar conta" }, { status: 500 })
  }
}
