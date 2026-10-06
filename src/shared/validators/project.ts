import { z } from "zod"

export const createProjectSchema = z.object({
  title: z.string().min(1, "O título do projeto é obrigatório").trim(),
  description: z.string().optional().default(""),
  category: z.string().optional().default("Geral"),
  status: z
    .enum(["Planejamento", "Em Andamento", "Pausado", "Concluído"])
    .default("Em Andamento"),
  progress: z.number().min(0).max(100).default(0),
  deadline: z.string().min(1, "O prazo é obrigatório"),
  color: z.string().optional().default("#315d68"),
  budget: z.number().optional().default(0),
})

export const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  status: z
    .enum(["Planejamento", "Em Andamento", "Pausado", "Concluído"])
    .optional(),
  progress: z.number().min(0).max(100).optional(),
  deadline: z.string().optional(),
  color: z.string().optional(),
  budget: z.number().optional(),
  tasksCount: z.number().optional(),
  completedTasksCount: z.number().optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
