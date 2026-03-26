// Central mock data store — v3 (trial, botões funcionais)
const DB_VERSION = "v3";

const PLAN_PRICES = { Mini: 399, Starter: 990, Enterprise: 3900, Trial: 0 };
const PLAN_TOKEN_LIMITS = { Mini: 5000, Starter: 15000, Enterprise: 999999, Trial: 60, Nenhum: 0 };

const TODAY = "2026-03-26";

const initialUsers = [
  {
    id: "1", username: "admin", name: "Administrador", role: "admin",
    email: "admin@recoverIA.com", plan: "Nenhum", tokens: 0, tokens_used: 0,
    tokens_limit: 0, status: "Ativo", createdAt: "2026-01-01T00:00:00Z",
    expires_at: null, whatsapp_connected: false
  },
  {
    id: "2", username: "cliente", name: "João Silva", role: "cliente",
    email: "joao@empresa.com", plan: "Starter", tokens: 15000, tokens_used: 4320,
    tokens_limit: 15000, status: "Ativo", createdAt: "2026-03-18T10:30:00Z",
    expires_at: "2026-04-01T23:59:59Z", whatsapp_connected: false
  },
  {
    id: "3", username: "maria", name: "Maria Oliveira", role: "cliente",
    email: "maria@loja.com", plan: "Mini", tokens: 5000, tokens_used: 5000,
    tokens_limit: 5000, status: "Expirado", createdAt: "2026-02-01T14:20:00Z",
    expires_at: "2026-03-01T23:59:59Z", whatsapp_connected: false
  },
  {
    id: "4", username: "carlos", name: "Carlos Tech", role: "cliente",
    email: "carlos@tech.com", plan: "Enterprise", tokens: 999999, tokens_used: 12800,
    tokens_limit: 999999, status: "Ativo", createdAt: "2026-01-10T09:15:00Z",
    expires_at: "2026-12-31T23:59:59Z", whatsapp_connected: true
  },
  {
    id: "5", username: "ana", name: "Ana Beatriz", role: "cliente",
    email: "ana@doces.com", plan: "Mini", tokens: 100, tokens_used: 100,
    tokens_limit: 100, status: "Pendente", createdAt: "2026-03-20T16:45:00Z",
    expires_at: "2026-04-15T23:59:59Z", whatsapp_connected: false
  },
  {
    id: "6", username: "trial", name: "Usuário Trial", role: "cliente",
    email: "trial@teste.com", plan: "Trial", tokens: 60, tokens_used: 5,
    tokens_limit: 60, status: "Ativo", createdAt: "2026-03-24T12:00:00Z",
    expires_at: "2026-03-29T23:59:59Z", whatsapp_connected: false
  },
];

const initialContacts = [
  { id: "c1", name: "Marcos Aurelio", phone: "+55 11 99999-1111", score: "Quente", status: "Não respondeu", tags: ["carrinho abandonado", "quase comprou"], lastInteraction: "Há 2 horas", potentialValue: 850.00 },
  { id: "c2", name: "Juliana Paes", phone: "+55 11 99999-2222", score: "Alto Potencial", status: "Em andamento", tags: ["sumiu no orçamento"], lastInteraction: "Há 5 horas", potentialValue: 1200.00 },
  { id: "c3", name: "Roberto Firmino", phone: "+55 11 99999-3333", score: "Frio", status: "Não respondeu", tags: ["pesquisa inicial"], lastInteraction: "Há 1 dia", potentialValue: 300.00 },
  { id: "c4", name: "Fernanda Costa", phone: "+55 11 99999-4444", score: "Quente", status: "Respondeu", tags: ["cliente fiel", "reativado"], lastInteraction: "Há 10 minutos", potentialValue: 450.00 },
  { id: "c5", name: "Lucas Mendes", phone: "+55 11 99999-5555", score: "Quente", status: "Não respondeu", tags: ["carrinho abandonado"], lastInteraction: "Há 3 horas", potentialValue: 980.00 },
];

const initialHistory = [
  { id: "h1", contactName: "Fernanda Costa", message: "Oi Fernanda! Vi que você deixou alguns itens no carrinho. Posso te ajudar a finalizar com 10% OFF?", status: "Respondido", timestamp: "2026-03-25T14:30:00Z", valueRecovered: 450.00 },
  { id: "h2", contactName: "Roberto Firmino", message: "Olá Roberto, tudo bem? Você ainda tem interesse no nosso serviço de consultoria?", status: "Ignorado", timestamp: "2026-03-25T10:15:00Z" },
  { id: "h3", contactName: "Juliana Paes", message: "Oi Juliana, separei uma condição especial para o orçamento que conversamos ontem. Vamos fechar?", status: "Entregue", timestamp: "2026-03-26T09:00:00Z" },
  { id: "h4", contactName: "Marcos Aurelio", message: "Marcos, seu carrinho expira em 1 hora! Clica aqui para garantir seu produto.", status: "Entregue", timestamp: "2026-03-26T11:45:00Z" },
];

const initialAdminSettings = {
  mp_access_token: "",
  mp_public_key: "",
  mp_webhook_secret: "",
  notification_email: "admin@recoverIA.com",
};

const initialAutomationConfig = {
  triggerTime: "1h",
  message: "Oi {nome}, vi que você deixou alguns itens no carrinho. Aconteceu algum problema? Posso te ajudar a finalizar com 10% de desconto hoje? 😊",
};

if (localStorage.getItem("mock_db_version") !== DB_VERSION) {
  localStorage.clear();
  localStorage.setItem("mock_db_version", DB_VERSION);
}

