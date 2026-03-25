import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { useAuth } from "@/hooks/use-auth";

// Layouts
import { ClientLayout, AdminLayout } from "@/components/layout";

// Pages
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/login";
import ClientDashboardHome from "@/pages/dashboard/home";
import ClientContacts from "@/pages/dashboard/contacts";
import ClientAutomation from "@/pages/dashboard/automation";
import ClientHistory from "@/pages/dashboard/history";

import AdminHome from "@/pages/admin/home";
import AdminUsers from "@/pages/admin/users";
import AdminPlans from "@/pages/admin/plans";

const queryClient = new QueryClient();

// Protected Route Wrapper
function ProtectedRoute({ component: Component, allowedRole, layout: Layout }: any) {
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

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />

      {/* Client Protected */}
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

      {/* Admin Protected */}
      <Route path="/admin">
        {() => <ProtectedRoute component={AdminHome} allowedRole="admin" layout={AdminLayout} />}
      </Route>
      <Route path="/admin/users">
        {() => <ProtectedRoute component={AdminUsers} allowedRole="admin" layout={AdminLayout} />}
      </Route>
      <Route path="/admin/plans">
        {() => <ProtectedRoute component={AdminPlans} allowedRole="admin" layout={AdminLayout} />}
      </Route>

      {/* 404 */}
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
