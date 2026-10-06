import { z } from "zod"

export const createTransactionSchema = z.object({
  date: z.string().min(1, "Data é obrigatória"),
  desc: z.string().min(1, "Descrição é obrigatória").trim(),
  cat: z.string().min(1, "Categoria é obrigatória"),
  account: z.string().min(1).default("Corrente"),
  amt: z.coerce.number({ error: "Valor inválido" }),
  status: z.enum(["Pago", "Pendente"]).default("Pago"),
})

export const createAccountSchema = z.object({
  label: z.string().min(1, "Nome da conta é obrigatório").trim(),
  amount: z.coerce.number().default(0),
  change: z.string().default("+$0"),
  bank: z.string().min(1, "Instituição/Banco é obrigatório").trim(),
  color: z.string().optional().default("#315d68"),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type CreateAccountInput = z.infer<typeof createAccountSchema>
