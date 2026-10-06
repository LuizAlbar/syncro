import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("syncro_session_token")?.value
  const { pathname } = request.nextUrl

  const isAuthPage = pathname.startsWith("/login")
  const isApiAuth = pathname.startsWith("/api/auth")
  const isPublicStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")

  if (isPublicStatic || isApiAuth) {
    return NextResponse.next()
  }

  // Se o usuário não tiver token e tentar acessar página protegida
  if (!token && !isAuthPage) {
    const url = new URL("/login", request.url)
    return NextResponse.redirect(url)
  }

  // Se o usuário já tiver token e estiver na tela de login
  if (token && isAuthPage) {
    const url = new URL("/", request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
