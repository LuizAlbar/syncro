import type { Metadata } from "next"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "Syncro",
  description:
    "Organização pessoal inteligente: tarefas diárias, gestão financeira e metas em um só lugar.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div id="root">{children}</div>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "#032228",
              border: "1px solid rgba(49, 93, 104, 0.4)",
              color: "#dcd6dc",
            },
          }}
        />
      </body>
    </html>
  )
}
