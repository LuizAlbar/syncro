import { NextResponse } from "next/server"
import { getCurrentUser } from "@/server/auth/session"
import { connectToDatabase } from "@/server/db/mongodb"
import { Goal } from "@/server/models/Goal"
import { createGoalSchema } from "@/shared/validators/goal"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  await connectToDatabase()
  const goals = await Goal.find({ userId: user.id })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({
    goals: goals.map((g) => ({
      id: g._id.toString(),
      title: g.title,
      cat: g.cat,
      catColor: g.catColor,
      deadline: g.deadline,
      current: g.current,
      target: g.target,
      unit: g.unit,
      pct: g.pct,
      status: g.status,
      milestones: g.milestones || [],
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
    const result = createGoalSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { target, current = 0, milestones = [] } = result.data
    const pct =
      target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0
    const status = pct >= 100 ? "completed" : result.data.status || "inprogress"

    await connectToDatabase()
    const newGoal = await Goal.create({
      ...result.data,
      pct,
      status,
      milestones,
      userId: user.id,
    })

    return NextResponse.json(
      {
        goal: {
          id: newGoal._id.toString(),
          title: newGoal.title,
          cat: newGoal.cat,
          catColor: newGoal.catColor,
          deadline: newGoal.deadline,
          current: newGoal.current,
          target: newGoal.target,
          unit: newGoal.unit,
          pct: newGoal.pct,
          status: newGoal.status,
          milestones: newGoal.milestones,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create goal error:", error)
    return NextResponse.json({ error: "Erro ao criar meta" }, { status: 500 })
  }
}
