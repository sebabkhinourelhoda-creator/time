import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/public/Home";
import BodyMap from "./pages/public/BodyMap";
import TestGLB from "./pages/public/TestGLB";
import CancerInfo from "./pages/public/CancerInfo";
import DNAGenetics from "./pages/public/DNAGenetics";
import Research from "./pages/public/Research";
import Prevention from "./pages/public/Prevention";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import NotFound from "./pages/public/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import VideosExplore from "./pages/public/VideosExplore";
import VideoManagement from "./pages/dashboard/VideoManagement";
import Profile from "./pages/dashboard/Profile";
import DocumentsPage from "./pages/dashboard/DocumentsPage";
import ResearchPapers from "./pages/public/ResearchPapers";
import DashboardResearch from "./pages/dashboard/DashboardResearch";
import DashboardStudies from "./pages/dashboard/DashboardStudies";
import DashboardCollaborations from "./pages/dashboard/DashboardCollaborations";
import DashboardAIAnalysis from "./pages/dashboard/DashboardAIAnalysis";
import DashboardSettings from "./pages/dashboard/DashboardSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminVideosPage from "./pages/admin/AdminVideosPage";
import AdminCommentsPage from "./pages/admin/AdminCommentsPage";
import AdminDocumentsPage from "./pages/admin/AdminDocumentsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import HealthAssessment from "./pages/public/HealthAssessment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/body-map" element={<BodyMap />} />
            <Route path="/test-glb" element={<TestGLB />} />
            <Route path="/cancer/:cancerType" element={<CancerInfo />} />
            <Route path="/dna-genetics" element={<DNAGenetics />} />
            <Route path="/research" element={<Research />} />
            <Route path="/prevention" element={<Prevention />} />
            <Route path="/health-assessment" element={<HealthAssessment />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/videos" element={<VideosExplore />} />
            <Route path="/research-papers" element={<ResearchPapers />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/videos" element={
              <ProtectedRoute>
                <VideoManagement />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/documents" element={
              <ProtectedRoute>
                <DocumentsPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/research" element={
              <ProtectedRoute>
                <DashboardResearch />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/studies" element={
              <ProtectedRoute>
                <DashboardStudies />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/collaborations" element={
              <ProtectedRoute>
                <DashboardCollaborations />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/ai-analysis" element={
              <ProtectedRoute>
                <DashboardAIAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute>
                <DashboardSettings />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes - Require Admin Role */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/comments" element={<AdminCommentsPage />} />
            <Route path="/admin/videos" element={<AdminVideosPage />} />
            <Route path="/admin/videos/comments" element={<AdminCommentsPage />} />
            <Route path="/admin/videos/pending" element={<AdminVideosPage />} />
            <Route path="/admin/documents" element={<AdminDocumentsPage />} />
            <Route path="/admin/documents/comments" element={<AdminCommentsPage />} />
            <Route path="/admin/documents/pending" element={<AdminDocumentsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/comments" element={<AdminCommentsPage />} />
            <Route path="/admin/comments/videos" element={<AdminCommentsPage />} />
            <Route path="/admin/comments/documents" element={<AdminCommentsPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
