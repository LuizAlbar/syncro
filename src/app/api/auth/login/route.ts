import { NextResponse } from "next/server"
import { connectToDatabase } from "@/server/db/mongodb"
import { User } from "@/server/models/User"
import { loginSchema } from "@/shared/validators/auth"
import {
  verifyPassword,
  createSessionToken,
  setSessionCookie,
} from "@/server/auth/session"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { email, password } = result.data

    await connectToDatabase()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "E-mail ou senha incorretos" }, {
        status: 401,
      })
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: "E-mail ou senha incorretos" }, {
        status: 401,
      })
    }

    // Cria token e cookie para a sessão do usuário
    const token = await createSessionToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    })

    await setSessionCookie(token)

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor ao autenticar" },
      { status: 500 },
    )
  }
}
