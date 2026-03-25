import { useHistory } from "@/hooks/use-dashboard";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCheck, MessageCircle, Ban } from "lucide-react";

export default function ClientHistory() {
  const { data: history, isLoading } = useHistory();

  const getStatusBadge = (status) => {
    switch (status) {
      case "Respondido":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><MessageCircle size={12} /> Respondido</span>;
      case "Entregue":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><CheckCheck size={12} /> Entregue</span>;
      case "Ignorado":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20"><Ban size={12} /> Ignorado</span>;
      default:
        return null;
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando histórico...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Histórico de Disparos</h2>
        <p className="text-muted-foreground mt-1">Veja todas as mensagens que a IA enviou automaticamente.</p>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground w-1/4">Data / Hora</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground w-1/4">Contato</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground w-2/4">Mensagem Enviada</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history?.map(item => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(item.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                    {item.contactName}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground truncate max-w-[300px]">
                    {item.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {item.valueRecovered ? (
                      <span className="text-emerald-400 font-bold">
                        + R$ {item.valueRecovered.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
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
