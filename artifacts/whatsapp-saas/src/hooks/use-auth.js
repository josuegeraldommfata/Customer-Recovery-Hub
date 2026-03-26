import { useState } from "react";
import { useLocation } from "wouter";
import { mockDb } from "../lib/mock-db";
import { useToast } from "./use-toast";

export function useAuth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = mockDb.getUsers();
    const foundUser = users.find(u => u.username === username);

    if (foundUser && password === `${username}123`) {
      setUser(foundUser);
      localStorage.setItem("current_user", JSON.stringify(foundUser));
      toast({ title: "Login realizado!", description: `Bem-vindo de volta, ${foundUser.name}!` });
      if (foundUser.role === "admin") setLocation("/admin");
      else setLocation("/dashboard");
      return { ok: true };
    } else {
      toast({ variant: "destructive", title: "Credenciais inválidas", description: "Verifique usuário e senha." });
      return { ok: false };
    }
  };

  const register = async ({ name, email, username }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const newUser = mockDb.createTrialUser({ name, email, username });
      setUser(newUser);
      localStorage.setItem("current_user", JSON.stringify(newUser));
      toast({
        title: "Conta criada! 🎉",
        description: `Seu trial de 5 dias com 60 tokens gratuitos começa agora, ${newUser.name}!`,
      });
      setLocation("/dashboard");
      return { ok: true };
    } catch (err) {
      toast({ variant: "destructive", title: "Erro ao criar conta", description: err.message });
      return { ok: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("current_user");
    setLocation("/login");
  };

  return { user, login, register, logout, isAuthenticated: !!user };
}
