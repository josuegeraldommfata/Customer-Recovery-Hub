import { useAuth } from "@/hooks/use-auth";
import { useSubscriptionStatus } from "@/hooks/use-dashboard";
import { Link } from "wouter";
import { ShieldAlert, Zap, ArrowRight, RefreshCw } from "lucide-react";

export default function SubscriptionGuard({ children }) {
  const { user } = useAuth();
  const { data: sub, isLoading } = useSubscriptionStatus(user?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!sub) return children;

  // Assinatura expirada
  if (sub.isExpired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8">
          <ShieldAlert className="w-12 h-12 text-red-400" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-3">Assinatura Expirada</h2>
        <p className="text-muted-foreground max-w-md mb-2">
          Seu plano <span className="text-white font-medium">{sub.plan}</span> expirou. Renove agora para continuar recuperando clientes.
        </p>
        <p className="text-red-400 text-sm mb-8">
          Expirou em: {new Date(sub.expires_at).toLocaleDateString("pt-BR")}
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard/subscription">
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all">
              Renovar Agora <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
        <div className="mt-8 p-4 bg-card border border-border rounded-2xl text-left text-sm max-w-md">
          <p className="text-muted-foreground">Já renovou mas ainda aparece bloqueado?</p>
          <button onClick={() => window.location.reload()} className="mt-2 flex items-center gap-2 text-emerald-400 hover:text-emerald-300">
            <RefreshCw size={14} /> Atualizar página
          </button>
        </div>
      </div>
    );
  }

  // Tokens esgotados
  if (sub.isTokensExhausted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-24 h-24 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-8">
          <Zap className="w-12 h-12 text-yellow-400" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-3">Tokens Esgotados</h2>
        <p className="text-muted-foreground max-w-md mb-2">
          Você usou todos os <span className="text-white font-medium">{sub.tokensUsed} tokens</span> do seu plano {sub.plan}.
        </p>
        <p className="text-yellow-400 text-sm mb-8">Compre mais tokens para continuar enviando mensagens.</p>
        <Link href="/dashboard/subscription">
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-400 text-black font-bold flex items-center gap-2 shadow-lg hover:-translate-y-0.5 transition-all">
            <Zap className="w-5 h-5" /> Comprar Mais Tokens
          </button>
        </Link>
      </div>
    );
  }

  return children;
}
