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
      };
    },
    enabled: !!userId,
    refetchInterval: 10000,
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

export function useAutomation() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["automation"],
    queryFn: async () => {
      await delay(200);
      return {
        isActive: mockDb.getAutomationStatus(),
        triggerTime: "1h",
        message: "Oi {nome}, vi que você deixou alguns itens no carrinho. Aconteceu algum problema? Posso te ajudar a finalizar com 10% de desconto hoje? 😊",
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automation"] });
    }
  });

  return { ...query, toggleAutomation: toggleMutation.mutate, isToggling: toggleMutation.isPending };
}
