import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupNotificationClickHandlers } from '../utils/notifications';

/**
 * Hook to initialize notification handlers
 */
const useNotificationHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize notification click handlers
    setupNotificationClickHandlers((route) => {
      console.log('Navigating to:', route);
      navigate(route);
    });

    // No cleanup needed for notification listeners as they persist for the app lifecycle
  }, [navigate]);
};

export default useNotificationHandler;
