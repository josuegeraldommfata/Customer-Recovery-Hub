import { useState } from "react";
import { useAdminUsers, useUpdateUserTokens, useCreateUser } from "@/hooks/use-admin";
import { Search, Plus, Edit2, Shield, X, Save } from "lucide-react";

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers();
  const { mutate: updateTokens } = useUpdateUserTokens();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();

  const [editingUserId, setEditingUserId] = useState(null);
  const [editTokens, setEditTokens] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", username: "", plan: "Mini", tokens: 1000 });

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditTokens(user.tokens.toString());
  };

  const handleSaveTokens = (id) => {
    const val = editTokens.toLowerCase() === "ilimitado" ? "Ilimitado" : parseInt(editTokens) || 0;
    updateTokens({ userId: id, tokens: val });
    setEditingUserId(null);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createUser(
      { ...newUser, role: "cliente", status: "Ativo" },
      { onSuccess: () => setIsModalOpen(false) }
    );
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando usuários...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Gerenciamento de Clientes</h2>
        </div>

        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input type="text" placeholder="Buscar email ou nome..." className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-white outline-none focus:border-blue-500" />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
          >
            <Plus size={18} /> Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-background/50">
              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Cliente</th>
              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Plano</th>
              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Tokens</th>
              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users?.map(user => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white flex items-center gap-2">
                    {user.role === 'admin' && <Shield size={14} className="text-blue-400" />}
                    {user.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Username: {user.username}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-medium text-white">
                    {user.plan}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {editingUserId === user.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editTokens}
                        onChange={(e) => setEditTokens(e.target.value)}
                        className="w-24 bg-background border border-blue-500 rounded px-2 py-1 text-sm text-white outline-none"
                      />
                      <button onClick={() => handleSaveTokens(user.id)} className="text-emerald-400 hover:text-emerald-300"><Save size={16} /></button>
                      <button onClick={() => setEditingUserId(null)} className="text-destructive hover:text-red-400"><X size={16} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white font-mono bg-background px-2 py-1 rounded border border-border">
                        {user.tokens}
                      </span>
                      <button onClick={() => handleEditClick(user)} className="text-muted-foreground hover:text-blue-400 transition-colors">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400' :
                    user.status === 'Pendente' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm text-blue-400 hover:underline">Ver Dashboard</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-muted-foreground hover:text-white"><X size={20} /></button>
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
                    <option value="Mini">Mini</option>
                    <option value="Starter">Starter</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Tokens Iniciais</label>
                  <input required type="number" value={newUser.tokens} onChange={e => setNewUser({ ...newUser, tokens: parseInt(e.target.value) })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500" />
                </div>
              </div>

              <button disabled={isCreating} type="submit" className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                {isCreating ? "Criando..." : "Criar Conta de Cliente"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
