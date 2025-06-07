import React, { useState } from "react";
import useSound from "use-sound";
import { toast } from "sonner";

interface TestAlertButtonProps {
  soundUrl: string;
  className?: string;
}

export function TestAlertButton({ soundUrl, className }: TestAlertButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const [play, { stop }] = useSound(soundUrl, {
    onend: () => setIsPlaying(false),
    onload: () => console.log("Sound loaded successfully"),
    onloaderror: () => {
      toast.error("فشل تحميل الصوت");
      console.error("Failed to load sound");
    }
  });

  const handleTestAlert = () => {
    try {
      if (isPlaying) {
        stop();
        setIsPlaying(false);
      } else {
        play();
        setIsPlaying(true);
        toast.info("جاري تشغيل تنبيه تجريبي");
      }
    } catch (error) {
      console.error("Error playing sound:", error);
      toast.error("حدث خطأ في تشغيل التنبيه");
    }
  };

  return (
    <button
      onClick={handleTestAlert}
      className={`w-full bg-gray-700 text-white py-4 rounded-md my-4 ${className}`}
    >
      جرب التنبيه
    </button>
  );
}
