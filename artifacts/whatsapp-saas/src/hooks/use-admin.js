import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockDb, PLAN_PRICES } from "../lib/mock-db";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function useAdminMetrics() {
  return useQuery({
    queryKey: ["adminMetrics"],
    queryFn: async () => {
      await delay(400);
      return {
        totalMrr: 24500,
        totalClients: 48,
        activeAutomations: 156,
        tokensConsumed: "2.8M",
        chartData: [
          { name: "Out", signups: 12 },
          { name: "Nov", signups: 18 },
          { name: "Dez", signups: 25 },
          { name: "Jan", signups: 32 },
          { name: "Fev", signups: 40 },
          { name: "Mar", signups: 48 },
        ]
      };
    }
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      await delay(300);
      return mockDb.getUsers();
    }
  });
}

export function useAdminFinanceiro() {
  return useQuery({
    queryKey: ["adminFinanceiro"],
    queryFn: async () => {
      await delay(400);
      const users = mockDb.getUsers().filter(u => u.role === "cliente");

      const planCounts = { Mini: 0, Starter: 0, Enterprise: 0 };
      let mrr = 0;
      users.forEach(u => {
        if (u.status === "Ativo" && PLAN_PRICES[u.plan]) {
          planCounts[u.plan]++;
          mrr += PLAN_PRICES[u.plan];
        }
      });

      const transactions = [
        { id: "t1", client: "João Silva", plan: "Starter", value: 990, date: "2026-03-18", method: "Mercado Pago", status: "Pago" },
        { id: "t2", client: "Carlos Tech", plan: "Enterprise", value: 3900, date: "2026-03-10", method: "Mercado Pago", status: "Pago" },
        { id: "t3", client: "Maria Oliveira", plan: "Mini", value: 399, date: "2026-02-01", method: "Mercado Pago", status: "Expirado" },
        { id: "t4", client: "Ana Beatriz", plan: "Mini", value: 399, date: "2026-03-20", method: "Pix Manual", status: "Pendente" },
        { id: "t5", client: "Lucas Carvalho", plan: "Starter", value: 990, date: "2026-03-22", method: "Mercado Pago", status: "Pago" },
        { id: "t6", client: "Fernanda Nunes", plan: "Mini", value: 399, date: "2026-03-24", method: "Mercado Pago", status: "Pago" },
      ];

      return {
        mrr,
        totalReceived: 24580,
        pendingAmount: 1398,
        churnRate: 4.2,
        planCounts,
        transactions,
      };
    }
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ["adminSettings"],
    queryFn: async () => {
      await delay(200);
      return mockDb.getAdminSettings();
    }
  });
}

export function useSaveAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings) => {
      await delay(500);
      mockDb.setAdminSettings(settings);
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] });
    }
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser) => {
      await delay(600);
      const users = mockDb.getUsers();
      const today = new Date();
      today.setMonth(today.getMonth() + 1);
      const user = {
        ...newUser,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
        expires_at: today.toISOString(),
        tokens_used: 0,
        tokens_limit: typeof newUser.tokens === "number" ? newUser.tokens : 0,
        whatsapp_connected: false,
      };
      mockDb.setUsers([...users, user]);
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    }
  });
}

export function useUpdateUserTokens() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, tokens }) => {
      await delay(400);
      const users = mockDb.getUsers();
      const updated = users.map(u => u.id === userId ? { ...u, tokens, tokens_limit: tokens } : u);
      mockDb.setUsers(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    }
  });
}

export function useRenovarManual() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, months }) => {
      await delay(600);
      mockDb.renovarManual(userId, months || 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    }
  });
}
