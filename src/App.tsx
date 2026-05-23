import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { RouteGuard } from "@/components/RouteGuard";
import { AuthGate } from "@/components/AuthGate";
import { AuthProvider } from "@/providers/AuthProvider";
import DashboardPage from "@/pages/DashboardPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ProductOverviewTab from "@/pages/tabs/ProductOverviewTab";
import ProductLicencesTab from "@/pages/tabs/ProductLicencesTab";
import ProductUsageTab from "@/pages/tabs/ProductUsageTab";
import ProductAccessTab from "@/pages/tabs/ProductAccessTab";
import ProductIntegrationsTab from "@/pages/tabs/ProductIntegrationsTab";
import ProductAuditTab from "@/pages/tabs/ProductAuditTab";
import ProductDocsTab from "@/pages/tabs/ProductDocsTab";
import ReportsPage from "@/pages/ReportsPage";
import AccessPage from "@/pages/AccessPage";
import LicencesPage from "@/pages/LicencesPage";
import ResourcesPage from "@/pages/ResourcesPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AuthGate><AppLayout /></AuthGate>}>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<RouteGuard allowedPaths={["/products"]}><ProductsPage /></RouteGuard>} />
            <Route path="/products/:productId" element={<RouteGuard allowedPaths={["/products"]}><ProductDetailPage /></RouteGuard>}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<ProductOverviewTab />} />
              <Route path="licences" element={<ProductLicencesTab />} />
              <Route path="usage" element={<ProductUsageTab />} />
              <Route path="access" element={<ProductAccessTab />} />
              <Route path="integrations" element={<ProductIntegrationsTab />} />
              <Route path="audit" element={<ProductAuditTab />} />
              <Route path="docs" element={<ProductDocsTab />} />
            </Route>
            <Route path="/reports" element={<RouteGuard allowedPaths={["/reports"]}><ReportsPage /></RouteGuard>} />
            <Route path="/access" element={<RouteGuard allowedPaths={["/access"]}><AccessPage /></RouteGuard>} />
            <Route path="/licences" element={<RouteGuard allowedPaths={["/licences"]}><LicencesPage /></RouteGuard>} />
            <Route path="/resources" element={<RouteGuard allowedPaths={["/resources"]}><ResourcesPage /></RouteGuard>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
