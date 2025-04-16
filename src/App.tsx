
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import CustomerPage from "./pages/CustomerPage";
import CommercialPage from "./pages/CommercialPage";
import ContractingPage from "./pages/ContractingPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import { createContext } from "react";
import { useSessionId } from "./hooks/useSessionId";

// Create a context for the session ID
export const SessionContext = createContext<{
  sessionId: string;
  resetSessionId: () => string;
}>({
  sessionId: '',
  resetSessionId: () => '',
});

const queryClient = new QueryClient();

const App = () => {
  const sessionManager = useSessionId();
  
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContext.Provider value={sessionManager}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/customer" element={<Layout><CustomerPage /></Layout>} />
              <Route path="/commercial" element={<Layout><CommercialPage /></Layout>} />
              <Route path="/contracting" element={<Layout><ContractingPage /></Layout>} />
              <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
