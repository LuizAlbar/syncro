import { NextResponse } from "next/server"
import { getCurrentUser } from "@/server/auth/session"
import { connectToDatabase } from "@/server/db/mongodb"
import { Project } from "@/server/models/Project"
import { createProjectSchema } from "@/shared/validators/project"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  await connectToDatabase()
  const projects = await Project.find({ userId: user.id })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({
    projects: projects.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      description: p.description,
      category: p.category,
      status: p.status,
      progress: p.progress,
      deadline: p.deadline,
      color: p.color,
      budget: p.budget,
      tasksCount: p.tasksCount,
      completedTasksCount: p.completedTasksCount,
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
    const result = createProjectSchema.safeParse(body)

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
    const newProject = await Project.create({
      ...result.data,
      userId: user.id,
      tasksCount: 0,
      completedTasksCount: 0,
    })

    return NextResponse.json(
      {
        project: {
          id: newProject._id.toString(),
          title: newProject.title,
          description: newProject.description,
          category: newProject.category,
          status: newProject.status,
          progress: newProject.progress,
          deadline: newProject.deadline,
          color: newProject.color,
          budget: newProject.budget,
          tasksCount: newProject.tasksCount,
          completedTasksCount: newProject.completedTasksCount,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Erro ao criar projeto" }, {
      status: 500,
    })
  }
}
