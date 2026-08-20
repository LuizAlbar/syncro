"use client";

import { useState } from "react";

// ─── Tipos ──────────────────────────────────────────────────────────────────

type View = "dashboard" | "financials" | "goals" | "tasks";
type TaskView = "list" | "kanban";
type GoalFilter = "all" | "inprogress" | "financial" | "milestone" | "completed";

// ─── Ícones ──────────────────────────────────────────────────────────────────

function IconCompass() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  );
}
function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}
function IconWallet() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V22H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16v4"/><path d="M20 12a2 2 0 0 0-2-2H4"/><circle cx="18" cy="12" r="2"/>
    </svg>
  );
}
function IconTarget() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function IconTrendUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  );
}
function IconArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}
function IconFilter() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  );
}
function IconList() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  );
}
function IconKanban() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="5" height="18"/><rect x="10" y="3" width="5" height="12"/><rect x="17" y="3" width="5" height="8"/>
    </svg>
  );
}
function IconChevronDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

// ─── Componentes Compartilhados ─────────────────────────────────────────────

function ProgressBar({ value, color = "#315d68", height = 6 }: { value: number; color?: string; height?: number }) {
  return (
    <div style={{ height, background: "rgba(148,149,168,0.12)", borderRadius: height / 2, overflow: "hidden" }}>
      <div
        style={{
          width: `${Math.min(100, value)}%`,
          height: "100%",
          background: color,
          borderRadius: height / 2,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}

function CircularProgress({ value, size = 64, stroke = 5, color = "#315d68" }: { value: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(148,149,168,0.12)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

function Badge({ label, color = "#315d68", textColor = "#dcd6dc" }: { label: string; color?: string; textColor?: string }) {
  return (
    <span style={{
      background: color + "33",
      color: textColor === "#dcd6dc" ? color : textColor,
      border: `1px solid ${color}44`,
      borderRadius: 4,
      padding: "2px 7px",
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.02em",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function PriorityBadge({ level }: { level: "Alta" | "Média" | "Baixa" }) {
  const colors = { Alta: "#e05252", Média: "#d4914a", Baixa: "#4a9d6a" };
  return <Badge label={level} color={colors[level]} textColor={colors[level]} />;
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ active, onNav }: { active: View; onNav: (v: View) => void }) {
  const links: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Painel", icon: <IconGrid /> },
    { id: "financials", label: "Financeiro", icon: <IconWallet /> },
    { id: "goals", label: "Metas", icon: <IconTarget /> },
    { id: "tasks", label: "Tarefas / A Fazer", icon: <IconCheck /> },
  ];

  return (
    <aside style={{
      width: 260,
      minWidth: 260,
      height: "100vh",
      background: "#044643",
      borderRight: "1px solid rgba(148,149,168,0.12)",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid rgba(148,149,168,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ color: "#dcd6dc", opacity: 0.9 }}><IconCompass /></div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: "0.12em", color: "#dcd6dc" }}>SYNCRO</span>
        </div>
        <p style={{ marginTop: 6, fontSize: 11, color: "#9495a8", letterSpacing: "0.06em", marginBottom: 0 }}>Direção. Maestria. Tempo.</p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {links.map(({ id, label, icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
                background: isActive ? "rgba(49,93,104,0.35)" : "transparent",
                color: isActive ? "#dcd6dc" : "#9495a8",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 400,
                letterSpacing: "0.01em",
                transition: "all 0.15s ease",
                outline: "none",
                borderLeft: isActive ? "2px solid #315d68" : "2px solid transparent",
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(148,149,168,0.06)"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "16px 12px 24px", borderTop: "1px solid rgba(148,149,168,0.1)", display: "flex", flexDirection: "column", gap: 2 }}>
        {[{ label: "Configurações", icon: <IconSettings /> }, { label: "Notificações", icon: <IconBell /> }].map(({ label, icon }) => (
          <button key={label} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 8, border: "none",
            background: "transparent", color: "#9495a8",
            cursor: "pointer", width: "100%", textAlign: "left",
            fontSize: 13, transition: "all 0.15s ease", outline: "none",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(148,149,168,0.06)"; (e.currentTarget as HTMLButtonElement).style.color = "#dcd6dc"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#9495a8"; }}
          >
            {icon} {label}
          </button>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginTop: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #315d68, #9495a8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#dcd6dc", flexShrink: 0,
          }}>JR</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#dcd6dc" }}>Jordan Reid</div>
            <div style={{ fontSize: 11, color: "#9495a8" }}>Plano Pro</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────

function TopBar({ title }: { title: string }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 28, flexWrap: "wrap", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#dcd6dc", letterSpacing: "-0.01em" }}>{title}</h1>
        <span style={{
          background: "rgba(49,93,104,0.3)", border: "1px solid rgba(49,93,104,0.5)",
          borderRadius: 6, padding: "3px 10px", fontSize: 11.5, color: "#9495a8", fontFamily: "'DM Mono', monospace",
          textTransform: "capitalize",
        }}>{dateStr}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(148,149,168,0.06)", border: "1px solid rgba(148,149,168,0.15)",
          borderRadius: 8, padding: "8px 14px", color: "#9495a8",
        }}>
          <IconSearch />
          <input placeholder="Buscar qualquer coisa..." style={{
            background: "none", border: "none", outline: "none", color: "#dcd6dc",
            fontSize: 13, width: 180, fontFamily: "'Inter', sans-serif",
          }} />
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#315d68", border: "none", borderRadius: 8,
          padding: "9px 16px", color: "#dcd6dc", fontSize: 13,
          fontWeight: 600, cursor: "pointer", letterSpacing: "0.01em",
          transition: "opacity 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <IconPlus /> Adicionar Rápido
        </button>
      </div>
    </div>
  );
}

// ─── Sparkline ───────────────────────────────────────────────────────────────

function Sparkline({ data, color = "#315d68" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 80, h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  });
  const area = `M${pts.join("L")} L${w},${h} L0,${h} Z`;
  const line = `M${pts.join("L")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace("#", "")})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Grafico de Area ─────────────────────────────────────────────────────────

function AreaChart({ income, expenses }: { income: number[]; expenses: number[] }) {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];
  const w = 100, h = 100;
  const maxVal = Math.max(...income, ...expenses);
  const toPath = (data: number[], fill: boolean) => {
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - (v / maxVal) * (h - 10);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const line = `M${pts.join(" L")}`;
    if (!fill) return line;
    return `${line} L${w},${h} L0,${h} Z`;
  };

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={160} preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <linearGradient id="income-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#315d68" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#315d68" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="exp-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9495a8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#9495a8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={toPath(expenses, true)} fill="url(#exp-grad)" />
        <path d={toPath(income, true)} fill="url(#income-grad)" />
        <path d={toPath(expenses, false)} fill="none" stroke="#9495a8" strokeWidth="1" strokeLinecap="round" />
        <path d={toPath(income, false)} fill="none" stroke="#315d68" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {months.map(m => <span key={m} style={{ fontSize: 10, color: "#9495a8", fontFamily: "'DM Mono', monospace" }}>{m}</span>)}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 12, height: 2, background: "#315d68", borderRadius: 1 }} />
          <span style={{ fontSize: 11, color: "#9495a8" }}>Receitas</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 12, height: 2, background: "#9495a8", borderRadius: 1 }} />
          <span style={{ fontSize: 11, color: "#9495a8" }}>Despesas</span>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────

const incomeData = [4800, 5100, 4600, 5300, 4900, 5200, 5500, 5200];
const expensesData = [2400, 2600, 2200, 2900, 2700, 2840, 2600, 2840];

type TaskItem = { id: number; text: string; priority: "Alta" | "Média" | "Baixa"; done: boolean; tag: string };

function DashboardView() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 1, text: "Revisar alocação de investimentos do T3", priority: "Alta", done: false, tag: "Finanças" },
    { id: 2, text: "Concluir leitura — Hábitos Atômicos caps. 7–9", priority: "Média", done: false, tag: "Aprendizado" },
    { id: 3, text: "Enviar fatura de freelancer #2024-08", priority: "Alta", done: true, tag: "Trabalho" },
    { id: 4, text: "Agendar check-up de saúde anual", priority: "Baixa", done: false, tag: "Saúde" },
    { id: 5, text: "Atualizar valor meta do fundo de emergência", priority: "Média", done: false, tag: "Finanças" },
  ]);

  const toggle = (id: number) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const txns = [
    { date: "17 Ago", desc: "Spotify Premium", cat: "Assinaturas", amt: -9.99, status: "Pago" },
    { date: "16 Ago", desc: "Pagamento Freelance — Apex Co.", cat: "Receitas", amt: +1800.00, status: "Pago" },
    { date: "15 Ago", desc: "Supermercado Whole Foods", cat: "Alimentação", amt: -74.32, status: "Pago" },
    { date: "14 Ago", desc: "Faturamento Mensal AWS", cat: "Software", amt: -22.48, status: "Pendente" },
    { date: "13 Ago", desc: "Aluguel — Agosto", cat: "Moradia", amt: -1650.00, status: "Pago" },
  ];

  const goals = [
    { label: "Fundo de Emergência", pct: 68, days: 42, color: "#315d68" },
    { label: "Ler 12 Livros", pct: 66, days: 137, color: "#4a9d6a" },
    { label: "Novo MacBook Pro", pct: 45, days: 21, color: "#d4914a" },
  ];

  const catColors: Record<string, string> = {
    Assinaturas: "#9495a8", Receitas: "#4a9d6a", Alimentação: "#d4914a",
    Software: "#315d68", Moradia: "#e05252",
  };

  return (
    <div>
      <TopBar title="Painel" />

      {/* Cartões Métricos */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {/* Card 1 */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={labelStyle}>Saldo Total</p>
              <p style={{ ...bigNumStyle, marginBottom: 6 }}>$14.820<span style={{ fontSize: 20 }}>,00</span></p>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ color: "#4a9d6a", display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 600 }}>
                  <IconTrendUp /> +8.4%
                </span>
                <span style={{ fontSize: 11, color: "#9495a8" }}>vs último mês</span>
              </div>
            </div>
            <Sparkline data={[12100, 12800, 13200, 12900, 13800, 14100, 14500, 14820]} />
          </div>
        </Card>

        {/* Card 2 */}
        <Card>
          <p style={labelStyle}>Fluxo de Caixa Mensal</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "#9495a8" }}>Receitas</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#4a9d6a", fontFamily: "'DM Mono', monospace" }}>$5.200</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 11, color: "#9495a8" }}>Despesas</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#e05252", fontFamily: "'DM Mono', monospace" }}>$2.840</p>
            </div>
          </div>
          <div style={{ position: "relative", height: 6, background: "rgba(148,149,168,0.12)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "100%", background: "#4a9d6a", borderRadius: 3 }} />
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(2840 / 5200) * 100}%`, background: "#e05252", borderRadius: 3 }} />
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "#9495a8" }}>Líquido: <span style={{ color: "#4a9d6a", fontWeight: 600 }}>+$2.360</span> este mês</p>
        </Card>

        {/* Card 3 */}
        <Card>
          <p style={labelStyle}>Metas Ativas</p>
          <p style={{ ...bigNumStyle, marginBottom: 4 }}>4 <span style={{ fontSize: 16, fontWeight: 400, color: "#9495a8" }}>em andamento</span></p>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(229,82,82,0.15)", border: "1px solid rgba(229,82,82,0.3)", borderRadius: 5, padding: "3px 9px", fontSize: 11.5, color: "#e05252", fontWeight: 500 }}>
              1 vence esta semana
            </span>
            <span style={{ background: "rgba(74,157,106,0.15)", border: "1px solid rgba(74,157,106,0.3)", borderRadius: 5, padding: "3px 9px", fontSize: 11.5, color: "#4a9d6a", fontWeight: 500 }}>
              2 no prazo
            </span>
          </div>
        </Card>
      </div>

      {/* Grelha Principal */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
        {/* Esquerda */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Gráfico */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#dcd6dc" }}>Visão Geral Financeira Mensal</p>
              <span style={{ fontSize: 11, color: "#9495a8", fontFamily: "'DM Mono', monospace" }}>Jan – Ago 2026</span>
            </div>
            <AreaChart income={incomeData} expenses={expensesData} />
          </Card>

          {/* Tarefas */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#dcd6dc" }}>Tarefas em Foco Hoje</p>
              <span style={{ fontSize: 11, color: "#9495a8" }}>{tasks.filter(t => t.done).length}/{tasks.length} concluídas</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tasks.map(t => (
                <div key={t.id} onClick={() => toggle(t.id)} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 8,
                  background: "rgba(148,149,168,0.04)",
                  border: "1px solid rgba(148,149,168,0.1)",
                  cursor: "pointer", transition: "background 0.15s",
                  opacity: t.done ? 0.55 : 1,
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(148,149,168,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(148,149,168,0.04)")}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: 5, border: "1.5px solid",
                    borderColor: t.done ? "#315d68" : "rgba(148,149,168,0.35)",
                    background: t.done ? "#315d68" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.15s",
                  }}>
                    {t.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dcd6dc" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, color: "#dcd6dc", textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
                  <PriorityBadge level={t.priority} />
                  <Badge label={t.tag} color="#315d68" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Direita */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Metas */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#dcd6dc" }}>Próximas Metas</p>
              <span style={{ color: "#9495a8", display: "flex" }}><IconArrowRight /></span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {goals.map(g => (
                <div key={g.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "#dcd6dc", fontWeight: 500 }}>{g.label}</span>
                    <span style={{
                      background: "rgba(49,93,104,0.25)", border: "1px solid rgba(49,93,104,0.4)",
                      borderRadius: 4, padding: "1px 6px", fontSize: 10.5,
                      color: "#9495a8", fontFamily: "'DM Mono', monospace",
                      display: "flex", alignItems: "center", gap: 3,
                    }}>
                      <IconClock /> {g.days}d restantes
                    </span>
                  </div>
                  <ProgressBar value={g.pct} color={g.color} height={5} />
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9495a8" }}>{g.pct}% concluído</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Transações */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#dcd6dc" }}>Transações Recentes</p>
              <span style={{ fontSize: 11, color: "#315d68", cursor: "pointer" }}>Ver tudo</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {txns.map((t, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "9px 0", borderBottom: i < txns.length - 1 ? "1px solid rgba(148,149,168,0.08)" : "none",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 12.5, color: "#dcd6dc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <span style={{ fontSize: 10.5, color: "#9495a8", fontFamily: "'DM Mono', monospace" }}>{t.date}</span>
                      <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#9495a8", opacity: 0.4 }} />
                      <span style={{
                        fontSize: 10, color: catColors[t.cat] || "#9495a8",
                        background: (catColors[t.cat] || "#9495a8") + "22",
                        padding: "1px 5px", borderRadius: 3,
                      }}>{t.cat}</span>
                    </div>
                  </div>
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500,
                    color: t.amt > 0 ? "#4a9d6a" : "#dcd6dc",
                    marginLeft: 8,
                  }}>
                    {t.amt > 0 ? "+" : ""}
                    {t.amt.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Financials View ──────────────────────────────────────────────────────────

function FinancialsView() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Tudo");

  const accounts = [
    { label: "Conta Corrente", amount: 6820.44, change: "+$240", bank: "Banco Chase", color: "#315d68" },
    { label: "Fundo de Emergência", amount: 5400.00, change: "+$200", bank: "Poupança de Alto Rendimento", color: "#4a9d6a" },
    { label: "Carteira de Investimentos", amount: 2599.56, change: "+$184", bank: "Fidelity", color: "#d4914a" },
  ];

  const txns = [
    { date: "17 Ago", desc: "Spotify Premium", cat: "Assinaturas", account: "Corrente", amt: -9.99, status: "Pago" },
    { date: "16 Ago", desc: "Pagamento Freelance — Apex Co.", cat: "Receitas", account: "Corrente", amt: +1800.00, status: "Pago" },
    { date: "15 Ago", desc: "Supermercado Whole Foods", cat: "Alimentação", account: "Corrente", amt: -74.32, status: "Pago" },
    { date: "14 Ago", desc: "Faturamento Mensal AWS", cat: "Software", account: "Corrente", amt: -22.48, status: "Pendente" },
    { date: "13 Ago", desc: "Aluguel — Agosto", cat: "Moradia", account: "Corrente", amt: -1650.00, status: "Pago" },
    { date: "12 Ago", desc: "Fidelity Auto-Investimento", cat: "Investimentos", account: "Investimento", amt: -300.00, status: "Pago" },
    { date: "11 Ago", desc: "Conta de Luz", cat: "Utilidades", account: "Corrente", amt: -88.60, status: "Pago" },
    { date: "10 Ago", desc: "Depósito de Salário", cat: "Receitas", account: "Corrente", amt: +3400.00, status: "Pago" },
    { date: "09 Ago", desc: "Transferência Fundo de Emergência", cat: "Poupança", account: "Poupança", amt: +200.00, status: "Pago" },
    { date: "08 Ago", desc: "Netflix", cat: "Assinaturas", account: "Corrente", amt: -15.49, status: "Pago" },
  ];

  const cats = ["Tudo", "Receitas", "Moradia", "Alimentação", "Assinaturas", "Software", "Investimentos", "Utilidades", "Poupança"];
  const catColors: Record<string, string> = { Receitas: "#4a9d6a", Moradia: "#e05252", Alimentação: "#d4914a", Assinaturas: "#9495a8", Software: "#315d68", Investimentos: "#a78bfa", Utilidades: "#60a5fa", Poupança: "#34d399" };

  const filtered = txns.filter(t =>
    (cat === "Tudo" || t.cat === cat) &&
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <TopBar title="Financeiro" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {accounts.map(a => (
          <Card key={a.label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={labelStyle}>{a.label}</p>
                <p style={{ ...bigNumStyle, fontSize: 26 }}>${a.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#4a9d6a" }}>{a.change} este mês</p>
              </div>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: a.color, marginTop: 4 }} />
            </div>
            <p style={{ margin: "10px 0 0", fontSize: 11, color: "#9495a8" }}>{a.bank}</p>
          </Card>
        ))}
      </div>

      {/* Barra de filtros */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(148,149,168,0.06)", border: "1px solid rgba(148,149,168,0.15)", borderRadius: 7, padding: "7px 12px", flex: 1, minWidth: 160 }}>
            <IconSearch />
            <input placeholder="Buscar transações..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: "none", border: "none", outline: "none", color: "#dcd6dc", fontSize: 13, width: "100%", fontFamily: "'Inter', sans-serif" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(148,149,168,0.06)", border: "1px solid rgba(148,149,168,0.15)", borderRadius: 7, padding: "7px 12px", color: "#9495a8", fontSize: 13, cursor: "pointer" }}>
            <IconFilter /> <span>Ago 2026</span> <IconChevronDown />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: "5px 12px", borderRadius: 6, border: "1px solid",
                borderColor: cat === c ? "#315d68" : "rgba(148,149,168,0.2)",
                background: cat === c ? "rgba(49,93,104,0.3)" : "transparent",
                color: cat === c ? "#dcd6dc" : "#9495a8",
                fontSize: 12, cursor: "pointer", transition: "all 0.15s",
              }}>{c}</button>
            ))}
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 5, background: "#315d68", border: "none", borderRadius: 7, padding: "8px 14px", color: "#dcd6dc", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <IconPlus /> Nova
          </button>
        </div>
      </Card>

      {/* Tabela */}
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Data", "Descrição", "Categoria", "Conta", "Valor", "Status"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: h === "Valor" ? "right" : "left", fontSize: 11, color: "#9495a8", fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", borderBottom: "1px solid rgba(148,149,168,0.12)", fontFamily: "'DM Mono', monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(148,149,168,0.07)", transition: "background 0.1s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(148,149,168,0.04)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "11px 12px", fontSize: 12, color: "#9495a8", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>{t.date}</td>
                <td style={{ padding: "11px 12px", fontSize: 13, color: "#dcd6dc" }}>{t.desc}</td>
                <td style={{ padding: "11px 12px" }}>
                  <span style={{ background: (catColors[t.cat] || "#9495a8") + "22", color: catColors[t.cat] || "#9495a8", border: `1px solid ${(catColors[t.cat] || "#9495a8")}44`, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 500 }}>{t.cat}</span>
                </td>
                <td style={{ padding: "11px 12px", fontSize: 12, color: "#9495a8" }}>{t.account}</td>
                <td style={{ padding: "11px 12px", textAlign: "right", fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, color: t.amt > 0 ? "#4a9d6a" : "#dcd6dc" }}>
                  {t.amt > 0 ? "+" : ""}{t.amt.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </td>
                <td style={{ padding: "11px 12px" }}>
                  <span style={{
                    background: t.status === "Pago" ? "rgba(74,157,106,0.15)" : "rgba(212,145,74,0.15)",
                    color: t.status === "Pago" ? "#4a9d6a" : "#d4914a",
                    border: `1px solid ${t.status === "Pago" ? "rgba(74,157,106,0.3)" : "rgba(212,145,74,0.3)"}`,
                    borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 500,
                  }}>{t.status}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "#9495a8", fontSize: 13 }}>Nenhuma transação corresponde aos seus filtros.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Goals View ───────────────────────────────────────────────────────────────

function GoalsView() {
  const [filter, setFilter] = useState<GoalFilter>("all");

  type Goal = {
    title: string; cat: string; catColor: string; deadline: string; current: number;
    target: number; unit: string; pct: number; status: GoalFilter;
    milestones: { label: string; done: boolean }[];
  };

  const goals: Goal[] = [
    {
      title: "Fundo de Emergência", cat: "Financeira", catColor: "#315d68",
      deadline: "31 Out, 2026", current: 5400, target: 8000, unit: "$",
      pct: 68, status: "financial",
      milestones: [
        { label: "$2.000 economizados", done: true }, { label: "$4.000 economizados", done: true },
        { label: "$6.000 economizados", done: false }, { label: "$8.000 economizados", done: false },
      ],
    },
    {
      title: "Ler 12 Livros em 2026", cat: "Marco", catColor: "#a78bfa",
      deadline: "31 Dez, 2026", current: 8, target: 12, unit: "livros",
      pct: 66, status: "milestone",
      milestones: [
        { label: "4 livros lidos", done: true }, { label: "8 livros lidos", done: true },
        { label: "10 livros lidos", done: false }, { label: "12 livros lidos", done: false },
      ],
    },
    {
      title: "Novo MacBook Pro M4", cat: "Financeira", catColor: "#315d68",
      deadline: "07 Set, 2026", current: 1100, target: 2449, unit: "$",
      pct: 45, status: "financial",
      milestones: [
        { label: "$500 economizados", done: true }, { label: "$1.000 economizados", done: true },
        { label: "$1.500 economizados", done: false }, { label: "$2.449 economizados", done: false },
      ],
    },
    {
      title: "Correr uma Corrida de 10K", cat: "Marco", catColor: "#a78bfa",
      deadline: "15 Nov, 2026", current: 7, target: 10, unit: "km",
      pct: 70, status: "milestone",
      milestones: [
        { label: "Corrida de 5K concluída", done: true }, { label: "Corrida de 7K concluída", done: true },
        { label: "Dia da corrida de 10K", done: false },
      ],
    },
    {
      title: "Maximizar Roth IRA 2026", cat: "Financeira", catColor: "#315d68",
      deadline: "31 Dez, 2026", current: 4500, target: 7000, unit: "$",
      pct: 64, status: "financial",
      milestones: [
        { label: "$2.000 contribuídos", done: true }, { label: "$4.000 contribuídos", done: true },
        { label: "$7.000 contribuídos", done: false },
      ],
    },
    {
      title: "Lançar Projeto Paralelo v1.0", cat: "Marco", catColor: "#a78bfa",
      deadline: "30 Ago, 2026", current: 1, target: 1, unit: "lançamento",
      pct: 100, status: "completed",
      milestones: [
        { label: "MVP construído", done: true }, { label: "Testadores beta", done: true },
        { label: "v1.0 lançado", done: true },
      ],
    },
  ];

  const filters: { id: GoalFilter; label: string }[] = [
    { id: "all", label: "Tudo" }, { id: "inprogress", label: "Em Andamento" },
    { id: "financial", label: "Financeiras" }, { id: "milestone", label: "Marcos" },
    { id: "completed", label: "Concluídas" },
  ];

  const visible = goals.filter(g => {
    if (filter === "all") return true;
    if (filter === "inprogress") return g.pct < 100;
    if (filter === "completed") return g.pct === 100;
    return g.status === filter;
  });

  return (
    <div>
      <TopBar title="Metas" />

      {/* Abas de filtro */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, padding: "4px", background: "rgba(148,149,168,0.06)", borderRadius: 10, width: "fit-content", border: "1px solid rgba(148,149,168,0.12)" }}>
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: "7px 16px", borderRadius: 7, border: "none",
            background: filter === f.id ? "#315d68" : "transparent",
            color: filter === f.id ? "#dcd6dc" : "#9495a8",
            fontSize: 13, fontWeight: filter === f.id ? 600 : 400,
            cursor: "pointer", transition: "all 0.15s",
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {visible.map(g => <GoalCard key={g.title} goal={g} />)}
      </div>
    </div>
  );
}

function GoalCard({ goal }: { goal: { title: string; cat: string; catColor: string; deadline: string; current: number; target: number; unit: string; pct: number; milestones: { label: string; done: boolean }[] } }) {
  const [expanded, setExpanded] = useState(false);
  const isCompleted = goal.pct >= 100;
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#dcd6dc", lineHeight: 1.3 }}>{goal.title}</h3>
        <Badge label={goal.cat} color={goal.catColor} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11.5, color: "#9495a8", display: "flex", alignItems: "center", gap: 4 }}>
          <IconClock /> {goal.deadline}
        </span>
        {isCompleted && <Badge label="Concluída" color="#4a9d6a" textColor="#4a9d6a" />}
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#dcd6dc" }}>
            {goal.unit === "$" ? `$${goal.current.toLocaleString()}` : goal.current} {goal.unit !== "$" ? goal.unit : ""}
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#9495a8" }}>
            / {goal.unit === "$" ? `$${goal.target.toLocaleString()}` : `${goal.target} ${goal.unit}`}
          </span>
        </div>
        <ProgressBar value={goal.pct} color={isCompleted ? "#4a9d6a" : "#315d68"} height={7} />
        <p style={{ margin: "5px 0 0", fontSize: 11, color: "#9495a8" }}>{goal.pct}% concluído</p>
      </div>

      <button onClick={() => setExpanded(e => !e)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(148,149,168,0.05)", border: "1px solid rgba(148,149,168,0.1)",
        borderRadius: 6, padding: "7px 10px", cursor: "pointer",
        color: "#9495a8", fontSize: 12, width: "100%",
      }}>
        <span>Marcos ({goal.milestones.filter(m => m.done).length}/{goal.milestones.length} concluídos)</span>
        <span style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}><IconChevronDown /></span>
      </button>

      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {goal.milestones.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 16, height: 16, borderRadius: 4, border: "1.5px solid",
                borderColor: m.done ? "#4a9d6a" : "rgba(148,149,168,0.3)",
                background: m.done ? "rgba(74,157,106,0.2)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {m.done && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#4a9d6a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
              </div>
              <span style={{ fontSize: 12, color: m.done ? "#9495a8" : "#dcd6dc", textDecoration: m.done ? "line-through" : "none" }}>{m.label}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ─── Tasks View ───────────────────────────────────────────────────────────────

type Task = { id: number; text: string; priority: "Alta" | "Média" | "Baixa"; done: boolean; due: string; goal?: string; group: string; kanban: string };

function TasksView() {
  const [viewMode, setViewMode] = useState<TaskView>("list");
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Revisar alocação de investimentos do T3", priority: "Alta", done: false, due: "18 Ago", goal: "Roth IRA", group: "Hoje", kanban: "todo" },
    { id: 2, text: "Enviar fatura de freelancer #2024-08", priority: "Alta", done: false, due: "18 Ago", group: "Hoje", kanban: "todo" },
    { id: 3, text: "Concluir leitura — Hábitos Atômicos caps. 7–9", priority: "Média", done: false, due: "19 Ago", goal: "Ler 12 Livros", group: "Próximos 7 Dias", kanban: "inprogress" },
    { id: 4, text: "Agendar treino de corrida 10K (7km)", priority: "Média", done: false, due: "20 Ago", goal: "Correr 10K", group: "Próximos 7 Dias", kanban: "inprogress" },
    { id: 5, text: "Transferir $200 para o fundo de emergência", priority: "Alta", done: false, due: "21 Ago", goal: "Fundo de Emergência", group: "Próximos 7 Dias", kanban: "todo" },
    { id: 6, text: "Agendar consulta de check-up de saúde anual", priority: "Baixa", done: false, due: "22 Ago", group: "Próximos 7 Dias", kanban: "todo" },
    { id: 7, text: "Planejar alocação do orçamento de setembro", priority: "Média", done: false, due: "01 Set", group: "Mais Tarde", kanban: "todo" },
    { id: 8, text: "Pesquisar ofertas do MacBook Pro M4", priority: "Baixa", done: false, due: "05 Set", goal: "Novo MacBook", group: "Mais Tarde", kanban: "todo" },
    { id: 9, text: "Criar roadmap financeiro de 2027", priority: "Média", done: false, due: "15 Set", group: "Mais Tarde", kanban: "todo" },
    { id: 10, text: "Atualizar perfil do LinkedIn", priority: "Baixa", done: true, due: "16 Ago", group: "Hoje", kanban: "done" },
  ]);

  const toggle = (id: number) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const groups = ["Hoje", "Próximos 7 Dias", "Mais Tarde"];
  const kanbanCols = [
    { id: "todo", label: "A Fazer", color: "#9495a8" },
    { id: "inprogress", label: "Em Andamento", color: "#d4914a" },
    { id: "done", label: "Concluído", color: "#4a9d6a" },
  ];

  return (
    <div>
      <TopBar title="Tarefas / A Fazer" />

      {/* Alternância de Visualização */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 2, background: "rgba(148,149,168,0.06)", border: "1px solid rgba(148,149,168,0.12)", borderRadius: 9, padding: 3 }}>
          {[{ mode: "list" as TaskView, icon: <IconList />, label: "Lista" }, { mode: "kanban" as TaskView, icon: <IconKanban />, label: "Kanban" }].map(({ mode, icon, label }) => (
            <button key={mode} onClick={() => setViewMode(mode)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 7, border: "none",
              background: viewMode === mode ? "#315d68" : "transparent",
              color: viewMode === mode ? "#dcd6dc" : "#9495a8",
              fontSize: 13, fontWeight: viewMode === mode ? 600 : 400,
              cursor: "pointer", transition: "all 0.15s",
            }}>{icon} {label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, fontSize: 12, color: "#9495a8" }}>
          <span>{tasks.filter(t => !t.done).length} restantes</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ color: "#4a9d6a" }}>{tasks.filter(t => t.done).length} concluídas</span>
        </div>
      </div>

      {viewMode === "list" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {groups.map(g => {
            const groupTasks = tasks.filter(t => t.group === g);
            return (
              <div key={g}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#9495a8", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>{g}</span>
                  <span style={{ background: "rgba(148,149,168,0.12)", borderRadius: 10, padding: "1px 7px", fontSize: 11, color: "#9495a8" }}>{groupTasks.length}</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(148,149,168,0.1)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {groupTasks.map(t => (
                    <div key={t.id} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "11px 14px", borderRadius: 9,
                      background: "rgba(4,70,67,0.5)", border: "1px solid rgba(148,149,168,0.1)",
                      opacity: t.done ? 0.5 : 1, transition: "opacity 0.15s",
                    }}>
                      <div onClick={() => toggle(t.id)} style={{
                        width: 18, height: 18, borderRadius: 5, border: "1.5px solid",
                        borderColor: t.done ? "#315d68" : "rgba(148,149,168,0.35)",
                        background: t.done ? "#315d68" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, cursor: "pointer", transition: "all 0.15s",
                      }}>
                        {t.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dcd6dc" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                      </div>
                      <span style={{ flex: 1, fontSize: 13, color: "#dcd6dc", textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
                        <PriorityBadge level={t.priority} />
                        {t.goal && <Badge label={t.goal} color="#315d68" />}
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9495a8", fontFamily: "'DM Mono', monospace" }}>
                          <IconClock /> {t.due}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {kanbanCols.map(col => {
            const colTasks = tasks.filter(t => t.kanban === col.id);
            return (
              <div key={col.id} style={{ background: "rgba(148,149,168,0.04)", border: "1px solid rgba(148,149,168,0.1)", borderRadius: 12, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#dcd6dc", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>{col.label}</span>
                  <span style={{ background: "rgba(148,149,168,0.12)", borderRadius: 10, padding: "1px 7px", fontSize: 11, color: "#9495a8", marginLeft: "auto" }}>{colTasks.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {colTasks.map(t => (
                    <div key={t.id} style={{
                      background: "#044643", border: "1px solid rgba(148,149,168,0.12)",
                      borderRadius: 8, padding: 12,
                    }}>
                      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#dcd6dc", lineHeight: 1.4 }}>{t.text}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <PriorityBadge level={t.priority} />
                        {t.goal && <Badge label={t.goal} color="#315d68" />}
                      </div>
                      <p style={{ margin: "8px 0 0", fontSize: 11, color: "#9495a8", fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 4 }}>
                        <IconClock /> {t.due}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Shared Card ─────────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "#044643",
      border: "1px solid rgba(148,149,168,0.13)",
      borderRadius: 12,
      padding: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  margin: "0 0 4px",
  fontSize: 11.5,
  color: "#9495a8",
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  fontFamily: "'DM Mono', monospace",
};

const bigNumStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 30,
  fontWeight: 700,
  color: "#dcd6dc",
  letterSpacing: "-0.02em",
  fontFamily: "'DM Mono', monospace",
};

// ─── Raiz do App ──────────────────────────────────────────────────────────────

const viewTitles: Record<View, string> = {
  dashboard: "Painel",
  financials: "Financeiro",
  goals: "Metas",
  tasks: "Tarefas e A Fazer",
};

export default function App() {
  const [view, setView] = useState<View>("dashboard");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#032228" }}>
      <Sidebar active={view} onNav={setView} />
      <main style={{
        marginLeft: 260,
        flex: 1,
        padding: "32px 36px",
        overflowY: "auto",
        minHeight: "100vh",
      }}>
        {view === "dashboard" && <DashboardView />}
        {view === "financials" && <FinancialsView />}
        {view === "goals" && <GoalsView />}
        {view === "tasks" && <TasksView />}
      </main>
    </div>
  );
}
