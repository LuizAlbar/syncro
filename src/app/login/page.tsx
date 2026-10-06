"use client" /* Background Subtle Glow */ /* Login Card */ /* Brand Header */ /* Error Alert */ /* Form */

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Compass, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "E-mail ou senha inválidos")
      }

      toast.success("Bem-vindo ao Syncro!")
      router.push("/")
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao efetuar login"
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#032228] flex items-center justify-center p-4 relative overflow-hidden">
      {}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(4,70,67,0.35)_0%,rgba(3,34,40,0)_70%)] -top-[150px] -right-[150px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(49,93,104,0.25)_0%,rgba(3,34,40,0)_70%)] -bottom-[120px] -left-[120px] pointer-events-none" />

      {}
      <div className="w-full max-w-sm bg-[#02171a] border border-[rgba(148,149,168,0.18)] rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        {}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(49,93,104,0.3)] border border-[rgba(148,149,168,0.2)] text-[#dcd6dc] mb-3">
            <Compass size={28} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-widest text-[#dcd6dc] font-sans m-0">
            SYNCRO
          </h1>
          <p className="mt-1 text-xs text-[#9495a8] tracking-wider">
            Direção. Maestria. Tempo.
          </p>
        </div>

        {}
        {error && (
          <div className="p-3 bg-red-500/15 border border-red-500/35 text-red-300 rounded-lg text-xs mb-4 leading-relaxed">
            {error}
          </div>
        )}

        {}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#dcd6dc] mb-1.5">
              E-mail
            </label>
            <div className="flex items-center gap-2.5 bg-[rgba(3,34,40,0.6)] border border-[rgba(148,149,168,0.2)] rounded-lg px-3 py-2">
              <Mail size={16} className="text-[#9495a8]" />
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent border-none outline-none text-[#dcd6dc] text-sm w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#dcd6dc] mb-1.5">
              Senha
            </label>
            <div className="flex items-center gap-2.5 bg-[rgba(3,34,40,0.6)] border border-[rgba(148,149,168,0.2)] rounded-lg px-3 py-2">
              <Lock size={16} className="text-[#9495a8]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-transparent border-none outline-none text-[#dcd6dc] text-sm w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-[#9495a8] hover:text-[#dcd6dc] p-1 focus:outline-none"
                title={showPassword ? "Ocultar senha" : "Ver senha"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight size={16} />}
            className="w-full bg-[#315d68] border border-[rgba(220,214,220,0.2)] text-white mt-4"
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}
