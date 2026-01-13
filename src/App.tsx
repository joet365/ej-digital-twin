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

const queryClient = new QueryClient();

/**
 * EJApp: The standalone Edward Jones Demo Experience.
 * Mounted on ej.conquer365.com or /ej path.
 * Has no main marketing navigation or global widgets.
 */
import EJNavigation from "./components/demo/EJNavigation";
import WelcomeHub from "./components/demo/WelcomeHub";

const EJApp = () => (
  <div className="min-h-screen bg-slate-50 font-sans">
    <EJNavigation />
    <Routes>
      <Route path="/ej" element={<WelcomeHub />} />
      <Route path="/branch" element={<SiteSimulator theme="ej" />} />
      <Route path="/corporate" element={<SiteSimulator theme="corporate" />} />
      {/* Root of EJ context redirects to /ej */}
      <Route path="/" element={<WelcomeHub />} />
      {/* Catch-all redirects to Hub */}
      <Route path="*" element={<WelcomeHub />} />
    </Routes>
  </div>
);

/**
 * MainApp: The Conquer365 Marketing and Admin Platform.
 */
const MainApp = () => (
  <>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/kate" element={<Kate />} />
      <Route path="/joe" element={<Joe />} />
      <Route path="/lexi" element={<Lexi />} />
      <Route path="/holly" element={<Holly />} />
      <Route path="/consulting" element={<Consulting />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/ai-team" element={<AITeam />} />
      <Route path="/onboarding" element={<AgentOnboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/phone-demo" element={<PhoneSimulator />} />
      <Route path="/remote-chat" element={<NovaRemote />} />
      <Route path="/admin/auth" element={<AdminAuth />} />
      <Route path="/admin/reset-password" element={<AdminResetPassword />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/authority" element={<AuthorityDashboard />} />
      <Route path="/admin/leads/:id" element={<LeadDetail />} />
      <Route path="/admin/conversations/:id" element={<ConversationDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <KateChatWidget
      vapiPublicKey="1ef5359f-d9d0-4079-bcde-32be1631c5ba"
      agentId="00000000-0000-0000-0000-000000000001"
      videoUrl="/videos/Kate-welcome.mp4"
      logoUrl="/conquer-logo.png"
      companyName="Conquer365"
    />
  </>
);

const App = () => {
  const hostname = window.location.hostname;
  const path = window.location.pathname;

  // Clean detection for EJ Context (Subdomain or explicit paths)
  const isEJContext = hostname.startsWith('ej.') ||
    path === '/ej' ||
    path.startsWith('/ej/') ||
    path === '/branch' ||
    path === '/corporate';

  useEffect(() => {
    console.log("🚀 Conquer365 Multi-App Architecture (stable)");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {isEJContext ? <EJApp /> : <MainApp />}
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
