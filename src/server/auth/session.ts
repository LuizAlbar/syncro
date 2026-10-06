import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { env } from "@/shared/env"
import { connectToDatabase } from "@/server/db/mongodb"
import { User } from "@/server/models/User"

const SESSION_COOKIE_NAME = "syncro_session_token"
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60 // 7 dias

const getJwtSecret = () => new TextEncoder().encode(env.JWT_SECRET)

export interface SessionPayload {
  userId: string
  email: string
  name: string
  [key: string]: unknown
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSessionToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getJwtSecret())
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.userId) return null

  try {
    await connectToDatabase()
    const user = await User.findById(session.userId)
      .select("-passwordHash")
      .lean()
    if (!user) return null

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      plan: user.plan || "Pro",
    }
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("UNAUTHORIZED")
  }
  return user
}
