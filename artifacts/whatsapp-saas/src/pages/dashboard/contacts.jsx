import { useContacts } from "@/hooks/use-dashboard";
import { Search, Filter, MessageCircle, Flame, Snowflake, Star } from "lucide-react";

export default function ClientContacts() {
  const { data: contacts, isLoading } = useContacts();

  const getScoreIcon = (score) => {
    switch (score) {
      case "Quente": return <Flame size={16} className="text-orange-500" />;
      case "Frio": return <Snowflake size={16} className="text-blue-400" />;
      case "Alto Potencial": return <Star size={16} className="text-yellow-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Respondeu": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Não respondeu": return "bg-destructive/10 text-destructive border-destructive/20";
      case "Em andamento": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-white/5 text-white border-white/10";
    }
  };

  if (isLoading) return <div className="text-center p-12 text-muted-foreground animate-pulse">Carregando contatos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Contatos</h2>
          <p className="text-muted-foreground mt-1">Acompanhe o status de recuperação de cada lead.</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button className="p-2.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Cliente</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Score</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Tags</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Valor Potencial</th>
                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contacts?.map(contact => (
                <tr key={contact.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center font-bold text-white">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-white/90">
                      {getScoreIcon(contact.score)}
                      {contact.score}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                    <div className="text-[11px] text-muted-foreground mt-1">{contact.lastInteraction}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {contact.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-xs text-muted-foreground border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-emerald-400">
                    R$ {contact.potentialValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-medium text-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <MessageCircle size={16} />
                      Ver Conversa
                    </button>
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
