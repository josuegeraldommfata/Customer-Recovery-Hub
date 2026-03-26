import { useState, useMemo } from "react";
import { useContacts, useSendMessage } from "@/hooks/use-dashboard";
import { useAuth } from "@/hooks/use-auth";
import { Search, Filter, MessageCircle, Flame, Snowflake, Star, X, Send, Bot, CheckCheck, Loader2, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function generateMockConversation(contact) {
  const firstName = contact.name.split(" ")[0];
  const msgs = [
    { from: "contact", text: `Olá, preciso de informações.`, time: "9:12" },
    { from: "me", text: `Oi ${firstName}! Claro, terei prazer em ajudar. O que você precisa saber?`, time: "9:15" },
  ];

  if (contact.tags.includes("carrinho abandonado")) {
    msgs.push({ from: "contact", text: "Quanto custa o produto do carrinho?", time: "9:18" });
    msgs.push({ from: "me", text: "O valor é R$ 850,00 com frete grátis. Posso gerar o link de pagamento?", time: "9:20" });
  } else if (contact.tags.includes("sumiu no orçamento")) {
    msgs.push({ from: "contact", text: "Recebi o orçamento, vou analisar.", time: "9:20" });
    msgs.push({ from: "me", text: "Perfeito! Qualquer dúvida é só falar. O orçamento tem validade de 3 dias.", time: "9:22" });
  } else if (contact.tags.includes("pesquisa inicial")) {
    msgs.push({ from: "contact", text: "Só quero saber mais sobre o serviço.", time: "9:20" });
    msgs.push({ from: "me", text: "Ótimo! Enviarei um material completo agora mesmo.", time: "9:22" });
  } else if (contact.tags.includes("cliente fiel")) {
    msgs.push({ from: "contact", text: "Vou precisar do serviço novamente.", time: "9:20" });
    msgs.push({ from: "me", text: "Que ótima notícia! Como cliente fiel, você tem 10% de desconto automático.", time: "9:22" });
    msgs.push({ from: "contact", text: "Perfeito! Vamos fechar então.", time: "9:25" });
  }

  if (contact.status === "Não respondeu") {
    msgs.push({ from: "me", text: `${firstName}, você viu minha mensagem? Separei uma condição especial para você. 😊`, time: "11:30", isAI: true });
  }

  return msgs;
}

function ConversationPanel({ contact, onClose, userId }) {
  const { mutate: sendMessage, isPending } = useSendMessage();
  const [customMsg, setCustomMsg] = useState("");
  const [localMsgs, setLocalMsgs] = useState(() => generateMockConversation(contact));
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    const msg = customMsg.trim() || `Oi ${contact.name.split(" ")[0]}, posso te ajudar a finalizar com 10% OFF? 😊`;
    sendMessage({
      contactId: contact.id,
      contactName: contact.name,
      message: msg,
      userId,
      valueRecovered: contact.status === "Respondeu" ? contact.potentialValue : null,
    }, {
      onSuccess: () => {
        setLocalMsgs(msgs => [...msgs, { from: "me", text: msg, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), isAI: true }]);
        setCustomMsg("");
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      }
    });
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25 }}
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-card border-l border-border shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="bg-[#075e54] p-4 flex items-center gap-3">
        <button onClick={onClose} className="text-white/70 hover:text-white p-1">
          <X size={20} />
        </button>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
          {contact.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white leading-tight">{contact.name}</div>
          <div className="text-[11px] text-white/70">{contact.phone}</div>
        </div>
        <a href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`} target="_blank" className="text-white/70 hover:text-white">
          <Phone size={18} />
        </a>
      </div>

      {/* Contact info strip */}
      <div className="px-4 py-2 bg-background border-b border-border flex items-center gap-3 text-xs">
        <span className={`px-2 py-0.5 rounded-full font-medium ${
          contact.status === "Respondeu" ? "bg-emerald-500/10 text-emerald-400" :
          contact.status === "Em andamento" ? "bg-yellow-500/10 text-yellow-400" :
          "bg-red-500/10 text-red-400"
        }`}>{contact.status}</span>
        <span className="text-muted-foreground">Score: <span className="text-white font-medium">{contact.score}</span></span>
        <span className="text-emerald-400 font-bold ml-auto">R$ {contact.potentialValue.toLocaleString("pt-BR")}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2]">
        {localMsgs.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm shadow-sm relative ${
              msg.from === "me"
                ? "bg-[#dcf8c6] text-slate-800 rounded-tr-sm"
                : "bg-white text-slate-800 rounded-tl-sm"
            }`}>
              {msg.text}
              <div className="flex items-center gap-1 justify-end mt-1">
                <span className="text-[9px] text-slate-400">{msg.time}</span>
                {msg.from === "me" && <CheckCheck size={11} className="text-blue-400" />}
              </div>
              {msg.isAI && (
                <div className="absolute -bottom-4 right-0 text-[9px] text-emerald-600 font-bold bg-white px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Bot size={8} /> IA
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Send area */}
      <div className="p-4 border-t border-border bg-card space-y-3">
        {sent && (
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            <CheckCheck size={13} /> Mensagem enviada! 1 token consumido.
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={customMsg}
            onChange={e => setCustomMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !isPending && handleSend()}
            placeholder="Escrever mensagem personalizada..."
            className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleSend}
            disabled={isPending}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center gap-1.5 font-medium text-sm"
          >
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            Enviar
          </button>
        </div>
        <button
          onClick={handleSend}
          disabled={isPending}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold text-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          <Bot size={15} /> Enviar Mensagem de Recuperação IA
        </button>
      </div>
    </motion.div>
  );
}

export default function ClientContacts() {
  const { user } = useAuth();
  const { data: contacts, isLoading } = useContacts();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    if (!contacts) return [];
    return contacts.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = filterStatus === "Todos" || c.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [contacts, search, filterStatus]);

  const getScoreIcon = (score) => {
    if (score === "Quente") return <Flame size={16} className="text-orange-500" />;
    if (score === "Frio") return <Snowflake size={16} className="text-blue-400" />;
    if (score === "Alto Potencial") return <Star size={16} className="text-yellow-400" />;
    return null;
  };

  const getStatusColor = (status) => {
    if (status === "Respondeu") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (status === "Não respondeu") return "bg-destructive/10 text-destructive border-destructive/20";
    if (status === "Em andamento") return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-white/5 text-white border-white/10";
  };

  if (isLoading) return <div className="text-center p-12 text-muted-foreground animate-pulse">Carregando contatos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Contatos</h2>
          <p className="text-muted-foreground mt-1">{filtered.length} de {contacts?.length} contatos</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar cliente ou tag..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`p-2.5 border rounded-xl transition-colors ${showFilters ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" : "bg-card border-border text-muted-foreground hover:text-white"}`}
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex gap-2 flex-wrap pb-2">
              {["Todos", "Respondeu", "Não respondeu", "Em andamento"].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filterStatus === s
                      ? "bg-emerald-500 text-white"
                      : "bg-card border border-border text-muted-foreground hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Nenhum contato encontrado.</td></tr>
              )}
              {filtered.map(contact => (
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
                      {getScoreIcon(contact.score)} {contact.score}
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
                        <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-xs text-muted-foreground border border-white/10 cursor-pointer hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
                          onClick={() => setSearch(tag)}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-emerald-400">
                    R$ {contact.potentialValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedContact(contact)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-medium text-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <MessageCircle size={16} /> Ver Conversa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedContact && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedContact(null)}
            />
            <ConversationPanel
              contact={selectedContact}
              onClose={() => setSelectedContact(null)}
              userId={user?.id}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
