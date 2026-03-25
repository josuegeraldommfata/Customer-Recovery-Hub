import { useAdminMetrics } from "@/hooks/use-admin";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Users, Bot, Zap } from "lucide-react";

export default function AdminHome() {
  const { data: metrics, isLoading } = useAdminMetrics();

  if (isLoading || !metrics) return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando métricas admin...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Visão Geral do Sistema</h2>
        <p className="text-muted-foreground mt-1">Métricas globais da plataforma SaaS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border p-6 rounded-3xl">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
            <DollarSign className="text-blue-400" />
          </div>
          <div className="text-muted-foreground font-medium mb-1">MRR Total</div>
          <div className="text-4xl font-display font-bold text-white">R$ {metrics.totalMrr.toLocaleString('pt-BR')}</div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl">
          <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4">
            <Users className="text-purple-400" />
          </div>
          <div className="text-muted-foreground font-medium mb-1">Clientes Ativos</div>
          <div className="text-4xl font-display font-bold text-white">{metrics.totalClients}</div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
            <Bot className="text-emerald-400" />
          </div>
          <div className="text-muted-foreground font-medium mb-1">Automações Rodando</div>
          <div className="text-4xl font-display font-bold text-white">{metrics.activeAutomations}</div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4">
            <Zap className="text-orange-400" />
          </div>
          <div className="text-muted-foreground font-medium mb-1">Tokens Consumidos</div>
          <div className="text-4xl font-display font-bold text-white">{metrics.tokensConsumed}</div>
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-3xl">
        <h3 className="font-display font-bold text-xl text-white mb-6">Novos Assinantes (Últimos 6 meses)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.chartData}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--white)/0.05)' }}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              />
              <Bar dataKey="signups" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
