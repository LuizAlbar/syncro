import { NextResponse } from "next/server"
import { getCurrentUser } from "@/server/auth/session"
import { connectToDatabase } from "@/server/db/mongodb"
import { Task } from "@/server/models/Task"
import { Project } from "@/server/models/Project"
import { updateTaskSchema } from "@/shared/validators/task"

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
    const result = updateTaskSchema.safeParse(body)

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
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: result.data },
      { new: true },
    )

    if (!task) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, {
        status: 404,
      })
    }

    // Se estiver associada a um projeto, recalcula o progresso do projeto
    if (task.projectId) {
      const projId = task.projectId
      const totalInProj = await Task.countDocuments({ projectId: projId })
      const doneInProj = await Task.countDocuments({
        projectId: projId,
        done: true,
      })
      const progress =
        totalInProj > 0 ? Math.round((doneInProj / totalInProj) * 100) : 0
      await Project.findByIdAndUpdate(projId, {
        tasksCount: totalInProj,
        completedTasksCount: doneInProj,
        progress,
        status: progress >= 100 ? "Concluído" : "Em Andamento",
      })
    }

    return NextResponse.json({
      task: {
        id: task._id.toString(),
        projectId: task.projectId ? task.projectId.toString() : null,
        text: task.text,
        priority: task.priority,
        done: task.done,
        due: task.due,
        goal: task.goal,
        group: task.group,
        kanban: task.kanban,
        stage: task.stage || "Geral",
      },
    })
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ error: "Erro ao atualizar tarefa" }, {
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
    const task = await Task.findOneAndDelete({ _id: id, userId: user.id })

    if (!task) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, {
        status: 404,
      })
    }

    // Se pertencia a um projeto, atualiza contadores
    if (task.projectId) {
      const projId = task.projectId
      const totalInProj = await Task.countDocuments({ projectId: projId })
      const doneInProj = await Task.countDocuments({
        projectId: projId,
        done: true,
      })
      const progress =
        totalInProj > 0 ? Math.round((doneInProj / totalInProj) * 100) : 0
      await Project.findByIdAndUpdate(projId, {
        tasksCount: totalInProj,
        completedTasksCount: doneInProj,
        progress,
      })
    }

    return NextResponse.json({ success: true, message: "Tarefa excluída" })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ error: "Erro ao excluir tarefa" }, {
      status: 500,
    })
  }
}
