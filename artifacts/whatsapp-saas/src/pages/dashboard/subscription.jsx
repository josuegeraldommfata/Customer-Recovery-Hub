import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscriptionStatus } from "@/hooks/use-dashboard";
import { CheckCircle2, X, Zap, ArrowRight, CreditCard, ShieldCheck, Loader2, ExternalLink } from "lucide-react";

const PLANS = [
  {
    id: "mini",
    name: "Mini",
    price: 399,
    tokens: "5.000 tokens/mês",
    features: ["1 Agente IA", "WhatsApp integrado", "Dashboard analytics", "Suporte por email"],
    color: "border-slate-500/40",
    badge: null,
  },
  {
    id: "starter",
    name: "Starter",
    price: 990,
    tokens: "15.000 tokens/mês",
    features: ["3 Agentes IA", "WhatsApp + Instagram", "Agente de Voz", "Suporte prioritário"],
    color: "border-emerald-500/50",
    badge: "Mais Popular",
    badgeColor: "from-emerald-500 to-cyan-500",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    label: "Consultivo",
    subPrice: "a partir de R$ 3.900/mês",
    tokens: "Tokens ilimitados",
    features: ["Agentes ilimitados", "Todos os canais", "SLA garantido", "Suporte dedicado 24/7"],
    color: "border-blue-500/40",
    badge: null,
  },
  {
    id: "tokens_extra",
    name: "+5.000 Tokens",
    price: 149,
    label: "Recarga",
    tokens: "Pacote avulso",
    features: ["5.000 tokens extras", "Sem renovação", "Uso imediato", "Não expira"],
    color: "border-purple-500/40",
    badge: "Mais Comprado",
    badgeColor: "from-purple-500 to-pink-500",
  },
];

