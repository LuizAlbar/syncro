import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/db/mongodb"
import { User } from "@/server/models/User"
import { registerSchema } from "@/shared/validators/auth"
import {
  hashPassword,
  createSessionToken,
  setSessionCookie,
} from "@/server/auth/session"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { name, email, password } = result.data

    await connectToDatabase()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "Já existe uma conta com este e-mail" },
        { status: 409 },
      )
    }

    const passwordHash = await hashPassword(password)
    const user = await User.create({
      name,
      email,
      passwordHash,
      plan: "Pro",
    })

    // Cria token e cookie para a sessão do usuário
    const token = await createSessionToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    })

    await setSessionCookie(token)

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          plan: user.plan,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor ao criar conta" },
      { status: 500 },
    )
  }
}
