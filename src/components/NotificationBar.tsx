import React, { useEffect } from "react";

interface NotificationBarProps {
  message: string;
  duration?: number; // بالمللي ثانية
  onClose: () => void;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ message, duration = 6000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-100 text-amber-900 px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in-down">
      <span className="font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 text-amber-700 hover:text-red-600 text-lg font-bold">&times;</button>
    </div>
  );
};

export default NotificationBar;