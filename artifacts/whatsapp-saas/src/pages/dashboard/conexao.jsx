import { useState } from "react";
import { Smartphone, QrCode, CheckCircle2, Wifi, WifiOff, RefreshCw, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const INTEGRATIONS = [
  {
    id: "evoai",
    name: "EvoAI",
    description: "Conecte sua Evolution API para gerenciar o WhatsApp diretamente.",
    icon: "🤖",
    color: "border-blue-500/30 bg-blue-500/5",
    fields: [
      { key: "evo_url", label: "URL da instância", placeholder: "https://sua-evolution-api.com" },
      { key: "evo_token", label: "API Token", placeholder: "Bearer xxxxx", type: "password" },
      { key: "evo_instance", label: "Nome da instância", placeholder: "minha-loja" },
    ]
  },
  {
    id: "n8n",
    name: "n8n",
    description: "Automate flows entre seus sistemas e o WhatsApp com n8n.",
    icon: "⚡",
    color: "border-orange-500/30 bg-orange-500/5",
    fields: [
      { key: "n8n_webhook", label: "Webhook URL", placeholder: "https://seu-n8n.com/webhook/xxxx" },
      { key: "n8n_token", label: "Token de autenticação", placeholder: "n8n_api_xxxxx", type: "password" },
    ]
  },
  {
    id: "typebot",
    name: "Typebot",
    description: "Crie fluxos de conversa visuais e conecte ao seu WhatsApp.",
    icon: "💬",
    color: "border-violet-500/30 bg-violet-500/5",
    fields: [
      { key: "typebot_url", label: "URL do Typebot", placeholder: "https://viewer.typebot.io/seu-bot" },
      { key: "typebot_id", label: "ID do Typebot", placeholder: "xxxxx" },
    ]
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Use GPT-4 para respostas inteligentes e personalizadas nos fluxos.",
    icon: "🧠",
    color: "border-emerald-500/30 bg-emerald-500/5",
    fields: [
      { key: "openai_key", label: "API Key", placeholder: "sk-proj-xxxxxxxx", type: "password" },
      { key: "openai_model", label: "Modelo", placeholder: "gpt-4o" },
    ]
  },
  {
    id: "dify",
    name: "Dify",
    description: "Plataforma LLM para criar agentes de IA customizados.",
    icon: "🎯",
    color: "border-pink-500/30 bg-pink-500/5",
    fields: [
      { key: "dify_url", label: "URL do Dify", placeholder: "https://api.dify.ai/v1" },
      { key: "dify_key", label: "API Key", placeholder: "app-xxxxxxxx", type: "password" },
    ]
  },
  {
    id: "flowise",
    name: "Flowise",
    description: "Construa agentes LLM via interface visual com Flowise AI.",
    icon: "🌊",
    color: "border-cyan-500/30 bg-cyan-500/5",
    fields: [
      { key: "flowise_url", label: "URL do Flowise", placeholder: "https://seu-flowise.com" },
      { key: "flowise_id", label: "Chatflow ID", placeholder: "xxxx-xxxx-xxxx" },
      { key: "flowise_key", label: "API Key", placeholder: "xxxxxxxx", type: "password" },
    ]
  },
];

function IntegrationCard({ integration }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState({});

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={`bg-card border ${integration.color} rounded-2xl overflow-hidden transition-all`}>
      <div
        className="flex items-center justify-between p-5 cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-4">
          <div className="text-2xl">{integration.icon}</div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              {integration.name}
              {saved && <span className="text-[10px] text-emerald-400 font-normal">● Salvo</span>}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
      </div>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
          {integration.fields.map(field => (
            <div key={field.key}>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{field.label}</label>
              <div className="relative">
                <input
                  type={field.type === "password" && !showPass[field.key] ? "password" : "text"}
                  value={values[field.key] || ""}
                  onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 font-mono"
                />
                {field.type === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPass(s => ({ ...s, [field.key]: !s[field.key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white text-xs"
                  >
                    {showPass[field.key] ? "ocultar" : "mostrar"}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-colors flex items-center gap-2"
            >
              {saved ? <CheckCircle2 size={15} /> : null}
              {saved ? "Salvo!" : "Salvar Integração"}
            </button>
            <button className="px-5 py-2 rounded-xl border border-border text-muted-foreground text-sm hover:text-white hover:border-white/20 transition-colors flex items-center gap-2">
              <ExternalLink size={14} /> Documentação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientConexao() {
  const [qrStep, setQrStep] = useState("idle"); // idle → loading → connected
  const [isConnected, setIsConnected] = useState(false);

  const handleGenerateQR = () => {
    setQrStep("loading");
    setTimeout(() => setQrStep("ready"), 2500);
  };

  const handleConnect = () => {
    setQrStep("connected");
    setIsConnected(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Conexão WhatsApp</h2>
        <p className="text-muted-foreground mt-1">Conecte seu WhatsApp e configure as integrações de IA.</p>
      </div>

      {/* QR Code section */}
      <div className="bg-card border border-border rounded-3xl p-8">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          {/* Status */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
              <span className={`font-bold text-lg ${isConnected ? "text-emerald-400" : "text-red-400"}`}>
                {isConnected ? "WhatsApp Conectado" : "WhatsApp Desconectado"}
              </span>
            </div>

            {isConnected ? (
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="text-emerald-400" size={20} />
                    <span className="font-bold text-white">Número Ativo</span>
                  </div>
                  <p className="text-2xl font-mono font-bold text-white">+55 11 99999-8888</p>
                  <p className="text-xs text-muted-foreground mt-1">Conectado há 2 horas</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-background border border-border rounded-xl p-3">
                    <div className="text-xl font-bold text-white">342</div>
                    <div className="text-xs text-muted-foreground">Msgs enviadas</div>
                  </div>
                  <div className="bg-background border border-border rounded-xl p-3">
                    <div className="text-xl font-bold text-white">78%</div>
                    <div className="text-xs text-muted-foreground">Taxa resposta</div>
                  </div>
                  <div className="bg-background border border-border rounded-xl p-3">
                    <div className="text-xl font-bold text-white">24h</div>
                    <div className="text-xs text-muted-foreground">Online</div>
                  </div>
                </div>
                <button
                  onClick={() => { setQrStep("idle"); setIsConnected(false); }}
                  className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  <WifiOff size={16} /> Desconectar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-white mb-2">Como conectar:</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Abra o WhatsApp no seu celular</li>
                    <li>Toque em <strong className="text-white">Dispositivos conectados</strong></li>
                    <li>Toque em <strong className="text-white">Conectar um dispositivo</strong></li>
                    <li>Aponte a câmera para o QR Code</li>
                  </ol>
                </div>
                {qrStep === "idle" && (
                  <button
                    onClick={handleGenerateQR}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold hover:-translate-y-0.5 transition-all shadow-lg shadow-emerald-500/25"
                  >
                    <QrCode size={20} />
                    Gerar QR Code
                  </button>
                )}
              </div>
            )}
          </div>

          {/* QR Display */}
          <div className="shrink-0 w-64 flex flex-col items-center">
            {qrStep === "idle" && (
              <div className="w-56 h-56 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <QrCode size={40} className="opacity-30" />
                <p className="text-xs text-center">Clique em "Gerar QR Code" para começar</p>
              </div>
            )}

            {qrStep === "loading" && (
              <div className="w-56 h-56 border border-border rounded-3xl flex flex-col items-center justify-center gap-4">
                <RefreshCw className="text-emerald-400 animate-spin" size={32} />
                <p className="text-sm text-muted-foreground text-center">Gerando QR Code...</p>
                <p className="text-xs text-muted-foreground">Aguarde alguns segundos</p>
              </div>
            )}

            {qrStep === "ready" && (
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-2xl shadow-emerald-500/20 ring-2 ring-emerald-500/30">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://wa.me/qr/RECOVERIABOT${Date.now()}&bgcolor=ffffff&color=0f172a`}
                    alt="QR Code WhatsApp"
                    className="w-48 h-48 rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-yellow-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  Expira em 60 segundos
                </div>
                <button onClick={handleConnect} className="text-sm text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1">
                  <Wifi size={14} /> Simular conexão bem-sucedida
                </button>
              </div>
            )}

            {qrStep === "connected" && (
              <div className="w-56 h-56 border border-emerald-500/30 rounded-3xl bg-emerald-500/5 flex flex-col items-center justify-center gap-3">
                <CheckCircle2 className="text-emerald-400" size={48} />
                <p className="text-emerald-400 font-bold">Conectado!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="text-blue-400" size={22} />
          <h3 className="text-xl font-display font-bold text-white">Integrações de IA</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {INTEGRATIONS.map(integration => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </div>
    </div>
  );
}
