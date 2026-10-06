import { NextResponse } from "next/server"
import { getCurrentUser } from "@/server/auth/session"
import { connectToDatabase } from "@/server/db/mongodb"
import { Task } from "@/server/models/Task"
import { Project } from "@/server/models/Project"
import { createTaskSchema } from "@/shared/validators/task"
import mongoose from "mongoose"

export async function GET(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get("projectId")
  const all = searchParams.get("all") === "true"

  await connectToDatabase()

  const query: Record<string, unknown> = { userId: user.id }

  if (projectId) {
    query.projectId = new mongoose.Types.ObjectId(projectId)
  } else if (!all) {
    // Apenas tarefas livres diárias de /tasks
    query.projectId = null
  }

  const tasks = await Task.find(query).sort({ createdAt: -1 }).lean()

  return NextResponse.json({
    tasks: tasks.map((t) => ({
      id: t._id.toString(),
      projectId: t.projectId ? t.projectId.toString() : null,
      text: t.text,
      priority: t.priority,
      done: t.done,
      due: t.due,
      goal: t.goal,
      group: t.group,
      kanban: t.kanban,
      stage: t.stage || "Geral",
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
    const result = createTaskSchema.safeParse(body)

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

    const taskData: Record<string, unknown> = {
      ...result.data,
      userId: user.id,
    }

    if (result.data.projectId) {
      taskData.projectId = new mongoose.Types.ObjectId(result.data.projectId)
    }

    const newTask = await Task.create(taskData)

    // Se pertence a um projeto, atualiza contadores do projeto
    if (result.data.projectId) {
      const projId = result.data.projectId
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

    return NextResponse.json(
      {
        task: {
          id: newTask._id.toString(),
          projectId: newTask.projectId ? newTask.projectId.toString() : null,
          text: newTask.text,
          priority: newTask.priority,
          done: newTask.done,
          due: newTask.due,
          goal: newTask.goal,
          group: newTask.group,
          kanban: newTask.kanban,
          stage: newTask.stage || "Geral",
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json({ error: "Erro ao criar tarefa" }, { status: 500 })
  }
}
