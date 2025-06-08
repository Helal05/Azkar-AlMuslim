import React from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { cn } from "@/alert-system/lib/utils"; // Corrected import path
import { useAlert } from "@/alert-system/contexts/alert-context"; // Also correcting this one for consistency

export const NavigationItem = ({ 
  title,
  to,
  icon: Icon, // Note: This prop seems unused as Bell is hardcoded below
  showArrow = true,
  forceActive // Add the new prop
}: {
  title: string;
  to: string;
  icon?: React.ReactNode; // Keep for potential future use
  showArrow?: boolean;
  forceActive?: boolean; // Make it optional
}) => {
  const { settings } = useAlert();
  // Find the setting based on title, only relevant if forceActive is not true
  const setting = settings.find(s => s.nameArabic === title);
  // Determine if the item should appear active
  const isActive = forceActive === true || setting?.enabled === true;

  return (
    <Link to={to} className="block">
      <div className="flex items-center justify-between p-4 hover:bg-gray-700/50">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Use isActive to determine color */}
          <Bell 
            className={cn(
              "h-5 w-5",
              isActive ? "text-purple-400" : "text-gray-400" // Use isActive
            )} 
          />
          {/* Keep the arrow logic as is */}
          {showArrow && <span className="text-gray-400">←</span>} 
        </div>
        <div className="text-right">
          <span className="text-white">{title}</span>
        </div>
      </div>
    </Link>
  );
};

interface ToggleSettingProps {
  title: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  showArrow?: boolean;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({
  title,
  enabled,
  onChange,
  showArrow = true
}) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-700/50 cursor-pointer" onClick={() => onChange(!enabled)}>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <input
          type="checkbox"
          id={title}
          className="hidden"
          checked={enabled}
          onChange={() => onChange(!enabled)}
        />
        <label htmlFor={title} className="toggle-switch">
          <div className="toggle-track">
            <div className="toggle-thumb"></div>
          </div>
        </label>
        {showArrow && <span className="text-gray-400">←</span>}
      </div>
      <div className="text-right">
        <span className="text-white">{title}</span>
      </div>
    </div>
  );
};
