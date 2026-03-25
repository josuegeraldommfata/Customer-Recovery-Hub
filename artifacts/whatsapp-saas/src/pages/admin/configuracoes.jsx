import { useState, useEffect } from "react";
import { useAdminSettings, useSaveAdminSettings } from "@/hooks/use-admin";
import { Key, Eye, EyeOff, Save, CheckCircle2, AlertCircle, ExternalLink, Webhook, Mail, ShieldCheck } from "lucide-react";

function FieldGroup({ label, help, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/80 block">{label}</label>
      {children}
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}

export default function AdminConfiguracoes() {
  const { data: settings, isLoading } = useAdminSettings();
  const { mutate: save, isPending: isSaving, isSuccess } = useSaveAdminSettings();

  const [form, setForm] = useState({
    mp_access_token: "",
    mp_public_key: "",
    mp_webhook_secret: "",
    notification_email: "",
  });
  const [show, setShow] = useState({ token: false, key: false, secret: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  useEffect(() => {
    if (isSuccess) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }, [isSuccess]);

  const handleSave = (e) => {
    e.preventDefault();
    save(form);
  };

  const hasToken = form.mp_access_token?.startsWith("APP_USR") || form.mp_access_token?.startsWith("TEST");
  const tokenStatus = !form.mp_access_token ? "vazio" : hasToken ? "válido" : "inválido";

  if (isLoading) return <div className="animate-pulse h-64 bg-card rounded-3xl" />;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Configurações de Pagamento</h2>
        <p className="text-muted-foreground mt-1">Configure suas chaves do Mercado Pago para receber assinaturas e cobranças.</p>
      </div>

      {/* Guia rápido */}
      <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-400 shrink-0" size={22} />
          <h3 className="font-bold text-white text-lg">Como configurar o Mercado Pago</h3>
        </div>
        <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
          <li>Acesse <a href="https://www.mercadopago.com.br/developers/panel" target="_blank" className="text-blue-400 hover:underline inline-flex items-center gap-1">Mercado Pago Developers <ExternalLink size={12} /></a></li>
          <li>Crie um aplicativo ou selecione um existente</li>
          <li>Na seção <strong className="text-white">Credenciais de produção</strong>, copie o <strong className="text-white">Access Token</strong> (começa com <code className="bg-white/10 px-1 rounded text-blue-300">APP_USR-</code>)</li>
          <li>Cole abaixo e salve. As cobranças serão geradas automaticamente com seu token.</li>
        </ol>
        <a
          href="https://www.mercadopago.com.br/developers/panel"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm font-medium transition-colors"
        >
          Abrir Painel MP <ExternalLink size={14} />
        </a>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Access Token */}
        <div className="bg-card border border-border p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Key className="text-yellow-400" size={20} />
            <h3 className="font-bold text-white">Credenciais do Mercado Pago</h3>
          </div>

          <FieldGroup
            label="Access Token (Produção)"
            help="Usado para criar cobranças, links de pagamento e assinaturas. Mantenha em segredo."
          >
            <div className="relative">
              <input
                type={show.token ? "text" : "password"}
                value={form.mp_access_token}
                onChange={e => setForm({ ...form, mp_access_token: e.target.value })}
                placeholder="APP_USR-xxxxxxxxxxxx..."
                className="w-full pr-24 pl-4 py-3 bg-background border border-border rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-yellow-500 font-mono text-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {tokenStatus === "válido" && <CheckCircle2 size={16} className="text-emerald-400" />}
                {tokenStatus === "inválido" && <AlertCircle size={16} className="text-red-400" />}
                <button type="button" onClick={() => setShow(s => ({ ...s, token: !s.token }))} className="text-muted-foreground hover:text-white">
                  {show.token ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {tokenStatus === "válido" && (
              <p className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Token válido detectado</p>
            )}
          </FieldGroup>

          <FieldGroup
            label="Public Key (Frontend)"
            help="Usada para tokenizar cartões de crédito no frontend. Pode ser exposta publicamente."
          >
            <div className="relative">
              <input
                type={show.key ? "text" : "password"}
                value={form.mp_public_key}
                onChange={e => setForm({ ...form, mp_public_key: e.target.value })}
                placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full pr-10 pl-4 py-3 bg-background border border-border rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-yellow-500 font-mono text-sm"
              />
              <button type="button" onClick={() => setShow(s => ({ ...s, key: !s.key }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                {show.key ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FieldGroup>

          <FieldGroup
            label="Webhook Secret"
            help="Chave para validar notificações IPN recebidas do Mercado Pago."
          >
            <div className="relative">
              <input
                type={show.secret ? "text" : "password"}
                value={form.mp_webhook_secret}
                onChange={e => setForm({ ...form, mp_webhook_secret: e.target.value })}
                placeholder="xxxxxxxxxxxxxxxxxxxx"
                className="w-full pr-10 pl-4 py-3 bg-background border border-border rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-yellow-500 font-mono text-sm"
              />
              <button type="button" onClick={() => setShow(s => ({ ...s, secret: !s.secret }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                {show.secret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FieldGroup>
        </div>

        {/* Webhook info */}
        <div className="bg-card border border-border p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Webhook className="text-purple-400" size={20} />
            <h3 className="font-bold text-white">Webhook URL</h3>
          </div>
          <p className="text-sm text-muted-foreground">Configure esta URL no painel do Mercado Pago para receber notificações de pagamento automaticamente:</p>
          <div className="bg-background border border-border rounded-xl p-3 font-mono text-sm text-emerald-400 flex items-center justify-between gap-3">
            <span className="truncate">https://sua-api.recoverIA.com/webhooks/mercadopago</span>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText("https://sua-api.recoverIA.com/webhooks/mercadopago")}
              className="shrink-0 text-xs text-muted-foreground hover:text-white border border-border rounded px-2 py-1"
            >
              Copiar
            </button>
          </div>
        </div>

        {/* Notificações */}
        <div className="bg-card border border-border p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Mail className="text-emerald-400" size={20} />
            <h3 className="font-bold text-white">Notificações</h3>
          </div>
          <FieldGroup label="Email para alertas de pagamento">
            <input
              type="email"
              value={form.notification_email}
              onChange={e => setForm({ ...form, notification_email: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
            />
          </FieldGroup>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-400 text-black font-bold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          {saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
          {isSaving ? "Salvando..." : saved ? "Salvo com sucesso!" : "Salvar Configurações"}
        </button>
      </form>
    </div>
  );
}
