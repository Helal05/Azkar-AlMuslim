import React from "react";
import { AlertItem } from "./ui/alert-item"; // Corrected path
import { AlertSound } from "../types"; // Corrected path
// Removed unused import: import useSound from "use-sound";

interface SoundSelectorProps {
  sounds: AlertSound[];
  onSelectSound: (soundId: string) => void;
  selectedSoundId?: string;
  onTestSound?: (sound: AlertSound) => void;
}

export const SoundSelector: React.FC<SoundSelectorProps> = ({
  sounds,
  onSelectSound,
  selectedSoundId,
  onTestSound, // This is the function to test a sound
}) => {
  // This function now ONLY handles selecting the sound for saving
  const handleSelectSound = (sound: AlertSound) => {
    onSelectSound(sound.id); 
    // Test sound is no longer called here
  };

  return (
    <div className="bg-gray-900 divide-y divide-gray-800">
      <div className="py-2 px-4 flex items-center justify-between">
        <span className="text-blue-400 text-sm" dir="rtl">اختر الصوت</span>
        <h3 className="text-white text-md text-right">اختر صوت المنبه</h3>
      </div>
      <div>
        {sounds.map((sound) => (
          <AlertItem
            key={sound.id}
            text={sound.name}
            selected={selectedSoundId ? sound.id === selectedSoundId : sound.selected}
            onClick={() => handleSelectSound(sound)} // Main click selects
            showTestButton={true} // Show the test button
            onTestClick={() => onTestSound && onTestSound(sound)} // Test button click tests
          />
        ))}
      </div>
    </div>
  );
};

export function SoundSelectorButton({ onPress }: { onPress: () => void }) {
  return (
    <div className="bg-gray-900 px-4 py-3 flex justify-between items-center cursor-pointer" onClick={onPress}>
      <div className="flex items-center">
        <span className="text-blue-400 text-lg">اختر الصوت</span>
      </div>
      <div className="text-white text-lg font-medium text-right">
        صوت المنبه الرئيسي
      </div>
    </div>
  );
}
