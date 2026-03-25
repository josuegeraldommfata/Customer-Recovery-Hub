// Central mock data store to simulate a database across renders

export type UserRole = "admin" | "cliente";

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  plan: "Mini" | "Starter" | "Enterprise" | "Nenhum";
  tokens: number | "Ilimitado";
  status: "Ativo" | "Bloqueado" | "Pendente";
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  score: "Quente" | "Frio" | "Alto Potencial";
  status: "Respondeu" | "Não respondeu" | "Em andamento";
  tags: string[];
  lastInteraction: string;
  potentialValue: number;
  avatarUrl?: string;
}

export interface HistoryItem {
  id: string;
  contactName: string;
  message: string;
  status: "Entregue" | "Respondido" | "Ignorado";
  timestamp: string;
  valueRecovered?: number;
}

// Initial Seed Data
const initialUsers: User[] = [
  { id: "1", username: "admin", name: "Administrador", role: "admin", email: "admin@system.com", plan: "Nenhum", tokens: 0, status: "Ativo", createdAt: "2024-01-01T00:00:00Z" },
  { id: "2", username: "cliente", name: "João Silva", role: "cliente", email: "joao@empresa.com", plan: "Starter", tokens: 15000, status: "Ativo", createdAt: "2024-02-15T10:30:00Z" },
  { id: "3", username: "maria", name: "Maria Oliveira", role: "cliente", email: "maria@loja.com", plan: "Mini", tokens: 5000, status: "Ativo", createdAt: "2024-03-01T14:20:00Z" },
  { id: "4", username: "carlos", name: "Carlos Tech", role: "cliente", email: "carlos@tech.com", plan: "Enterprise", tokens: "Ilimitado", status: "Ativo", createdAt: "2024-03-10T09:15:00Z" },
  { id: "5", username: "ana", name: "Ana Beatriz", role: "cliente", email: "ana@doces.com", plan: "Mini", tokens: 200, status: "Pendente", createdAt: "2024-03-20T16:45:00Z" },
];

const initialContacts: Contact[] = [
  { id: "c1", name: "Marcos Aurelio", phone: "+55 11 99999-1111", score: "Quente", status: "Não respondeu", tags: ["carrinho abandonado", "quase comprou"], lastInteraction: "Há 2 horas", potentialValue: 850.00 },
  { id: "c2", name: "Juliana Paes", phone: "+55 11 99999-2222", score: "Alto Potencial", status: "Em andamento", tags: ["sumiu no orçamento"], lastInteraction: "Há 5 horas", potentialValue: 1200.00 },
  { id: "c3", name: "Roberto Firmino", phone: "+55 11 99999-3333", score: "Frio", status: "Não respondeu", tags: ["pesquisa inicial"], lastInteraction: "Há 1 dia", potentialValue: 300.00 },
  { id: "c4", name: "Fernanda Costa", phone: "+55 11 99999-4444", score: "Quente", status: "Respondeu", tags: ["cliente fiel", "reativado"], lastInteraction: "Há 10 minutos", potentialValue: 450.00 },
  { id: "c5", name: "Lucas Mendes", phone: "+55 11 99999-5555", score: "Quente", status: "Não respondeu", tags: ["carrinho abandonado"], lastInteraction: "Há 3 horas", potentialValue: 980.00 },
];

const initialHistory: HistoryItem[] = [
  { id: "h1", contactName: "Fernanda Costa", message: "Oi Fernanda! Vi que você deixou alguns itens no carrinho. Posso te ajudar a finalizar com 10% OFF?", status: "Respondido", timestamp: "2024-03-25T14:30:00Z", valueRecovered: 450.00 },
  { id: "h2", contactName: "Roberto Firmino", message: "Olá Roberto, tudo bem? Você ainda tem interesse no nosso serviço de consultoria?", status: "Ignorado", timestamp: "2024-03-25T10:15:00Z" },
  { id: "h3", contactName: "Juliana Paes", message: "Oi Juliana, separei uma condição especial para o orçamento que conversamos ontem. Vamos fechar?", status: "Entregue", timestamp: "2024-03-26T09:00:00Z" },
  { id: "h4", contactName: "Marcos Aurelio", message: "Marcos, seu carrinho expira em 1 hora! Clica aqui para garantir seu produto.", status: "Entregue", timestamp: "2024-03-26T11:45:00Z" },
];

// Initialize localStorage if empty
if (!localStorage.getItem("mock_users")) {
  localStorage.setItem("mock_users", JSON.stringify(initialUsers));
}
if (!localStorage.getItem("mock_contacts")) {
  localStorage.setItem("mock_contacts", JSON.stringify(initialContacts));
}
if (!localStorage.getItem("mock_history")) {
  localStorage.setItem("mock_history", JSON.stringify(initialHistory));
}
if (!localStorage.getItem("mock_automation_status")) {
  localStorage.setItem("mock_automation_status", JSON.stringify(true));
}

export const mockDb = {
  getUsers: () => JSON.parse(localStorage.getItem("mock_users") || "[]") as User[],
  setUsers: (users: User[]) => localStorage.setItem("mock_users", JSON.stringify(users)),
  
  getContacts: () => JSON.parse(localStorage.getItem("mock_contacts") || "[]") as Contact[],
  setContacts: (contacts: Contact[]) => localStorage.setItem("mock_contacts", JSON.stringify(contacts)),
  
  getHistory: () => JSON.parse(localStorage.getItem("mock_history") || "[]") as HistoryItem[],
  
  getAutomationStatus: () => JSON.parse(localStorage.getItem("mock_automation_status") || "true") as boolean,
  setAutomationStatus: (status: boolean) => localStorage.setItem("mock_automation_status", JSON.stringify(status)),
};
