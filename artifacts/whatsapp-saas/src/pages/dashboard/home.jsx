import { useEffect, useState } from "react";
import { useDashboardMetrics, useSendBulkRecovery, useContacts } from "@/hooks/use-dashboard";
import { useAuth } from "@/hooks/use-auth";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, MessageSquare, AlertCircle, Flame, Zap, X, CheckCircle2, Send, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "wouter";

function RecoveryModal({ onClose, userId }) {
  const { data: contacts } = useContacts();
  const { mutate: sendBulk, isPending, isSuccess } = useSendBulkRecovery();
  const [selected, setSelected] = useState([]);
  const [sent, setSent] = useState(false);

  const inactiveContacts = contacts?.filter(c => c.status === "Não respondeu") || [];

  useEffect(() => {
    setSelected(inactiveContacts.map(c => c.id));
  }, [contacts]);

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleSend = () => {
    const toSend = inactiveContacts.filter(c => selected.includes(c.id));
    sendBulk({
      contacts: toSend,
      message: "Oi {nome}, vi que você não finalizou. Posso te ajudar com 10% de desconto? 😊",
      userId,
    }, {
      onSuccess: () => setSent(true),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-display font-bold text-white">Recuperação em Massa</h3>
            <p className="text-muted-foreground text-sm mt-1">{inactiveContacts.length} clientes sem resposta</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-white p-2"><X size={20} /></button>
        </div>

        {sent ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-emerald-400 w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">Mensagens Enviadas!</h4>
            <p className="text-muted-foreground text-sm">
              {selected.length} mensagem(s) disparada(s) com sucesso. Acompanhe em <Link href="/dashboard/history"><span className="text-emerald-400 underline cursor-pointer">Histórico</span></Link>.
            </p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-colors">
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4 pr-1">
              {inactiveContacts.map(c => (
                <label key={c.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selected.includes(c.id) ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-background border border-border hover:border-white/20"}`}>
                  <input
                    type="checkbox"
                    checked={selected.includes(c.id)}
                    onChange={() => toggle(c.id)}
                    className="accent-emerald-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.phone} · {c.lastInteraction}</div>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold shrink-0">
                    R$ {c.potentialValue.toLocaleString("pt-BR")}
                  </span>
                </label>
              ))}
            </div>

            <div className="bg-background border border-border rounded-xl p-3 mb-4 text-sm text-muted-foreground">
              <strong className="text-white">Mensagem que será enviada:</strong><br />
              "Oi [nome], vi que você não finalizou. Posso te ajudar com 10% de desconto? 😊"
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-muted-foreground hover:text-white hover:border-white/20 transition-colors text-sm">
                Cancelar
              </button>
              <button
                onClick={handleSend}
                disabled={isPending || selected.length === 0}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:-translate-y-0.5"
              >
                {isPending ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : <><Send size={16} /> Enviar para {selected.length}</>}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function ClientDashboardHome() {
  const { user } = useAuth();
  const { data: metrics, isLoading } = useDashboardMetrics();
  const [, setLocation] = useLocation();
  const [showWow, setShowWow] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowWow(true), 2500);
    const hideTimer = setTimeout(() => setShowWow(false), 8000);
    return () => { clearTimeout(timer); clearTimeout(hideTimer); };
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="animate-pulse flex flex-col gap-6">
        <div className="h-40 bg-card rounded-3xl" />
        <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-card rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <AnimatePresence>
        {showWow && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full glass-emerald text-emerald-400 font-bold flex items-center gap-3 shadow-2xl cursor-pointer"
            onClick={() => setLocation("/dashboard/history")}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">💰</div>
            + R$ 450,00 recuperados agora! (Fernanda Costa comprou)
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Revenue Card */}
      <div className="glass-emerald p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full" />
        <h2 className="text-emerald-400 font-medium text-lg mb-2">Receita Recuperada este mês</h2>
        <div className="flex items-end gap-4">
          <span className="text-6xl font-display font-bold text-white">
            R$ {metrics.revenueRecovered.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl font-medium mb-2">
            <TrendingUp size={18} />
            +{metrics.revenueGrowth}%
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-6 rounded-2xl hover:border-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl"><Users className="text-blue-400" size={24} /></div>
          </div>
          <div className="text-muted-foreground text-sm font-medium mb-1">Clientes Reativados</div>
          <div className="text-3xl font-display font-bold text-white flex items-baseline gap-2">
            {metrics.reactivatedClients}
            <span className="text-sm font-medium text-emerald-400">+{metrics.reactivatedGrowth}%</span>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl hover:border-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl"><MessageSquare className="text-purple-400" size={24} /></div>
          </div>
          <div className="text-muted-foreground text-sm font-medium mb-1">Tentativas de Recuperação</div>
          <div className="text-3xl font-display font-bold text-white">{metrics.recoveryAttempts}</div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl hover:border-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl"><TrendingUp className="text-emerald-400" size={24} /></div>
          </div>
          <div className="text-muted-foreground text-sm font-medium mb-1">Taxa de Recuperação</div>
          <div className="text-3xl font-display font-bold text-white">{metrics.recoveryRate}%</div>
        </div>

        <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-destructive/20 rounded-xl"><AlertCircle className="text-destructive" size={24} /></div>
          </div>
          <div className="text-destructive font-medium text-sm mb-1">Vendas que seriam perdidas</div>
          <div className="text-3xl font-display font-bold text-white">
            R$ {metrics.lostPotential.toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-bold text-xl text-white">Evolução Diária de Recuperação</h3>
            <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-muted-foreground outline-none cursor-pointer">
              <option>Últimos 7 dias</option>
              <option>Este mês</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Oportunidades */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Zap className="text-yellow-500" /> Oportunidades agora
          </h3>

          <div className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-2xl flex flex-col gap-4">
            <div className="flex gap-3 text-yellow-500 font-medium">
              <AlertCircle size={20} className="shrink-0" />
              <span>3 clientes não respondem há mais de 2h</span>
            </div>
            <button
              onClick={() => setShowRecoveryModal(true)}
              className="w-full py-2.5 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
            >
              <Send size={16} /> Recuperar agora
            </button>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex flex-col gap-4">
            <div className="flex gap-3 text-red-400 font-medium">
              <Flame size={20} className="shrink-0" />
              <span>Clientes QUENTES sumiram no orçamento</span>
            </div>
            <button
              onClick={() => setLocation("/dashboard/contacts")}
              className="w-full py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-xl hover:bg-red-500/30 transition-colors"
            >
              Ver conversas
            </button>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl">
            <div className="text-sm font-medium text-white mb-3 flex justify-between">
              <span>Desempenho Semanal</span>
              <span className="text-emerald-400">Top 22%</span>
            </div>
            <div className="w-full bg-background rounded-full h-2 mb-2 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-2 rounded-full" style={{ width: '78%' }} />
            </div>
            <p className="text-xs text-muted-foreground">Você recuperou mais que 78% dos usuários essa semana. Continue assim! 🚀</p>
          </div>
        </div>
      </div>

      {showRecoveryModal && (
        <RecoveryModal onClose={() => setShowRecoveryModal(false)} userId={user?.id} />
      )}
    </div>
  );
}
