import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).default("mongodb://mongodb:27017/syncro"),
  MONGODB_URI: z.string().optional(),
  JWT_SECRET: z
    .string()
    .min(16, "JWT_SECRET must be at least 16 characters long")
    .default("syncro_dev_secret_jwt_key_session_secure_2026_at_least_32_chars"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
})

const parseEnv = () => {
  const parsed = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL || process.env.MONGODB_URI,
    MONGODB_URI: process.env.MONGODB_URI || process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
  })

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    )
    throw new Error("Invalid environment variables")
  }

  return {
    ...parsed.data,
    DATABASE_URL:
      parsed.data.DATABASE_URL ||
      parsed.data.MONGODB_URI ||
      "mongodb://mongodb:27017/syncro",
  }
}

export const env = parseEnv()
export type Env = z.infer<typeof envSchema>
