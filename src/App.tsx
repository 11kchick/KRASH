import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";
import BrowseTrips from "./pages/BrowseTrips";
import PostTrip from "./pages/PostTrip";
import HowItWorks from "./pages/HowItWorks";
import FeedbackPage from "./pages/FeedbackPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AuthPage from "./pages/AuthPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";
import TripChat from "./pages/TripChat";
import MyTrips from "./pages/MyTrips";
import InstallApp from "./pages/InstallApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<BrowseTrips />} />
              <Route path="/post" element={<PostTrip />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/account" element={<AccountSettings />} />
              <Route path="/my-trips" element={<MyTrips />} />
              <Route path="/trip/:tripId/chat" element={<TripChat />} />
              <Route path="/install" element={<InstallApp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <CookieConsent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
