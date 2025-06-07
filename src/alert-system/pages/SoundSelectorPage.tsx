import React, { useState, useEffect, useRef } from "react"; // Added useRef
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation, remove useParams
import { HeaderWithBack } from "../components/layout/header"; // Corrected path
import { useAlert } from "../contexts/alert-context"; // Corrected path
import { SoundSelector } from "../components/sound-selector"; // Corrected path
import { AlertSound } from "../types"; // Corrected path
import { toast } from "sonner";
// Removed useSound import

const SoundSelectorPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use location to get query params
  const searchParams = new URLSearchParams(location.search);
  const alertId = searchParams.get("alertId") || "main"; // Get alertId from query param, default to "main"

  const { sounds, updateAlertSound, getSetting, getSelectedSound } = useAlert();
  
  const setting = getSetting(alertId); // Use alertId
  const currentSound = getSelectedSound(alertId); // Use alertId
  
  // التحقق من صحة معرف التنبيه
  useEffect(() => {
    if (!setting) {
      toast.error('لم يتم العثور على التنبيه المطلوب');
      navigate('/'); // Navigate back to main app page or alert index?
    }
  }, [setting, navigate]);

  const [selectedSoundId, setSelectedSoundId] = useState<string | undefined>(
    currentSound?.id
  );
  
  // Use useRef to hold the audio instance
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup effect for the audio instance - runs only on unmount
  useEffect(() => {
    // Return a cleanup function
    return () => {
      if (audioRef.current) {
        console.log("Cleaning up audio ref instance on unmount");
        audioRef.current.pause();
        audioRef.current.src = ""; // Release resource
        audioRef.current = null; // Clear the ref
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount and cleanup on unmount

  // Function to initialize the audio element if needed
  const ensureAudioElement = (): HTMLAudioElement => {
    if (!audioRef.current) {
      console.log("Initializing Audio Element");
      audioRef.current = new Audio();
      // Set up listeners that only need to be set once
      audioRef.current.onended = () => {
        console.log("Audio finished playing (reusable element)");
        // Don't nullify the ref here, just ensure it's paused/reset if needed
        if(audioRef.current) {
          audioRef.current.currentTime = 0;
        }
      };
      audioRef.current.onerror = (e) => {
        console.error("Audio loading/playback error (reusable element):", e);
        toast.error("فشل تحميل أو تشغيل الصوت");
         if(audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      };
    }
    return audioRef.current;
  };

  // Function to stop the current test sound (using the single instance) - Simplified
  const stopTestSound = () => {
    const currentAudio = audioRef.current; 
    if (currentAudio && !currentAudio.paused) { // Check if actually playing
      console.log("Stopping test sound (reusable element)");
      currentAudio.pause();
      currentAudio.currentTime = 0; // Reset time
    }
    // Keep the ref pointing to the element
  };

  const handleSelectSound = (soundId: string) => {
    try {
      stopTestSound(); // Stop test sound before selecting and navigating
      setSelectedSoundId(soundId);
      updateAlertSound(alertId, soundId); // Use alertId
      toast.success('تم تحديث الصوت بنجاح');
      navigate(-1); // Go back to the previous page (AlertDetailPage)
    } catch (error) {
      console.error('Error updating sound:', error);
      toast.error('حدث خطأ أثناء تحديث الصوت');
    }
  };

  const handleTestSound = (sound: AlertSound) => {
    // 1. Stop any currently playing sound
    stopTestSound();

    // 2. Use the single audio element
    if (sound.url) { // Use sound.url instead of sound.src
      try {
        const audioElement = ensureAudioElement(); // Get or create the single instance
        
        // Check if url needs updating
        if (audioElement.src !== sound.url) { // Compare with sound.url
           audioElement.src = sound.url; // Assign sound.url
           audioElement.load(); // Load the new source
        } else {
           // If url is the same, reset time to play from start
           audioElement.currentTime = 0;
        }

        // Play (listeners are already attached in ensureAudioElement)
        audioElement.play().catch(error => {
          // Error handling is mostly done by the persistent onerror listener
          console.error("Error calling play:", error);
          // Ensure it's paused if play fails immediately
           if(audioRef.current) {
             audioRef.current.pause();
             audioRef.current.currentTime = 0;
           }
         }); // Corrected: removed semicolon, added closing parenthesis for catch
 
         // Removed toast notification: toast.info(`اختبار صوت: ${sound.name}`);
 
       } catch (error) {
         console.error("Error managing reusable Audio object:", error);
         toast.error("حدث خطأ عند محاولة تشغيل الصوت");
      }
    } else {
       toast.info("لا يوجد ملف صوتي لهذا الخيار");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white" dir="rtl">
      <HeaderWithBack title="اختر الصوت" />
      
      <div className="text-center mb-4 p-4">
        <p className="text-gray-400">
          اختر صوت المنبه. لا يوجد حاليًا الأذان كاملاً لأن التنبيه في أجهزة آبل محدود بـ 30 ثانية فقط. عند استلامك التنبيه اضغط عليه لتسمع الأذان كاملاً.
        </p>
      </div>
      
      <SoundSelector
        sounds={sounds}
        onSelectSound={handleSelectSound}
        selectedSoundId={selectedSoundId}
        onTestSound={handleTestSound}
      />
    </div>
  );
};

export default SoundSelectorPage;
