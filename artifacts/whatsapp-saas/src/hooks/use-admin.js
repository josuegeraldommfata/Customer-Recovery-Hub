import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockDb } from "../lib/mock-db";

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

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser) => {
      await delay(600);
      const users = mockDb.getUsers();
      const user = {
        ...newUser,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString()
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
      const updated = users.map(u => u.id === userId ? { ...u, tokens } : u);
      mockDb.setUsers(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    }
  });
}
