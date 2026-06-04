import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import Sustainability from "@/pages/Sustainability";
import Knowledge from "@/pages/Knowledge";
import KnowledgeArticlePage from "@/pages/KnowledgeArticle";
import Contact from "@/pages/Contact";
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
              <Route path="/products" element={<Products />} />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/knowledge/:slug" element={<KnowledgeArticlePage />} />
              <Route path="/contact" element={<Contact />} />
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