import { NextResponse } from "next/server"
import { getCurrentUser } from "@/server/auth/session"
import { connectToDatabase } from "@/server/db/mongodb"
import { Goal } from "@/server/models/Goal"

export async function PATCH(
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

    await connectToDatabase()
    const existing = await Goal.findOne({ _id: id, userId: user.id })
    if (!existing) {
      return NextResponse.json({ error: "Meta não encontrada" }, {
        status: 404,
      })
    }

    // Toggle milestone se enviado milestoneIndex
    if (typeof body.toggleMilestoneIndex === "number") {
      const idx = body.toggleMilestoneIndex
      if (existing.milestones && existing.milestones[idx]) {
        existing.milestones[idx].done = !existing.milestones[idx].done
        // Recalcula progresso se baseado em marcos ou atualiza pct
        const doneCount = existing.milestones.filter((m) => m.done).length
        const total = existing.milestones.length
        if (existing.unit !== "$" && total > 0) {
          existing.current = doneCount
          existing.pct = Math.round((doneCount / total) * 100)
        }
      }
    }

    if (body.current !== undefined) {
      existing.current = Number(body.current)
      if (existing.target > 0) {
        existing.pct = Math.min(
          100,
          Math.round((existing.current / existing.target) * 100),
        )
      }
    }

    if (body.target !== undefined) {
      existing.target = Number(body.target)
      if (existing.target > 0) {
        existing.pct = Math.min(
          100,
          Math.round((existing.current / existing.target) * 100),
        )
      }
    }

    if (body.title) existing.title = body.title
    if (body.cat) existing.cat = body.cat
    if (body.catColor) existing.catColor = body.catColor
    if (body.deadline) existing.deadline = body.deadline
    if (body.status) existing.status = body.status

    if (existing.pct >= 100) {
      existing.status = "completed"
    }

    await existing.save()

    return NextResponse.json({
      goal: {
        id: existing._id.toString(),
        title: existing.title,
        cat: existing.cat,
        catColor: existing.catColor,
        deadline: existing.deadline,
        current: existing.current,
        target: existing.target,
        unit: existing.unit,
        pct: existing.pct,
        status: existing.status,
        milestones: existing.milestones,
      },
    })
  } catch (error) {
    console.error("Update goal error:", error)
    return NextResponse.json({ error: "Erro ao atualizar meta" }, {
      status: 500,
    })
  }
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

  try {
    await connectToDatabase()
    const goal = await Goal.findOneAndDelete({ _id: id, userId: user.id })

    if (!goal) {
      return NextResponse.json({ error: "Meta não encontrada" }, {
        status: 404,
      })
    }

    return NextResponse.json({ success: true, message: "Meta excluída" })
  } catch (error) {
    console.error("Delete goal error:", error)
    return NextResponse.json({ error: "Erro ao excluir meta" }, { status: 500 })
  }
}
