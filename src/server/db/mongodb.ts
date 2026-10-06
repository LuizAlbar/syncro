import mongoose from "mongoose"
import { env } from "@/shared/env"

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  } | undefined
}

let cached = global.mongooseConnection

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null }
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    }

    const uri = env.DATABASE_URL

    cached!.promise = mongoose.connect(uri, opts).then((m) => {
      return m
    })
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    throw e
  }

  return cached!.conn
}
