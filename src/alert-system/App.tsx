import { Toaster } from "sonner";
import { TooltipProvider } from "@alert-system/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AlertProvider } from "@alert-system/contexts/alert-context";
import Index from "@alert-system/pages/Index";
import AlertDetailPage from "@alert-system/pages/AlertDetailPage";
import SoundSelectorPage from "@alert-system/pages/SoundSelectorPage";
import UpcomingAlertsPage from "@alert-system/pages/UpcomingAlertsPage";
import NotFound from "@alert-system/pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle direct navigation from URL parameters
    const params = new URLSearchParams(location.search);
    const alertId = params.get('alertId');
    if (alertId) {
      navigate(`/alert/${alertId}`);
    }

    // Handle navigation messages from parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'NAVIGATE_TO_ALERT' && event.data.alertId) {
        navigate(`/alert/${event.data.alertId}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, location]);

  return (
    <AlertProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/alert/:id" element={<AlertDetailPage />} />
        <Route path="/sounds/:id" element={<SoundSelectorPage />} />
        <Route path="/upcoming-alerts" element={<UpcomingAlertsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AlertProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
