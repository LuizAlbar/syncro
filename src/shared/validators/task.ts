import { z } from "zod"

export const createTaskSchema = z.object({
  text: z.string().min(1, "O título da tarefa é obrigatório").trim(),
  priority: z.enum(["Alta", "Média", "Baixa"]).default("Média"),
  due: z.string().min(1, "O prazo é obrigatório").default("Hoje"),
  goal: z.string().optional().default(""),
  group: z.enum(["Hoje", "Próximos 7 Dias", "Mais Tarde"]).default("Hoje"),
  kanban: z.enum(["todo", "inprogress", "done"]).default("todo"),
  projectId: z.string().optional(),
  stage: z.string().optional(),
})

export const updateTaskSchema = z.object({
  text: z.string().min(1).optional(),
  priority: z.enum(["Alta", "Média", "Baixa"]).optional(),
  done: z.boolean().optional(),
  due: z.string().optional(),
  goal: z.string().optional(),
  group: z.enum(["Hoje", "Próximos 7 Dias", "Mais Tarde"]).optional(),
  kanban: z.enum(["todo", "inprogress", "done"]).optional(),
  projectId: z.string().optional(),
  stage: z.string().optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