if (!localStorage.getItem("mock_users")) localStorage.setItem("mock_users", JSON.stringify(initialUsers));
if (!localStorage.getItem("mock_contacts")) localStorage.setItem("mock_contacts", JSON.stringify(initialContacts));
if (!localStorage.getItem("mock_history")) localStorage.setItem("mock_history", JSON.stringify(initialHistory));
if (!localStorage.getItem("mock_automation_status")) localStorage.setItem("mock_automation_status", JSON.stringify(true));
if (!localStorage.getItem("mock_admin_settings")) localStorage.setItem("mock_admin_settings", JSON.stringify(initialAdminSettings));
if (!localStorage.getItem("mock_automation_config")) localStorage.setItem("mock_automation_config", JSON.stringify(initialAutomationConfig));

export { PLAN_PRICES, PLAN_TOKEN_LIMITS };

export const mockDb = {
  getUsers: () => JSON.parse(localStorage.getItem("mock_users") || "[]"),
  setUsers: (users) => localStorage.setItem("mock_users", JSON.stringify(users)),

  getUser: (id) => {
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    return users.find(u => u.id === id) || null;
  },

  updateUser: (id, patch) => {
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const updated = users.map(u => u.id === id ? { ...u, ...patch } : u);
    localStorage.setItem("mock_users", JSON.stringify(updated));
    const current = localStorage.getItem("current_user");
    if (current) {
      const cu = JSON.parse(current);
      if (cu.id === id) localStorage.setItem("current_user", JSON.stringify({ ...cu, ...patch }));
    }
  },

  // Cria usuário trial (5 dias, 60 tokens)
  createTrialUser: (data) => {
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    if (users.find(u => u.username === data.username || u.email === data.email)) {
      throw new Error("Usuário ou e-mail já cadastrado.");
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 5);
    const user = {
      id: "u_" + Math.random().toString(36).substring(2, 9),
      username: data.username,
      name: data.name,
      email: data.email,
      role: "cliente",
      plan: "Trial",
      tokens: 60,
      tokens_used: 0,
      tokens_limit: 60,
      status: "Ativo",
      createdAt: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      whatsapp_connected: false,
    };
    localStorage.setItem("mock_users", JSON.stringify([...users, user]));
    return user;
  },

  // Consume tokens do usuário e retorna ok/bloqueado
  consumeToken: (userId, amount = 1) => {
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    if (user.tokens_limit !== "Ilimitado" && user.tokens_limit !== 999999) {
      if (user.tokens_used >= user.tokens_limit) return false;
    }
    const updated = users.map(u => u.id === userId
      ? { ...u, tokens_used: (u.tokens_used || 0) + amount }
      : u
    );
    localStorage.setItem("mock_users", JSON.stringify(updated));
    const current = localStorage.getItem("current_user");
    if (current) {
      const cu = JSON.parse(current);
      if (cu.id === userId) {
        localStorage.setItem("current_user", JSON.stringify({ ...cu, tokens_used: (cu.tokens_used || 0) + amount }));
      }
    }
    return true;
  },

  getContacts: () => JSON.parse(localStorage.getItem("mock_contacts") || "[]"),
  setContacts: (contacts) => localStorage.setItem("mock_contacts", JSON.stringify(contacts)),

  getHistory: () => JSON.parse(localStorage.getItem("mock_history") || "[]"),
  addHistory: (entry) => {
    const history = JSON.parse(localStorage.getItem("mock_history") || "[]");
    localStorage.setItem("mock_history", JSON.stringify([entry, ...history]));
  },

  getAutomationStatus: () => JSON.parse(localStorage.getItem("mock_automation_status") || "true"),
  setAutomationStatus: (status) => localStorage.setItem("mock_automation_status", JSON.stringify(status)),

  getAutomationConfig: () => JSON.parse(localStorage.getItem("mock_automation_config") || "{}"),
  setAutomationConfig: (config) => localStorage.setItem("mock_automation_config", JSON.stringify(config)),

  getAdminSettings: () => JSON.parse(localStorage.getItem("mock_admin_settings") || "{}"),
  setAdminSettings: (settings) => localStorage.setItem("mock_admin_settings", JSON.stringify(settings)),

  isSubscriptionExpired: (user) => {
    if (!user || user.role === "admin") return false;
    if (!user.expires_at) return false;
    return new Date(user.expires_at) < new Date();
  },

  isTokensExhausted: (user) => {
    if (!user || user.role === "admin") return false;
    if (user.tokens_limit === "Ilimitado" || user.tokens_limit === 999999) return false;
    return Number(user.tokens_used) >= Number(user.tokens_limit);
  },

  getDaysRemaining: (user) => {
    if (!user || !user.expires_at) return 0;
    const diff = new Date(user.expires_at) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  },

  renovarManual: (userId, months = 1) => {
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const base = user.expires_at && new Date(user.expires_at) > new Date()
      ? new Date(user.expires_at)
      : new Date();
    base.setMonth(base.getMonth() + months);
    const updated = users.map(u => u.id === userId
      ? { ...u, expires_at: base.toISOString(), status: "Ativo" }
      : u
    );
    localStorage.setItem("mock_users", JSON.stringify(updated));
    const current = localStorage.getItem("current_user");
    if (current) {
      const cu = JSON.parse(current);
      if (cu.id === userId) {
        localStorage.setItem("current_user", JSON.stringify({ ...cu, expires_at: base.toISOString(), status: "Ativo" }));
      }
    }
  },
};
