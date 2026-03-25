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

      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo de volta, ${foundUser.name}!`,
      });

      if (foundUser.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Credenciais inválidas",
        description: "Verifique seu usuário e senha e tente novamente.",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("current_user");
    setLocation("/login");
  };

  return { user, login, logout, isAuthenticated: !!user };
}
