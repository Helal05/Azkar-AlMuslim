import React from "react";
import { Bell, ArrowRight, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showSettings?: boolean;
  onBack?: () => void;
  onSettings?: () => void;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  showSettings = false,
  onBack,
  onSettings,
}: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleSettings = () => {
    // Navigate directly to the main app settings page
    navigate('/settings'); 
  };

  return (
    <div className="bg-gray-900 py-3 px-4 flex items-center justify-between border-b border-gray-800">
      <div className="flex items-center">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 ml-2 text-blue-400 focus:outline-none flex items-center"
          >
            <ArrowRight className="h-5 w-5" />
            <span className="text-lg mr-1">رجوع</span>
          </button>
        )}
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-white text-lg font-medium">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
      </div>
      <div className="w-20 flex justify-end"> {/* Adjusted width and alignment for RTL */}
        {showSettings && (
          <button
            onClick={handleSettings}
            className="p-2 text-blue-400 focus:outline-none flex items-center" // Removed mr-2
          >
            {/* Changed Icon to ArrowRight and added text */}
            <span className="text-lg ml-1">رجوع</span> 
            <ArrowRight className="h-5 w-5" /> 
          </button>
        )}
        {!showSettings && !showBack && (
          <div className="w-10 h-6"></div>
        )}
      </div>
    </div>
  );
}

export function HeaderWithBack({ title, subtitle }: { title: string; subtitle?: string }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 py-3 px-4 flex items-center justify-between border-b border-gray-800">
      <button
        onClick={() => navigate(-1)}
        className="p-2 text-blue-400 focus:outline-none flex items-center"
      >
        <ArrowRight className="h-5 w-5" />
        <span className="text-lg mr-1">رجوع</span>
      </button>
      <div className="text-center flex-grow">
        <h1 className="text-white text-lg font-medium">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
      </div>
      <div className="w-20"></div> {/* Spacer for balance */}
    </div>
  );
}
