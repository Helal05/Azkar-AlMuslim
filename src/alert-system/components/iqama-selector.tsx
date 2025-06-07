import React from "react";
import { AlertItem } from "./ui/alert-item"; // Corrected path
import { Plus, Minus } from "lucide-react";

interface IqamaSelectorProps {
  enabled: boolean;
  onToggle: () => void;
  offsetMinutes: number;
  onIncreaseOffset: () => void;
  onDecreaseOffset: () => void;
}

export const IqamaSelector: React.FC<IqamaSelectorProps> = ({
  enabled,
  onToggle,
  offsetMinutes,
  onIncreaseOffset,
  onDecreaseOffset,
}) => {
  return (
    <div className="bg-gray-800 rounded-md mb-6">
      <div className="p-4 text-right">
        <h3 className="text-lg font-medium mb-3">تنبيه الإقامة</h3>

        <div className="bg-gray-900 divide-y divide-gray-800 rounded-md">
          <AlertItem
            text={enabled ? "تنبيه الإقامة مفعل" : "تنبيه الإقامة غير مفعل"}
            timeText={`بعد الأذان بـ ${offsetMinutes} دقيقة`}
            selected={enabled}
            onClick={onToggle}
          />
        </div>

        {enabled && (
          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-3">
              كم دقيقة بعد الأذان تريد تنبيه الإقامة؟
            </p>

            <div className="flex items-center justify-between bg-gray-900 rounded-md p-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center disabled:opacity-50"
                  onClick={onIncreaseOffset}
                  disabled={offsetMinutes >= 30}
                >
                  <Plus className="h-5 w-5" />
                </button>
                <button
                  className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center disabled:opacity-50"
                  onClick={onDecreaseOffset}
                  disabled={offsetMinutes <= 5}
                >
                  <Minus className="h-5 w-5" />
                </button>
              </div>
              <div className="text-right">
                <span className="text-xl">{offsetMinutes} دقيقة</span>
              </div>
            </div>

            <p className="text-gray-400 text-sm mt-3">
              سيصلك تنبيه الإقامة بعد {offsetMinutes} دقيقة من وقت الأذان.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
