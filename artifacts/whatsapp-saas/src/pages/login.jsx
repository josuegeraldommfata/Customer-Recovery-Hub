import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Bot, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    await login(username, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-white/10 shadow-2xl mb-6">
            <Bot className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Bem-vindo de volta</h1>
          <p className="text-muted-foreground">Acesse seu painel para continuar recuperando vendas.</p>
        </div>

        <div className="glass p-8 rounded-3xl shadow-2xl relative z-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 pl-1">Usuário</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-background/50 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="admin ou cliente"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 pl-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-background/50 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="admin123 ou cliente123"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Acessar Painel <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center text-sm text-muted-foreground">
            <p>Credenciais de teste:</p>
            <p className="mt-1 font-mono text-white/70">admin / admin123</p>
            <p className="font-mono text-white/70">cliente / cliente123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
