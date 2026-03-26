import { useAuth } from "@/hooks/use-auth";
import { useSubscriptionStatus } from "@/hooks/use-dashboard";
import { Link } from "wouter";
import { ShieldAlert, Zap, ArrowRight, RefreshCw, Clock, CheckCircle2 } from "lucide-react";

const PLANS_QUICK = [
  { name: "Mini", price: "R$ 399/mês", tokens: "5.000 tokens", color: "border-slate-500/30" },
  { name: "Starter", price: "R$ 990/mês", tokens: "15.000 tokens", color: "border-emerald-500/40 bg-emerald-500/5" },
  { name: "Enterprise", price: "Consultivo", tokens: "Ilimitado", color: "border-blue-500/30" },
];

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

  // Trial expirado
  if (sub.isExpired && sub.isTrial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
          <Clock className="w-12 h-12 text-amber-400" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold mb-4">
          Trial de 5 dias encerrado
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-3">Seu trial expirou</h2>
        <p className="text-muted-foreground max-w-lg mb-2">
          Esperamos que tenha aproveitado! Para continuar recuperando clientes, escolha um plano e comece a gerar resultados de verdade.
        </p>
        <p className="text-amber-400 text-sm mb-8">
          Expirou em: {new Date(sub.expires_at).toLocaleDateString("pt-BR")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full max-w-2xl">
          {PLANS_QUICK.map(plan => (
            <div key={plan.name} className={`bg-card border ${plan.color} p-4 rounded-2xl text-left`}>
              <div className="font-bold text-white mb-1">{plan.name}</div>
              <div className="text-emerald-400 font-bold text-sm mb-1">{plan.price}</div>
              <div className="text-xs text-muted-foreground">{plan.tokens}</div>
            </div>
          ))}
        </div>

        <Link href="/dashboard/subscription">
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all">
            Assinar um Plano <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
    );
  }

  // Assinatura expirada (plano pago)
  if (sub.isExpired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8">
          <ShieldAlert className="w-12 h-12 text-red-400" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-3">Assinatura Expirada</h2>
        <p className="text-muted-foreground max-w-md mb-2">
          Seu plano <span className="text-white font-medium">{sub.plan}</span> expirou. Renove para continuar.
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
        <button onClick={() => window.location.reload()} className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-white">
          <RefreshCw size={14} /> Já renovei, atualizar
        </button>
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
        <h2 className="text-3xl font-display font-bold text-white mb-3">
          {sub.isTrial ? "60 Tokens do Trial Esgotados" : "Tokens Esgotados"}
        </h2>
        <p className="text-muted-foreground max-w-md mb-2">
          {sub.isTrial
            ? "Você usou todos os tokens gratuitos do trial. Assine um plano para continuar."
            : `Você usou todos os ${sub.tokensUsed} tokens do plano ${sub.plan}.`
          }
        </p>
        <p className="text-yellow-400 text-sm mb-8">
          {sub.isTrial ? "Assine agora e comece com mais de 5.000 tokens." : "Compre mais tokens para continuar enviando."}
        </p>

        {sub.isTrial && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full max-w-2xl">
            {PLANS_QUICK.map(plan => (
              <div key={plan.name} className={`bg-card border ${plan.color} p-4 rounded-2xl text-left`}>
                <div className="font-bold text-white mb-1">{plan.name}</div>
                <div className="text-emerald-400 font-bold text-sm mb-1">{plan.price}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 size={10} /> {plan.tokens}
                </div>
              </div>
            ))}
          </div>
        )}

        <Link href="/dashboard/subscription">
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-400 text-black font-bold flex items-center gap-2 shadow-lg hover:-translate-y-0.5 transition-all">
            <Zap className="w-5 h-5" />
            {sub.isTrial ? "Assinar Plano" : "Comprar Mais Tokens"}
          </button>
        </Link>
      </div>
    );
  }

  return children;
}
