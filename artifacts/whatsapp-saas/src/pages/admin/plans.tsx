import { CheckCircle2, Settings } from "lucide-react";

export default function AdminPlans() {
  const plans = [
    { name: "Mini", price: "R$ 399", active: 24, limits: "1 Agente IA" },
    { name: "Starter", price: "R$ 990", active: 18, limits: "3 Agentes IA + Voz" },
    { name: "Enterprise", price: "Custom", active: 6, limits: "Ilimitado" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Configuração de Planos</h2>
        <p className="text-muted-foreground mt-1">Gerencie as ofertas exibidas na landing page.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.name} className="bg-card border border-border rounded-3xl p-6 relative group">
            <button className="absolute top-6 right-6 text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Settings size={20} />
            </button>
            
            <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
            <div className="text-3xl font-display font-bold text-blue-400 mb-6">{plan.price}</div>
            
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Assinantes Ativos</span>
                <span className="font-bold text-white">{plan.active}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Limite Básico</span>
                <span className="font-medium text-white">{plan.limits}</span>
              </div>
            </div>

            <button className="w-full mt-6 py-2.5 rounded-xl border border-border bg-background text-sm font-medium hover:bg-white/5 transition-colors">
              Editar Funcionalidades
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
