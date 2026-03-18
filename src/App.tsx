import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import OfflineBanner from "@/components/OfflineBanner";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import SubjectSelect from "./pages/SubjectSelect";
import Questions from "./pages/Questions";
import Exam from "./pages/Exam";
import ExamHistory from "./pages/ExamHistory";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const shouldUseHashRouter = () => {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent || "";
  const isMedianWebView = /median/i.test(ua);
  const lacksServiceWorker = !("serviceWorker" in navigator);
  const isLikelyWebView = /\bwv\b/i.test(ua) || (/iphone|ipad|ipod/i.test(ua) && !/safari/i.test(ua));

  return isMedianWebView || (lacksServiceWorker && isLikelyWebView);
};

const Router = shouldUseHashRouter() ? HashRouter : BrowserRouter;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <OfflineBanner />
        <Toaster />
        <Sonner />
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/subject/:categoryId" element={<SubjectSelect />} />
            <Route path="/all/:categoryId" element={<Questions />} />
            <Route path="/questions/:categoryId/:subjectId" element={<Questions />} />
            <Route path="/exam/:categoryId" element={<Exam />} />
            <Route path="/history" element={<ExamHistory />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

