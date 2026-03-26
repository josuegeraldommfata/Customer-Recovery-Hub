import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Bot, User, Mail, Lock, ArrowRight, CheckCircle2, Zap, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function CadastroPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", username: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.username) {
      setError("Preencha todos os campos.");
      return;
    }
    if (form.username.length < 3) {
      setError("Usuário deve ter ao menos 3 caracteres.");
      return;
    }
    setLoading(true);
    const result = await register(form);
    if (!result.ok) {
      setError(result.error || "Erro ao criar conta.");
      setLoading(false);
    }
  };

  const trialBenefits = [
    { icon: Zap, text: "60 tokens gratuitos para testar" },
    { icon: Clock, text: "5 dias de acesso completo" },
    { icon: Shield, text: "Sem cartão de crédito" },
    { icon: CheckCircle2, text: "Cancele quando quiser" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-card/30 border-r border-border flex-col justify-between p-12">
        <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-2xl">
          <Bot size={28} />
          RecoverIA
        </div>

        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Trial gratuito — sem compromisso
            </div>
            <h2 className="text-4xl font-display font-bold text-white leading-tight">
              5 dias para recuperar<br />
              seus primeiros<br />
              <span className="text-gradient">clientes perdidos.</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Comece agora, veja resultados reais e só pague quando quiser continuar.
            </p>
          </div>

          <div className="space-y-4">
            {trialBenefits.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Icon size={18} className="text-emerald-400" />
                </div>
                <span className="text-white font-medium">{text}</span>
              </motion.div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white text-sm">J</div>
              <div>
                <div className="text-white font-medium text-sm">João Silva</div>
                <div className="text-muted-foreground text-xs">Recuperou R$4.800 na primeira semana</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "Testei grátis, em 3 dias meu carrinho abandonado já tinha recuperado R$2.100. Assino até hoje."
            </p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">Fazer login</Link>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 text-emerald-400 font-display font-bold text-2xl mb-8">
            <Bot size={24} /> RecoverIA
          </div>

          {/* Trial badge */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Zap className="text-emerald-400" size={20} />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Trial Grátis por 5 dias</div>
              <div className="text-emerald-400 text-xs">60 tokens · sem cartão · acesso completo</div>
            </div>
          </div>

          <h1 className="text-3xl font-display font-bold text-white mb-2">Criar sua conta</h1>
          <p className="text-muted-foreground mb-8">
            Sua senha de acesso será <code className="bg-white/10 px-1.5 py-0.5 rounded text-emerald-400">[usuário]123</code>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Nome completo</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Seu nome"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Nome de usuário (login)</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, "") })}
                  placeholder="seuusuario"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>
              {form.username && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  Sua senha será: <span className="text-emerald-400 font-mono font-bold">{form.username}123</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0 text-lg"
            >
              {loading ? (
                <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Criando conta...</>
              ) : (
                <>Começar Trial Grátis <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-emerald-400 hover:underline font-medium">Entrar</Link>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Ao criar sua conta você concorda com nossos{" "}
            <span className="text-emerald-400 cursor-pointer hover:underline">Termos de Uso</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
