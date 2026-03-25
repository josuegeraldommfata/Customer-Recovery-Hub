import { useState } from "react";
import { Link } from "wouter";
import { Bot, CheckCircle2, TrendingUp, MessageSquare, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Mini",
    price: "399",
    description: "Por cada Agente de IA",
    features: [
      "Crie a IA da sua empresa", "Agentes de IA whitelabel", "Treine a IA com seu Prompt",
      "Incorpore sua IA no seu site", "Até 1 Agente IA personalizado", "Até 1 Widget: Embed e Web",
      "OpenAI, Anthropic e Gemini", "IA responde no WhatsApp", "Integração com Meta / Z-API",
      "IA responde comentarios no Insta", "IA envia DM no Instagram", "AI Analytics - Dashboard",
      "Encaminhar para humano", "Dashboard com conversas", "Até 1 Dataset (Até 50GB)",
      "Treine sua IA com PDF e Imagens"
    ]
  },
  {
    name: "Starter",
    price: "990",
    popular: true,
    description: "Por cada Agente de IA",
    features: [
      "Crie a IA da sua empresa", "Agentes de IA whitelabel", "Treine a IA com seu Prompt",
      "Incorpore sua IA no seu site", "Até 3 Agentes IA personalizados", "Até 3 Widgets: Embed e Web",
      "OpenAI, Anthropic e Gemini", "IA responde no WhatsApp", "Integração com Meta / Z-API",
      "IA responde comentarios no Insta", "IA envia DM no Instagram", "Integração com Toolzz Chat",
      "AI Analytics - Dashboard", "Encaminhar para humano", "Dashboard com conversas",
      "Até 3 Datasets (Até 150GB)", "Treinar IA com Youtube/Web", "Treine sua IA com PDF e Imagens",
      "1000 minutos do Agente de Voz", "Agente de Voz e Ligação"
    ]
  },
  {
    name: "Enterprise",
    price: "Consultivo",
    subprice: "a partir de R$ 3.900 / mês",
    description: "Solução completa para grandes operações",
    features: [
      "Mais de 5 Agentes IA", "Múltiplos Canais e Widgets", "OpenAI, Anthropic e Gemini",
      "Integrações Customizadas (API)", "Suporte Dedicado 24/7", "SLA Garantido",
      "Treinamento com bases de dados massivas", "Add-on AI Store (Venda sua IA)",
      "Integração com ElevenLabs avançada", "Integração com ERP/CRM Nativa",
      "Consultoria de Implementação"
    ]
  }
];

function PricingCard({ plan }) {
  const [expanded, setExpanded] = useState(false);
  const displayFeatures = expanded ? plan.features : plan.features.slice(0, 6);

  return (
    <div className={`
      relative p-8 rounded-3xl border flex flex-col h-full
      ${plan.popular
        ? 'bg-card border-emerald-500/50 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]'
        : 'bg-card/50 border-white/10 backdrop-blur-sm'}
    `}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          Mais Popular
        </div>
      )}

      <h3 className="text-2xl font-display font-bold text-foreground">{plan.name}</h3>
      <p className="text-muted-foreground mt-2 text-sm">{plan.description}</p>

      <div className="mt-6 mb-8">
        {plan.price === "Consultivo" ? (
          <div>
            <span className="text-4xl font-bold font-display text-white">{plan.price}</span>
            <div className="text-sm text-muted-foreground mt-1">{plan.subprice}</div>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-medium text-muted-foreground">R$</span>
            <span className="text-5xl font-bold font-display text-white">{plan.price}</span>
            <span className="text-muted-foreground">/mês</span>
          </div>
        )}
      </div>

      {plan.price === "Consultivo" ? (
        <button className="w-full py-4 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white mb-8">
          Falar com Comercial
        </button>
      ) : (
        <button className={`
          w-full py-4 rounded-xl font-semibold transition-all mb-8 shadow-lg
          ${plan.popular
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5'
            : 'bg-white text-background hover:bg-white/90'}
        `}>
          Teste 15 dias / Assinar
        </button>
      )}

      <div className="flex-1">
        <p className="font-medium text-sm text-white mb-4">Funcionalidades incluídas:</p>
        <ul className="space-y-3">
          {displayFeatures.map((feat, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        {plan.features.length > 6 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-6 flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            {expanded ? (
              <><ChevronUp className="w-4 h-4" /> Ver menos</>
            ) : (
              <><ChevronDown className="w-4 h-4" /> Ver mais {plan.features.length - 6} itens</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-2xl">
            <Bot size={28} />
            RecoverIA
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-muted-foreground hover:text-white font-medium transition-colors">
              Fazer Login
            </Link>
            <Link href="/login" className="px-5 py-2.5 rounded-full bg-white text-background font-semibold hover:bg-white/90 transition-colors">
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-glow.png`}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/60 backdrop-blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              A IA que trabalha enquanto você dorme
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight leading-tight mb-8">
              Recupere clientes perdidos no <span className="text-gradient">WhatsApp</span> automaticamente.
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Transforme vácuos em vendas. Nossa IA identifica clientes que pararam de responder e envia mensagens persuasivas no momento certo, reativando orçamentos esquecidos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all">
                Começar a recuperar agora
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all">
                Ver demonstração
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-white/5"
          >
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-white mb-2">R$ 2.4M+</div>
              <div className="text-muted-foreground">Receita recuperada este ano</div>
            </div>
            <div className="text-center border-y md:border-y-0 md:border-x border-white/5 py-8 md:py-0">
              <div className="text-4xl font-display font-bold text-white mb-2">12.000+</div>
              <div className="text-muted-foreground">Clientes reativados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-white mb-2">78%</div>
              <div className="text-muted-foreground">Taxa média de resposta</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Por que você está perdendo dinheiro?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sua equipe de vendas não tem tempo de fazer follow-up com todo mundo. Nossa automação cuida disso para você.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-card border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Foco em Receita</h3>
              <p className="text-muted-foreground">O dashboard não mostra apenas mensagens enviadas, mas sim quanto dinheiro exato a automação trouxe de volta pro seu caixa.</p>
            </div>
            <div className="p-8 rounded-3xl bg-card border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Timming Perfeito</h3>
              <p className="text-muted-foreground">Configure gatilhos inteligentes. Se o cliente não responde em 2 horas, a IA manda um áudio ou texto humanizado.</p>
            </div>
            <div className="p-8 rounded-3xl bg-card border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Mensagens Naturais</h3>
              <p className="text-muted-foreground">Esqueça robôs engessados. A IA simula a digitação e fala exatamente com o tom de voz da sua marca.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Planos que cabem no seu negócio
            </h2>
            <p className="text-xl text-muted-foreground">
              Comece a recuperar vendas hoje mesmo com nossa inteligência artificial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map(plan => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-card/20 text-center">
        <div className="flex items-center justify-center gap-2 text-emerald-400 font-display font-bold text-2xl mb-6">
          <Bot size={28} />
          RecoverIA
        </div>
        <p className="text-muted-foreground">© 2025 RecoverIA. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
