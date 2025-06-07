import React, { useState, useEffect } from "react";
import useSound from "use-sound";
import { toast } from "sonner";

interface SoundPlayerProps {
  soundUrl: string | null;
  autoPlay?: boolean;
  onComplete?: () => void;
}

const SoundPlayer: React.FC<SoundPlayerProps> = ({ 
  soundUrl, 
  autoPlay = false,
  onComplete 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const [play, { stop, duration }] = useSound(soundUrl || "", {
    onend: () => {
      setIsPlaying(false);
      if (onComplete) onComplete();
    },
    onplay: () => setIsPlaying(true),
    onpause: () => setIsPlaying(false),
    onload: () => {
      console.log("Sound loaded:", soundUrl);
    },
    onloaderror: (id, error) => {
      console.error("Error loading sound:", error);
      toast.error("حدث خطأ في تشغيل الصوت");
    }
  });

  useEffect(() => {
    if (autoPlay && soundUrl) {
      try {
        play();
      } catch (error) {
        console.error("Failed to play sound:", error);
      }
    }
    return () => {
      stop();
    };
  }, [soundUrl, autoPlay, play, stop]);

  return null; // This component doesn't render anything visible
};

export default SoundPlayer;
