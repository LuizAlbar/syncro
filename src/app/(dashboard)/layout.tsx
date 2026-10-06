"use client" /* Mobile Top Header (only visible on small screens) */ /* Sidebar (desktop fixed, mobile slide-over) */ /* Main Content Area */
import React, { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Menu, Compass } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#032228] text-[#dcd6dc]">
      {}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#02171a] border-b border-[rgba(148,149,168,0.1)] z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Compass size={22} className="text-[#dcd6dc]" />
          <span className="font-extrabold tracking-wider text-sm text-[#dcd6dc]">
            SYNCRO
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-[#9495a8] hover:text-white rounded-lg focus:outline-none"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {}
      <main className="flex-1 min-h-screen bg-[#f4f7f6] overflow-y-auto w-full transition-all md:ml-[260px] pt-16 md:pt-0 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
