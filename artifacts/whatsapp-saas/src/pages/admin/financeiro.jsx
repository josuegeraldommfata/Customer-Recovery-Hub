import { useAdminFinanceiro } from "@/hooks/use-admin";
import { DollarSign, TrendingUp, Clock, AlertCircle, CreditCard } from "lucide-react";

const statusColor = {
  Pago: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Pendente: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Expirado: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminFinanceiro() {
  const { data, isLoading } = useAdminFinanceiro();

  if (isLoading || !data) return (
    <div className="animate-pulse space-y-6">
      <div className="h-32 bg-card rounded-3xl" />
      <div className="h-64 bg-card rounded-3xl" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Financeiro</h2>
        <p className="text-muted-foreground mt-1">Visão geral do faturamento e assinaturas ativas.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-blue p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-500/10 rounded-xl"><DollarSign className="text-blue-400" size={22} /></div>
            <span className="text-muted-foreground text-sm font-medium">MRR Estimado</span>
          </div>
          <div className="text-3xl font-display font-bold text-white">
            R$ {data.mrr.toLocaleString("pt-BR")}
          </div>
          <div className="text-xs text-blue-400 mt-1">assinaturas ativas</div>
        </div>

        <div className="bg-card border border-emerald-500/20 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl"><TrendingUp className="text-emerald-400" size={22} /></div>
            <span className="text-muted-foreground text-sm font-medium">Total Recebido</span>
          </div>
          <div className="text-3xl font-display font-bold text-white">
            R$ {data.totalReceived.toLocaleString("pt-BR")}
          </div>
          <div className="text-xs text-emerald-400 mt-1">acumulado no mês</div>
        </div>

        <div className="bg-card border border-yellow-500/20 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-yellow-500/10 rounded-xl"><Clock className="text-yellow-400" size={22} /></div>
            <span className="text-muted-foreground text-sm font-medium">A Receber</span>
          </div>
          <div className="text-3xl font-display font-bold text-white">
            R$ {data.pendingAmount.toLocaleString("pt-BR")}
          </div>
          <div className="text-xs text-yellow-400 mt-1">cobranças pendentes</div>
        </div>

        <div className="bg-card border border-red-500/20 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-red-500/10 rounded-xl"><AlertCircle className="text-red-400" size={22} /></div>
            <span className="text-muted-foreground text-sm font-medium">Churn Rate</span>
          </div>
          <div className="text-3xl font-display font-bold text-white">{data.churnRate}%</div>
          <div className="text-xs text-red-400 mt-1">cancelamentos / mês</div>
        </div>
      </div>

      {/* Distribuição de planos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { name: "Mini", price: 399, color: "border-slate-500/30 text-slate-400", bg: "bg-slate-500/10" },
          { name: "Starter", price: 990, color: "border-emerald-500/30 text-emerald-400", bg: "bg-emerald-500/10" },
          { name: "Enterprise", price: 3900, color: "border-blue-500/30 text-blue-400", bg: "bg-blue-500/10" },
        ].map(plan => (
          <div key={plan.name} className={`bg-card border ${plan.color} p-6 rounded-3xl`}>
            <div className={`inline-flex px-3 py-1 rounded-full ${plan.bg} text-xs font-bold mb-4 ${plan.color}`}>
              {plan.name}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-4xl font-display font-bold text-white">{data.planCounts[plan.name] || 0}</div>
                <div className="text-muted-foreground text-sm mt-1">assinantes ativos</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  R$ {((data.planCounts[plan.name] || 0) * plan.price).toLocaleString("pt-BR")}
                </div>
                <div className="text-xs text-muted-foreground">receita do plano</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela de transações */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <CreditCard className="text-blue-400" size={20} />
          <h3 className="font-display font-bold text-lg text-white">Últimas Transações</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Cliente</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Plano</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Valor</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Data</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Método</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{tx.client}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-muted-foreground">{tx.plan}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-400">
                    R$ {tx.value.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{tx.method}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor[tx.status] || ""}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
