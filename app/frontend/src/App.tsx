import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import KnowledgeArticlePage from "@/pages/KnowledgeArticle";
import Admin from "@/pages/Admin";
import AuthCallback from "@/pages/AuthCallback";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/knowledge/:slug" element={<KnowledgeArticlePage />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;