function CheckoutModal({ plan, onClose }) {
  const [step, setStep] = useState("confirm"); // confirm → loading → redirect

  const handleCheckout = () => {
    setStep("loading");
    setTimeout(() => setStep("redirect"), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-muted-foreground hover:text-white"><X size={20} /></button>

        {step === "confirm" && (
          <div className="space-y-6">
            <div>
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">Checkout Seguro</div>
              <h3 className="text-2xl font-display font-bold text-white">Confirmar Pedido</h3>
            </div>

            <div className="bg-background border border-border rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-medium">{plan.label || plan.name}</span>
                <span className="font-bold text-emerald-400">
                  {plan.price ? `R$ ${plan.price.toLocaleString("pt-BR")}` : "Consultivo"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">{plan.tokens}</div>
              <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                <span className="text-muted-foreground">Período</span>
                <span className="text-white">{plan.id === "tokens_extra" ? "Avulso" : "Mensal"}</span>
              </div>
            </div>

            <div className="space-y-3">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2 text-sm text-emerald-400">
              <ShieldCheck size={16} />
              Pagamento processado com segurança via Mercado Pago
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all"
            >
              <CreditCard size={20} />
              Pagar com Mercado Pago
            </button>
          </div>
        )}

        {step === "loading" && (
          <div className="py-12 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
            <p className="text-white font-medium">Gerando link de pagamento...</p>
            <p className="text-muted-foreground text-sm">Conectando ao Mercado Pago</p>
          </div>
        )}

        {step === "redirect" && (
          <div className="py-8 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="text-xl font-bold text-white">Link Gerado!</h4>
            <p className="text-muted-foreground text-sm">
              Você será redirecionado para o checkout seguro do Mercado Pago para concluir o pagamento.
            </p>
            <div className="w-full bg-background border border-border rounded-xl p-3 font-mono text-xs text-muted-foreground truncate">
              https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=mock-{plan.id}-{Date.now()}
            </div>
            <button
              onClick={() => { window.open("https://www.mercadopago.com.br", "_blank"); onClose(); }}
              className="w-full py-3 rounded-xl bg-[#009ee3] text-white font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
            >
              <ExternalLink size={18} />
              Ir para o Checkout
            </button>
            <button onClick={onClose} className="text-sm text-muted-foreground hover:text-white">
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClientSubscription() {
  const { user } = useAuth();
  const { data: sub, isLoading } = useSubscriptionStatus(user?.id);
  const [selectedPlan, setSelectedPlan] = useState(null);

  if (isLoading || !sub) return (
    <div className="animate-pulse space-y-6">
      <div className="h-48 bg-card rounded-3xl" />
      <div className="h-80 bg-card rounded-3xl" />
    </div>
  );

  const daysColor = sub.daysRemaining <= 3 ? "text-red-400" : sub.daysRemaining <= 7 ? "text-yellow-400" : "text-emerald-400";
  const tokensColor = sub.tokensPercent >= 90 ? "text-red-400" : sub.tokensPercent >= 70 ? "text-yellow-400" : "text-emerald-400";
  const barColor = sub.tokensPercent >= 90 ? "from-red-500 to-red-400" : sub.tokensPercent >= 70 ? "from-yellow-500 to-orange-400" : "from-emerald-500 to-cyan-400";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Plano & Assinatura</h2>
        <p className="text-muted-foreground mt-1">Acompanhe seu uso e faça upgrade quando precisar.</p>
      </div>

      {/* Status card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-emerald p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Plano Atual</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              sub.status === "Ativo" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
              sub.status === "Expirado" ? "bg-red-500/10 text-red-400 border-red-500/20" :
              "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
            }`}>{sub.status}</span>
          </div>
          <div className="text-4xl font-display font-bold text-white">{sub.plan}</div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Vencimento</span>
              <span className={`font-bold ${daysColor}`}>
                {sub.isExpired ? "EXPIRADO" : `${sub.daysRemaining} dias restantes`}
              </span>
            </div>
            {sub.expires_at && (
              <p className="text-xs text-muted-foreground">
                {sub.isExpired ? "Expirou em" : "Expira em"}: {new Date(sub.expires_at).toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl space-y-4">
          <span className="text-sm font-medium text-muted-foreground">Uso de Tokens</span>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-display font-bold ${tokensColor}`}>
              {sub.tokensUsed.toLocaleString("pt-BR")}
            </span>
            <span className="text-muted-foreground text-lg mb-1">
              / {sub.tokensLimit === "Ilimitado" || sub.tokensLimit === 999999 ? "∞" : sub.tokensLimit.toLocaleString("pt-BR")}
            </span>
          </div>
          {sub.tokensLimit !== "Ilimitado" && sub.tokensLimit !== 999999 && (
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>{sub.tokensPercent}% utilizado</span>
                <span className={tokensColor}>{100 - sub.tokensPercent}% disponível</span>
              </div>
              <div className="w-full bg-background rounded-full h-3 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${barColor} h-3 rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min(sub.tokensPercent, 100)}%` }}
                />
              </div>
            </div>
          )}
          {(sub.tokensLimit === "Ilimitado" || sub.tokensLimit === 999999) && (
            <p className="text-emerald-400 text-sm font-medium">✦ Tokens ilimitados incluídos</p>
          )}
        </div>
      </div>

      {/* CTA upgrade */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-display font-bold text-white mb-1">Precisa de mais poder?</h3>
          <p className="text-muted-foreground text-sm">Faça upgrade ou compre tokens extras para continuar recuperando clientes.</p>
        </div>
        <button
          onClick={() => document.getElementById("upgrade-section").scrollIntoView({ behavior: "smooth" })}
          className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg shadow-emerald-500/25"
        >
          <Zap size={18} /> Fazer Upgrade
        </button>
      </div>

      {/* Plans grid */}
      <div id="upgrade-section">
        <h3 className="text-xl font-display font-bold text-white mb-6">Escolha um Plano ou Pacote</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`relative bg-card border ${plan.color} p-6 rounded-3xl flex flex-col cursor-pointer hover:scale-[1.02] transition-transform`}
              onClick={() => setSelectedPlan(plan)}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.badgeColor} text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap`}>
                  {plan.badge}
                </div>
              )}
              <h4 className="font-display font-bold text-white text-xl mb-1">{plan.label || plan.name}</h4>
              <p className="text-xs text-muted-foreground mb-4">{plan.tokens}</p>

              {plan.price !== null ? (
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-muted-foreground text-sm">R$</span>
                  <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                  {plan.id !== "tokens_extra" && <span className="text-muted-foreground text-sm">/mês</span>}
                </div>
              ) : (
                <div className="mb-6">
                  <span className="text-2xl font-bold text-white">{plan.label}</span>
                  <p className="text-xs text-muted-foreground mt-1">{plan.subPrice}</p>
                </div>
              )}

              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedPlan(plan)}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  plan.id === "starter"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {plan.price === null ? "Falar com Comercial" : "Selecionar"} <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <CheckoutModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </div>
  );
}
