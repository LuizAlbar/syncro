"use client" /* Mobile Backdrop */ /* Logo */ /* Close button for mobile */ /* Nav Links */ /* Bottom Profile and Logout */ /* User Card */ // Escurecido conforme solicitado
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  LayoutDashboard,
  Wallet,
  Target,
  CheckSquare,
  FolderKanban,
  LogOut,
  Compass,
  X,
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  plan: string
}

interface SidebarProps {
  isOpenMobile?: boolean
  onCloseMobile?: () => void
}

export function Sidebar({ isOpenMobile = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json()
        return null
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user)
        }
      })
      .catch((err) => console.error("Error fetching user session:", err))
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast.success("Sessão encerrada com sucesso!")
      router.push("/login")
      router.refresh()
    } catch {
      toast.error("Erro ao encerrar sessão")
      setIsLoggingOut(false)
    }
  }

  const links = [
    { href: "/", label: "Painel", icon: <LayoutDashboard size={18} /> },
    { href: "/finance", label: "Financeiro", icon: <Wallet size={18} /> },
    { href: "/goals", label: "Metas", icon: <Target size={18} /> },
    {
      href: "/tasks",
      label: "Tarefas Diárias",
      icon: <CheckSquare size={18} />,
    },
    { href: "/projects", label: "Projetos", icon: <FolderKanban size={18} /> },
  ]

  const getInitials = (name?: string) => {
    if (!name) return "SY"
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile()
  }

  return (
    <>
      {}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        style={{
          width: 260,
          minWidth: 260,
          height: "100vh",
          background: "#02171a",
          borderRight: "1px solid rgba(148,149,168,0.1)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          transition: "transform 0.25s ease-in-out",
        }}
        className={`
          ${
            isOpenMobile
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {}
        <div
          style={{
            padding: "24px 20px 20px",
            borderBottom: "1px solid rgba(148,149,168,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ color: "#dcd6dc" }}>
              <Compass size={24} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  letterSpacing: "0.12em",
                  color: "#dcd6dc",
                }}
              >
                SYNCRO
              </span>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: 11,
                  color: "#9495a8",
                  letterSpacing: "0.05em",
                }}
              >
                Direção. Maestria. Tempo.
              </p>
            </div>
          </div>

          {}
          <button
            onClick={onCloseMobile}
            className="md:hidden text-[#9495a8] hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        {}
        <nav
          style={{
            flex: 1,
            padding: "16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            overflowY: "auto",
          }}
        >
          {links.map(({ href, label, icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href)) ||
              (href === "/tasks" && pathname.startsWith("/task")) ||
              (href === "/finance" && pathname.startsWith("/financial"))

            return (
              <Link
                key={href}
                href={href}
                onClick={handleLinkClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: isActive ? "rgba(49,93,104,0.35)" : "transparent",
                  color: isActive ? "#dcd6dc" : "#9495a8",
                  textDecoration: "none",
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.01em",
                  transition: "all 0.15s ease",
                  borderLeft: isActive
                    ? "3px solid #315d68"
                    : "3px solid transparent",
                }}
                className="hover:bg-white/5 hover:text-white"
              >
                <span style={{ opacity: isActive ? 1 : 0.7 }}>{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        {}
        <div
          style={{
            padding: "16px 12px 20px",
            borderTop: "1px solid rgba(148,149,168,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 8,
              border: "1px solid rgba(148,149,168,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #315d68, #9495a8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "#dcd6dc",
                  flexShrink: 0,
                }}
              >
                {getInitials(user?.name)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#dcd6dc",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.name || "Usuário Syncro"}
                </div>
                <div style={{ fontSize: 11, color: "#9495a8" }}>
                  Plano {user?.plan || "Pro"}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Sair da Conta"
              style={{
                background: "transparent",
                border: "none",
                color: "#9495a8",
                cursor: "pointer",
                padding: 6,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="hover:text-red-400 hover:bg-red-400/10"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
