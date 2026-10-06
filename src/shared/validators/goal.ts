import { z } from "zod"

export const milestoneSchema = z.object({
  label: z.string().min(1, "Descrição do marco é obrigatória"),
  done: z.boolean().default(false),
})

export const createGoalSchema = z.object({
  title: z.string().min(1, "Título da meta é obrigatório").trim(),
  cat: z.string().default("Financeira"),
  catColor: z.string().default("#315d68"),
  deadline: z.string().min(1, "Prazo é obrigatório"),
  current: z.coerce.number().default(0),
  target: z.coerce.number().min(0.01, "A meta deve ter valor maior que zero"),
  unit: z.string().default("$"),
  status: z
    .enum(["financial", "milestone", "completed", "inprogress"])
    .default("inprogress"),
  milestones: z.array(milestoneSchema).default([]),
})

export const updateGoalSchema = z.object({
  title: z.string().min(1).optional(),
  cat: z.string().optional(),
  catColor: z.string().optional(),
  deadline: z.string().optional(),
  current: z.coerce.number().optional(),
  target: z.coerce.number().optional(),
  unit: z.string().optional(),
  status: z
    .enum(["financial", "milestone", "completed", "inprogress"])
    .optional(),
  milestones: z.array(milestoneSchema).optional(),
})

export const toggleMilestoneSchema = z.object({
  milestoneIndex: z.number().int().min(0),
})

export type MilestoneInput = z.infer<typeof milestoneSchema>
export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>
