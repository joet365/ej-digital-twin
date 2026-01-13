import { useEffect } from "react";
import PhoneSimulator from "./pages/PhoneSimulator";
import NovaRemote from "./pages/NovaRemote";
import SiteSimulator from "./pages/SiteSimulator";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Kate from "./pages/Kate";
import Joe from "./pages/Joe";
import Lexi from "./pages/Lexi";
import Holly from "./pages/Holly";
import Consulting from "./pages/Consulting";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import BlogIndex from "./pages/blog/Index";
import BlogPost from "./pages/blog/[slug]";
import AITeam from "./pages/AITeam";
import Login from "./pages/Login";
import Loading from "./pages/Loading";
import Demo from "./pages/Demo";
import AgentOnboarding from "./pages/AgentOnboarding";
import NotFound from "./pages/NotFound";
import AdminAuth from "./pages/admin/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminResetPassword from "./pages/admin/ResetPassword";
import LeadDetail from "./pages/admin/LeadDetail";
import ConversationDetail from "./pages/admin/ConversationDetail";
import AuthorityDashboard from "./pages/admin/AuthorityDashboard";
import KateChatWidget from "./components/KateChatWidget";

// Standalone EJ Components
import EJNavigation from "./components/demo/EJNavigation";
import WelcomeHub from "./components/demo/WelcomeHub";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    console.log("🚀 Edward Jones Digital Twin - Standalone Launch");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-slate-50 font-sans">
              <Routes>
                {/* Welcome Hub is now the LANDING PAGE (Root) */}
                <Route path="/" element={
                  <>
                    <EJNavigation />
                    <WelcomeHub />
                  </>
                } />

                {/* Explicit routes for the other views - CLEAN (No Dev Nav) */}
                <Route path="/branch" element={<SiteSimulator theme="ej" />} />
                <Route path="/corporate" element={<SiteSimulator theme="corporate" />} />

                <Route path="/hub" element={
                  <>
                    <EJNavigation />
                    <WelcomeHub />
                  </>
                } />

                {/* Legacy cleanup & Catch-all */}
                <Route path="/ej" element={<WelcomeHub />} />
                <Route path="*" element={<SiteSimulator theme="ej" />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
