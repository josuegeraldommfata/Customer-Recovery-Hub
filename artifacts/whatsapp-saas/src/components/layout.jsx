import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Users,
  Bot,
  History,
  LogOut,
  Bell,
  WalletCards
} from "lucide-react";
import { motion } from "framer-motion";

function SidebarItem({ href, icon: Icon, label, isActive }) {
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

        <nav className="flex-1 px-4 space-y-1 mt-4">
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
          <div className="font-medium text-muted-foreground">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          <div className="flex items-center gap-6">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Plano {user?.plan || 'Pro'}
            </div>

            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
                {user?.name?.charAt(0) || 'C'}
              </div>
              <span className="font-medium text-sm hidden sm:block">{user?.name}</span>
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
    { href: "/admin/users", icon: Users, label: "Usuários" },
    { href: "/admin/plans", icon: WalletCards, label: "Planos & Preços" },
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

        <nav className="flex-1 px-4 space-y-1 mt-4">
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
