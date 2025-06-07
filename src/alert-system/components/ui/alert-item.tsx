
import React from "react";
import { Check, Play } from "lucide-react"; // Added Play
import { cn } from "@/lib/utils";
import { Button } from "./button"; // Added Button import

interface AlertItemProps {
  text: string;
  timeText?: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  showTestButton?: boolean; // Added prop
  onTestClick?: (event: React.MouseEvent) => void; // Added prop
}

export function AlertItem({ 
  text, 
  timeText, 
  onClick, 
  selected, 
  className, 
  showTestButton, 
  onTestClick 
}: AlertItemProps) {
  
  const handleTestButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the main onClick
    if (onTestClick) {
      onTestClick(event);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer",
        className
      )}
      onClick={onClick} // Main click for selection
    >
      {/* Optional Test Button */}
      {showTestButton && onTestClick && (
         <Button 
           variant="ghost" 
           size="icon" 
           className="mr-3 flex-shrink-0" // Added margin-right
           onClick={handleTestButtonClick}
         >
           <Play className="h-5 w-5 text-blue-400" />
         </Button>
      )}

      {/* Main Content */}
      <div className="flex-grow text-right">
        <div className="font-medium text-white">{text}</div>
        {timeText && <div className="text-gray-400 text-sm">{timeText}</div>}
      </div>

      {/* Selection Checkmark */}
      {selected && (
        <div className="flex-shrink-0 ml-2"> {/* Changed to margin-left */}
          <Check className="h-6 w-6 text-green-500" />
        </div>
      )}
    </div>
  );
}

export function AlertItemWithCheck({ text, selected, onClick }: AlertItemProps) {
  return (
    <div
      className="flex items-center justify-between p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-grow text-right">
        <div className="font-medium text-white">{text}</div>
      </div>
      {selected && (
        <div className="flex-shrink-0 ml-2">
          <Check className="h-6 w-6 text-green-500" />
        </div>
      )}
    </div>
  );
}
