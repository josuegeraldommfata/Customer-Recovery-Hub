import { useAutomation } from "@/hooks/use-dashboard";
import { Bot, Clock, MessageSquare, Power, Settings2, BarChart2 } from "lucide-react";

export default function ClientAutomation() {
  const { data, isLoading, toggleAutomation, isToggling } = useAutomation();

  if (isLoading || !data) return <div className="animate-pulse p-12 text-center text-muted-foreground">Carregando automação...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Fluxo de Recuperação</h2>
          <p className="text-muted-foreground mt-1">Configure como a IA deve abordar clientes inativos.</p>
        </div>
        
        {/* Big Toggle */}
        <button 
          onClick={() => toggleAutomation(!data.isActive)}
          disabled={isToggling}
          className={`
            relative overflow-hidden group flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300
            ${data.isActive 
              ? 'bg-emerald-500 text-white shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]' 
              : 'bg-card border border-border text-muted-foreground hover:text-white'}
          `}
        >
          <Power size={20} className={data.isActive ? "animate-pulse" : ""} />
          {data.isActive ? 'Automação Ativa' : 'Automação Pausada'}
        </button>
      </div>

      {!data.isActive && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-4 rounded-xl flex items-start gap-3">
          <Settings2 className="shrink-0 mt-0.5" />
          <div>
            <strong className="block mb-1">Atenção: Você está perdendo dinheiro!</strong>
            Clientes que pararem de responder não receberão mensagens. Ative a automação para recuperar vendas.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Flow Builder Visual */}
        <div className="space-y-6">
          <h3 className="font-display font-semibold text-lg text-white">Configuração do Gatilho</h3>
          
          <div className="relative pl-8 space-y-6 border-l-2 border-border ml-4">
            
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-[41px] top-2 w-6 h-6 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="bg-card border border-border p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-white font-medium mb-1">
                  <Bot size={18} className="text-blue-400" />
                  Cliente parou de responder
                </div>
                <p className="text-sm text-muted-foreground">O fluxo inicia quando o cliente visualiza ou ignora a última mensagem.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-[41px] top-2 w-6 h-6 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="bg-card border border-border p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-white font-medium mb-3">
                  <Clock size={18} className="text-yellow-400" />
                  Tempo de Espera
                </div>
                <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500">
                  <option value="1h" selected={data.triggerTime === "1h"}>Aguardar 1 Hora</option>
                  <option value="2h">Aguardar 2 Horas</option>
                  <option value="24h">Aguardar 24 Horas</option>
                </select>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-[41px] top-2 w-6 h-6 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="bg-card border border-border p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-white font-medium mb-3">
                  <MessageSquare size={18} className="text-emerald-400" />
                  Mensagem de Recuperação
                </div>
                <textarea 
                  className="w-full h-32 bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 resize-none"
                  defaultValue={data.message}
                />
                <div className="mt-2 flex gap-2">
                  <button className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-muted-foreground">{'{nome}'}</button>
                  <button className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-muted-foreground">{'{produto}'}</button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Preview & Stats */}
        <div className="space-y-6">
          
          <div className="bg-gradient-to-b from-[#efeae2] to-[#e4ded5] p-4 rounded-[2rem] border-8 border-slate-900 shadow-2xl relative h-[400px] overflow-hidden flex flex-col">
            {/* Phone Header */}
            <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3 -mx-4 -mt-4 mb-4 shadow-md z-10 relative">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><UserIcon /></div>
              <div>
                <div className="font-semibold leading-tight">Cliente</div>
                <div className="text-[10px] text-white/70">visto por último hoje às 14:20</div>
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 flex flex-col gap-3 justify-end pb-4 relative z-10">
              <div className="self-start bg-white text-slate-800 p-3 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%] text-sm">
                Quanto custa o serviço?
              </div>
              <div className="self-end bg-[#dcf8c6] text-slate-800 p-3 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%] text-sm">
                Custa R$ 499. Posso gerar o link de pagamento?
              </div>
              
              <div className="text-center text-xs text-black/40 my-2 font-medium bg-black/5 self-center px-3 py-1 rounded-full">
                1 hora depois
              </div>

              {/* Preview Bubble */}
              <div className="self-end bg-[#dcf8c6] text-slate-800 p-3 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%] text-sm relative">
                {data.message.replace('{nome}', 'Cliente')}
                <div className="absolute -bottom-5 right-0 text-[10px] text-emerald-600 font-bold bg-white px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Bot size={10} /> Mensagem da IA
                </div>
              </div>
            </div>
            
            {/* WhatsApp BG Pattern (CSS approximation) */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://transparenttextures.com/patterns/cubes.png")'}}></div>
          </div>

          <div className="bg-card border border-border p-6 rounded-3xl">
            <h4 className="font-medium text-white mb-4 flex items-center gap-2">
              <BarChart2 className="text-blue-400" />
              Impacto desta Automação
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-white mb-1">{data.estimatedImpact}%</div>
                <div className="text-xs text-emerald-400">Impacto Estimado</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">{data.responseRate}%</div>
                <div className="text-xs text-muted-foreground">Taxa de Resposta Atual</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Simple fallback icon
function UserIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
}
