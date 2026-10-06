import { NextResponse } from "next/server"
import { getCurrentUser } from "@/server/auth/session"
import { connectToDatabase } from "@/server/db/mongodb"
import { Project } from "@/server/models/Project"
import { Task } from "@/server/models/Task"
import { updateProjectSchema } from "@/shared/validators/project"

export async function GET(
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
    const [project, tasks] = await Promise.all([
      Project.findOne({ _id: id, userId: user.id }).lean(),
      Task.find({ projectId: id, userId: user.id })
        .sort({ createdAt: -1 })
        .lean(),
    ])

    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado" }, {
        status: 404,
      })
    }

    return NextResponse.json({
      project: {
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        progress: project.progress,
        deadline: project.deadline,
        color: project.color,
        budget: project.budget,
        tasksCount: tasks.length,
        completedTasksCount: tasks.filter((t) => t.done).length,
      },
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
  } catch (error) {
    console.error("Fetch project error:", error)
    return NextResponse.json({ error: "Erro ao carregar projeto" }, {
      status: 500,
    })
  }
}

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
    const result = updateProjectSchema.safeParse(body)

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
    const project = await Project.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: result.data },
      { new: true },
    )

    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado" }, {
        status: 404,
      })
    }

    return NextResponse.json({
      project: {
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        progress: project.progress,
        deadline: project.deadline,
        color: project.color,
        budget: project.budget,
        tasksCount: project.tasksCount,
        completedTasksCount: project.completedTasksCount,
      },
    })
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json({ error: "Erro ao atualizar projeto" }, {
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
    // Exclui projeto e suas tarefas associadas
    const [project] = await Promise.all([
      Project.findOneAndDelete({ _id: id, userId: user.id }),
      Task.deleteMany({ projectId: id, userId: user.id }),
    ])

    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado" }, {
        status: 404,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Projeto excluído com sucesso",
    })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ error: "Erro ao excluir projeto" }, {
      status: 500,
    })
  }
}
