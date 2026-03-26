import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockDb } from "../lib/mock-db";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: async () => {
      await delay(400);
      return {
        revenueRecovered: 3450.00,
        revenueGrowth: 34,
        reactivatedClients: 127,
        reactivatedGrowth: 18,
        recoveryAttempts: 1284,
        recoveryRate: 78,
        lostPotential: 8920.00,
        chartData: [
          { day: "Seg", value: 300 },
          { day: "Ter", value: 450 },
          { day: "Qua", value: 400 },
          { day: "Qui", value: 800 },
          { day: "Sex", value: 650 },
          { day: "Sáb", value: 900 },
          { day: "Dom", value: 1200 },
        ]
      };
    },
  });
}

export function useSubscriptionStatus(userId) {
  return useQuery({
    queryKey: ["subscriptionStatus", userId],
    queryFn: async () => {
      await delay(200);
      if (!userId) return null;
      const users = mockDb.getUsers();
      const user = users.find(u => u.id === userId);
      if (!user) return null;

      const isExpired = mockDb.isSubscriptionExpired(user);
      const isTokensExhausted = mockDb.isTokensExhausted(user);
      const daysRemaining = mockDb.getDaysRemaining(user);
      const tokensUsed = Number(user.tokens_used) || 0;
      const tokensLimit = user.tokens_limit === "Ilimitado" || user.tokens_limit === 999999
        ? "Ilimitado"
        : Number(user.tokens_limit) || 0;
      const tokensPercent = tokensLimit === "Ilimitado"
        ? 0
        : tokensLimit > 0 ? Math.round((tokensUsed / tokensLimit) * 100) : 0;

      return {
        ...user,
        isExpired,
        isTokensExhausted,
        daysRemaining,
        tokensUsed,
        tokensLimit,
        tokensPercent,
        isTrial: user.plan === "Trial",
      };
    },
    enabled: !!userId,
    refetchInterval: 5000,
  });
}

export function useContacts() {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      await delay(300);
      return mockDb.getContacts();
    }
  });
}

export function useHistory() {
  return useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      await delay(300);
      return mockDb.getHistory();
    }
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contactId, contactName, message, userId, valueRecovered }) => {
      await delay(1200);
      // Consome 1 token
      const ok = mockDb.consumeToken(userId, 1);
      if (!ok) throw new Error("Tokens esgotados");

      // Atualiza status do contato
      const contacts = mockDb.getContacts();
      const updated = contacts.map(c =>
        c.id === contactId ? { ...c, status: "Em andamento", lastInteraction: "Agora mesmo" } : c
      );
      mockDb.setContacts(updated);

      // Adiciona ao histórico
      mockDb.addHistory({
        id: "h_" + Date.now(),
        contactName,
        message,
        status: "Entregue",
        timestamp: new Date().toISOString(),
        valueRecovered: valueRecovered || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });
    }
  });
}

export function useSendBulkRecovery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contacts, message, userId }) => {
      await delay(2000);
      for (const contact of contacts) {
        const ok = mockDb.consumeToken(userId, 1);
        if (!ok) break;
        const allContacts = mockDb.getContacts();
        const updated = allContacts.map(c =>
          c.id === contact.id ? { ...c, status: "Em andamento", lastInteraction: "Agora mesmo" } : c
        );
        mockDb.setContacts(updated);
        mockDb.addHistory({
          id: "h_" + Date.now() + "_" + contact.id,
          contactName: contact.name,
          message: message.replace("{nome}", contact.name.split(" ")[0]),
          status: "Entregue",
          timestamp: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    }
  });
}

export function useAutomation() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["automation"],
    queryFn: async () => {
      await delay(200);
      const config = mockDb.getAutomationConfig();
      return {
        isActive: mockDb.getAutomationStatus(),
        triggerTime: config.triggerTime || "1h",
        message: config.message || "Oi {nome}, seu carrinho ainda está esperando por você!",
        estimatedImpact: 18,
        messagesSentThisWeek: 342,
        responseRate: 42
      };
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async (newStatus) => {
      await delay(500);
      mockDb.setAutomationStatus(newStatus);
      return newStatus;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["automation"] }),
  });

  const saveMutation = useMutation({
    mutationFn: async ({ triggerTime, message }) => {
      await delay(600);
      const current = mockDb.getAutomationConfig();
      mockDb.setAutomationConfig({ ...current, triggerTime, message });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["automation"] }),
  });

  return {
    ...query,
    toggleAutomation: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
    saveConfig: saveMutation.mutate,
    isSaving: saveMutation.isPending,
    saveSuccess: saveMutation.isSuccess,
  };
}
