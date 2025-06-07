import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { AlertProvider } from "./alert-system/contexts/alert-context"; // Use the new provider from alert-system
import { AppRoutes } from "./routes";
import NotificationBar from "./components/NotificationBar";
import useAzkarAlerts from "./hooks/useAzkarAlerts";
import usePrayerAlerts from "./hooks/usePrayerAlerts"; // Import the new prayer alert hook
import useNotificationHandler from "./hooks/useNotificationHandler"; // Import notification handler hook
import { requestNotificationPermission } from "./utils/notifications"; // Import from utils
import { Capacitor } from "@capacitor/core"; // Import Capacitor
import PrayerTimes from "./pages/PrayerTimes";
import SurahKahf from "./pages/SurahKahf";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

// Inner component to ensure hooks are called within the provider context
const AppContent: React.FC = () => {
  const [notification, setNotification] = useState<string | null>(null); // Keep notification state if needed here or lift up if App needs it
  useAzkarAlerts(); // Call the existing Azkar alert hook
  usePrayerAlerts(); // Call the new prayer alert hook

  // Initialize notification system
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Request notification permissions
      requestNotificationPermission().then((granted: boolean) => {
        if (granted) {
          console.log('Notification permission granted');
        } else {
          console.warn('Notification permission denied');
          setNotification('يرجى السماح بالإشعارات للحصول على تنبيهات الصلاة والأذكار');
        }
      });
    }
  }, []);

  // TODO: If NotificationBar needs context, it should be moved inside TooltipProvider or another suitable place
  // For now, keeping it outside the main providers but inside AppContent

  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NotificationHandlersInitializer />
          <Routes>
            <Route path="/prayer-times" element={<PrayerTimes />} />
            <Route path="/surah-kahf" element={<SurahKahf />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      {notification && (
        <NotificationBar
          message={notification}
          duration={7000}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

// Component to initialize notification handlers inside Router context
const NotificationHandlersInitializer: React.FC = () => {
  useNotificationHandler(); // Initialize notification handlers inside Router context
  return null; // This component doesn't render anything
};


const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AlertProvider> {/* Keep the new AlertProvider */}
        {/* Removed the wrapper <AlertSettingsProvider> */}
          <AppSettingsProvider>
             {/* Render the inner component which calls the hook */}
            <AppContent />
          </AppSettingsProvider>
        {/* Removed the closing </AlertSettingsProvider> */}
      </AlertProvider>
    </QueryClientProvider>
  );
};

export default App;
