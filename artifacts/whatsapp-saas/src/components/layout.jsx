import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard, Users, Bot, History, LogOut, Bell,
  WalletCards, CreditCard, Smartphone, DollarSign, Settings, Wifi
} from "lucide-react";
import { motion } from "framer-motion";

function SidebarItem({ href, icon: Icon, label, isActive, badge }) {
  return (
    <Link href={href}>
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
        ${isActive
          ? 'bg-emerald-500/10 text-emerald-400 font-medium'
          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
        }
      `}>
        <Icon size={20} className={isActive ? "text-emerald-400" : ""} />
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">{badge}</span>
        )}
      </div>
    </Link>
  );
}

function AdminSidebarItem({ href, icon: Icon, label, isActive, highlight }) {
  return (
    <Link href={href}>
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
        ${isActive
          ? 'bg-blue-500/10 text-blue-400 font-medium'
          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
        }
        ${highlight && !isActive ? 'ring-1 ring-yellow-500/30' : ''}
      `}>
        <Icon size={20} className={isActive ? "text-blue-400" : highlight ? "text-yellow-400" : ""} />
        <span>{label}</span>
      </div>
    </Link>
  );
}

export function ClientLayout({ children }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const menu = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/contacts", icon: Users, label: "Contatos" },
    { href: "/dashboard/automation", icon: Bot, label: "Automação" },
    { href: "/dashboard/history", icon: History, label: "Histórico" },
    { href: "/dashboard/conexao", icon: Smartphone, label: "Conexão" },
    { href: "/dashboard/subscription", icon: CreditCard, label: "Plano & Tokens" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-2xl">
            <Bot size={28} />
            RecoverIA
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          {menu.map(item => (
            <SidebarItem
              key={item.href}
              {...item}
              isActive={location === item.href}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="font-medium text-muted-foreground text-sm hidden sm:block">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <Link href="/dashboard/conexao">
              <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${
                user?.whatsapp_connected
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                <Wifi size={11} />
                {user?.whatsapp_connected ? "WhatsApp ativo" : "Conectar WA"}
              </div>
            </Link>

            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {user?.plan || 'Pro'}
            </div>

            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20 text-sm">
                {user?.name?.charAt(0) || 'C'}
              </div>
              <span className="font-medium text-sm hidden sm:block truncate max-w-[120px]">{user?.name}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export function AdminLayout({ children }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const menu = [
    { href: "/admin", icon: LayoutDashboard, label: "Visão Geral" },
    { href: "/admin/users", icon: Users, label: "Clientes" },
    { href: "/admin/financeiro", icon: DollarSign, label: "Financeiro" },
    { href: "/admin/plans", icon: WalletCards, label: "Planos" },
    { href: "/admin/configuracoes", icon: Settings, label: "Configurações MP", highlight: true },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-blue-400 font-display font-bold text-2xl">
            <Bot size={28} />
            Admin Panel
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          {menu.map(item => (
            <AdminSidebarItem
              key={item.href}
              {...item}
              isActive={location === item.href}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10"
          >
            <LogOut size={20} />
            <span>Sair do Admin</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="font-medium text-muted-foreground">Admin Portal</div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              Acesso Total
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
