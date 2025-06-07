import React from "react";
import { AlertItem } from "./ui/alert-item"; // Corrected path
import { AlertTime } from "../types"; // Corrected path

interface TimeSelectorProps {
  times: AlertTime[];
  onSelectTime: (timeId: string) => void;
  selectedTimeId?: string;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  times,
  onSelectTime,
  selectedTimeId,
}) => {
  return (
    <div className="bg-gray-900 divide-y divide-gray-800">
      <div className="py-2 px-4 text-right">
        <h3 className="text-white text-md">اختر وقت التنبيه</h3>
      </div>
      <div>
        {times.map((time) => (
          <AlertItem
            key={time.id}
            text={time.name}
            timeText={time.timeText}
            selected={selectedTimeId === time.id || time.enabled}
            onClick={() => onSelectTime(time.id)}
          />
        ))}
      </div>
    </div>
  );
};
