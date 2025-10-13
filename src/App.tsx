import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import BodyMap from "./pages/BodyMap";
import CancerInfo from "./pages/CancerInfo";
import DNAGenetics from "./pages/DNAGenetics";
import Research from "./pages/Research";
import Prevention from "./pages/Prevention";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import VideosExplore from "./pages/VideosExplore";
import VideoManagement from "./pages/VideoManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/body-map" element={<BodyMap />} />
            <Route path="/cancer/:cancerType" element={<CancerInfo />} />
            <Route path="/dna-genetics" element={<DNAGenetics />} />
            <Route path="/research" element={<Research />} />
            <Route path="/prevention" element={<Prevention />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/videos" element={<VideosExplore />} />
            <Route path="/dashboard/videos" element={<VideoManagement />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
