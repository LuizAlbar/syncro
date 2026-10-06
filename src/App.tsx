"use client"

/**
 * App.tsx foi refatorado e dividido na arquitetura modular de rotas do Next.js:
 * - Painel / Dashboard: / (src/app/(dashboard)/page.tsx)
 * - Financeiro: /finance (src/app/(dashboard)/finance/page.tsx)
 * - Metas: /goals (src/app/(dashboard)/goals/page.tsx)
 * - Tarefas: /tasks (src/app/(dashboard)/tasks/page.tsx)
 * - Projetos: /projects (src/app/(dashboard)/projects/page.tsx)
 * - Login e Autenticação: /login (src/app/login/page.tsx)
 */

import DashboardPage from "@/app/(dashboard)/page"
export default function App() {
  return <DashboardPage />
}
