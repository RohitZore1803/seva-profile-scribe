
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import DashboardPandit from "./pages/DashboardPandit";
import DashboardCustomer from "./pages/DashboardCustomer";
import DashboardAdmin from "./pages/DashboardAdmin";
import ServicesPage from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PoojaDetailPage from "./pages/PoojaDetailPage";
import CredentialsPage from "./pages/CredentialsPage";
import CancelPolicy from "./pages/CancelPolicy";
import Terms from "./pages/Terms";
import Policy from "./pages/Policy";
import EraseMyData from "./pages/EraseMyData";
import LiveStreams from "./pages/LiveStreams";
import AstrologyHub from "./pages/AstrologyHub";
import Loyalty from "./pages/Loyalty";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route path="/dashboard-pandit" element={<DashboardPandit />} />
            <Route path="/dashboard-customer" element={<DashboardCustomer />} />
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/live-streams" element={<LiveStreams />} />
            <Route path="/astrology" element={<AstrologyHub />} />
            <Route path="/loyalty" element={<Loyalty />} />
            <Route path="/product/:id" element={<PoojaDetailPage />} />
            <Route path="/credentials/:id" element={<CredentialsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cancelpolicy" element={<CancelPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/erase" element={<EraseMyData />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
