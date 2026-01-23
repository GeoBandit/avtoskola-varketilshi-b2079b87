import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import Index from "./pages/Index";
import SubjectSelect from "./pages/SubjectSelect";
import Questions from "./pages/Questions";
import Exam from "./pages/Exam";
import ExamHistory from "./pages/ExamHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/subject/:categoryId" element={<SubjectSelect />} />
            <Route path="/all/:categoryId" element={<Questions />} />
            <Route path="/questions/:categoryId/:subjectId" element={<Questions />} />
            <Route path="/exam/:categoryId" element={<Exam />} />
            <Route path="/history" element={<ExamHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
