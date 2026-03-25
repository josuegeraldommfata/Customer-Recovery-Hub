import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { mockDb, type User } from "../lib/mock-db";
import { useToast } from "./use-toast";

export function useAuth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Try to load user from localStorage on initial render
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username: string, password: string) => {
    // Artificial delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = mockDb.getUsers();
    const foundUser = users.find(u => u.username === username);

    // Mock password logic: append '123' to username is correct password
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
