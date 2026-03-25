import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { useAuth } from "@/hooks/use-auth";
import { ClientLayout, AdminLayout } from "@/components/layout";
import SubscriptionGuard from "@/components/subscription-guard";

import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/login";

import ClientDashboardHome from "@/pages/dashboard/home";
import ClientContacts from "@/pages/dashboard/contacts";
import ClientAutomation from "@/pages/dashboard/automation";
import ClientHistory from "@/pages/dashboard/history";
import ClientSubscription from "@/pages/dashboard/subscription";
import ClientConexao from "@/pages/dashboard/conexao";

import AdminHome from "@/pages/admin/home";
import AdminUsers from "@/pages/admin/users";
import AdminPlans from "@/pages/admin/plans";
import AdminFinanceiro from "@/pages/admin/financeiro";
import AdminConfiguracoes from "@/pages/admin/configuracoes";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, allowedRole, layout: Layout, skipSubscriptionCheck }) {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

  if (!user) {
    setLocation("/login");
    return null;
  }

  if (allowedRole && user.role !== allowedRole) {
    setLocation(user.role === "admin" ? "/admin" : "/dashboard");
    return null;
  }

  const content = <Component />;

  return (
    <Layout>
      {allowedRole === "cliente" && !skipSubscriptionCheck
        ? <SubscriptionGuard>{content}</SubscriptionGuard>
        : content}
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />

      {/* Client routes */}
      <Route path="/dashboard">
        {() => <ProtectedRoute component={ClientDashboardHome} allowedRole="cliente" layout={ClientLayout} />}
      </Route>
      <Route path="/dashboard/contacts">
        {() => <ProtectedRoute component={ClientContacts} allowedRole="cliente" layout={ClientLayout} />}
      </Route>
      <Route path="/dashboard/automation">
        {() => <ProtectedRoute component={ClientAutomation} allowedRole="cliente" layout={ClientLayout} />}
      </Route>
      <Route path="/dashboard/history">
        {() => <ProtectedRoute component={ClientHistory} allowedRole="cliente" layout={ClientLayout} />}
      </Route>
      <Route path="/dashboard/conexao">
        {() => <ProtectedRoute component={ClientConexao} allowedRole="cliente" layout={ClientLayout} skipSubscriptionCheck />}
      </Route>
      <Route path="/dashboard/subscription">
        {() => <ProtectedRoute component={ClientSubscription} allowedRole="cliente" layout={ClientLayout} skipSubscriptionCheck />}
      </Route>

      {/* Admin routes */}
      <Route path="/admin">
        {() => <ProtectedRoute component={AdminHome} allowedRole="admin" layout={AdminLayout} />}
      </Route>
      <Route path="/admin/users">
        {() => <ProtectedRoute component={AdminUsers} allowedRole="admin" layout={AdminLayout} />}
      </Route>
      <Route path="/admin/financeiro">
        {() => <ProtectedRoute component={AdminFinanceiro} allowedRole="admin" layout={AdminLayout} />}
      </Route>
      <Route path="/admin/plans">
        {() => <ProtectedRoute component={AdminPlans} allowedRole="admin" layout={AdminLayout} />}
      </Route>
      <Route path="/admin/configuracoes">
        {() => <ProtectedRoute component={AdminConfiguracoes} allowedRole="admin" layout={AdminLayout} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
