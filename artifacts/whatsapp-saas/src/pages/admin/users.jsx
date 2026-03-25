import { useState } from "react";
import { useAdminUsers, useUpdateUserTokens, useCreateUser, useRenovarManual } from "@/hooks/use-admin";
import { Search, Plus, Edit2, Shield, X, Save, RefreshCw, Calendar, AlertCircle } from "lucide-react";
import { mockDb } from "@/lib/mock-db";

function getDaysUntilExpiry(expires_at) {
  if (!expires_at) return null;
  const diff = new Date(expires_at) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ expires_at, status }) {
  if (!expires_at) return <span className="text-muted-foreground text-xs">—</span>;
  const days = getDaysUntilExpiry(expires_at);
  const date = new Date(expires_at).toLocaleDateString("pt-BR");

  if (days < 0) return (
    <div>
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">EXPIRADO</span>
      <div className="text-[10px] text-muted-foreground mt-0.5">{date}</div>
    </div>
  );
  if (days <= 3) return (
    <div>
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1 w-fit">
        <AlertCircle size={10} /> {days}d restantes
      </span>
      <div className="text-[10px] text-muted-foreground mt-0.5">{date}</div>
    </div>
  );
  if (days <= 7) return (
    <div>
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">{days}d restantes</span>
      <div className="text-[10px] text-muted-foreground mt-0.5">{date}</div>
    </div>
  );
  return (
    <div>
      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{days}d</span>
      <div className="text-[10px] text-muted-foreground mt-0.5">{date}</div>
    </div>
  );
}

export default function AdminUsers() {
  const { data: users, isLoading, refetch } = useAdminUsers();
  const { mutate: updateTokens } = useUpdateUserTokens();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: renovar, isPending: isRenovando } = useRenovarManual();

  const [editingUserId, setEditingUserId] = useState(null);
  const [editTokens, setEditTokens] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", username: "", plan: "Mini", tokens: 5000 });

  const [renovandoId, setRenovandoId] = useState(null);

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditTokens(user.tokens.toString());
  };

  const handleSaveTokens = (id) => {
    const val = editTokens.toLowerCase() === "ilimitado" ? "Ilimitado" : parseInt(editTokens) || 0;
    updateTokens({ userId: id, tokens: val }, {
      onSuccess: () => {
        setEditingUserId(null);
        refetch();
      }
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createUser(
      { ...newUser, role: "cliente", status: "Ativo" },
      { onSuccess: () => { setIsModalOpen(false); refetch(); } }
    );
  };

  const handleRenovar = (userId) => {
    setRenovandoId(userId);
    renovar({ userId, months: 1 }, {
      onSuccess: () => {
        setRenovandoId(null);
        refetch();
      }
    });
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando usuários...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Gerenciamento de Clientes</h2>
          <p className="text-muted-foreground text-sm mt-1">{users?.length} usuários cadastrados</p>
        </div>

        <div className="flex gap-3">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input type="text" placeholder="Buscar..." className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-white text-sm outline-none focus:border-blue-500" />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors text-sm"
          >
            <Plus size={16} /> Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plano</th>
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tokens</th>
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vencimento</th>
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users?.map(user => {
                const isExpired = mockDb.isSubscriptionExpired(user);
                return (
                  <tr key={user.id} className={`hover:bg-white/[0.02] transition-colors ${isExpired && user.role !== "admin" ? "bg-red-500/5" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="font-medium text-white flex items-center gap-2">
                        {user.role === 'admin' && <Shield size={14} className="text-blue-400 shrink-0" />}
                        {user.name}
                      </div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">@{user.username}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-medium text-white">
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editTokens}
                            onChange={(e) => setEditTokens(e.target.value)}
                            className="w-20 bg-background border border-blue-500 rounded px-2 py-1 text-sm text-white outline-none"
                          />
                          <button onClick={() => handleSaveTokens(user.id)} className="text-emerald-400 hover:text-emerald-300"><Save size={14} /></button>
                          <button onClick={() => setEditingUserId(null)} className="text-destructive hover:text-red-400"><X size={14} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div>
                            <span className="text-sm text-white font-mono">{user.tokens_used || 0}</span>
                            <span className="text-muted-foreground text-xs"> / {user.tokens}</span>
                          </div>
                          <button onClick={() => handleEditClick(user)} className="text-muted-foreground hover:text-blue-400 transition-colors">
                            <Edit2 size={13} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {user.role === "admin" ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <ExpiryBadge expires_at={user.expires_at} status={user.status} />
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400' :
                        user.status === 'Pendente' ? 'bg-yellow-500/10 text-yellow-500' :
                        user.status === 'Expirado' ? 'bg-red-500/10 text-red-400' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleRenovar(user.id)}
                            disabled={renovandoId === user.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            <RefreshCw size={13} className={renovandoId === user.id ? "animate-spin" : ""} />
                            {renovandoId === user.id ? "Renovando..." : "Renovar +1 mês"}
                          </button>
                        )}
                        <button className="text-xs text-blue-400 hover:underline">Ver</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal criar cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-muted-foreground hover:text-white"><X size={20} /></button>
            <h3 className="text-2xl font-bold text-white mb-6">Novo Cliente</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Nome Completo</label>
                <input required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <input required type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Username (Login)</label>
                <input required value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Plano</label>
                  <select value={newUser.plan} onChange={e => setNewUser({ ...newUser, plan: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500">
                    <option value="Mini">Mini — R$399</option>
                    <option value="Starter">Starter — R$990</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Tokens</label>
                  <input required type="number" value={newUser.tokens} onChange={e => setNewUser({ ...newUser, tokens: parseInt(e.target.value) })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                <Calendar size={14} />
                Vencimento automático: 30 dias a partir de hoje
              </div>

              <button disabled={isCreating} type="submit" className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                {isCreating ? "Criando..." : "Criar Conta de Cliente"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
