import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { azkarCategories, azkarItems } from "../data/azkarData";
import { prayerAzkarData } from "../data/prayerAzkarData";
import type { PrayerAzkarItem as PrayerAzkarDataItem, PrayerAzkarSection } from "../data/prayerAzkarData"; // Assuming types are exported or defined here
import { tasabeehItems } from "../data/tasabeehData";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { ChevronLeft, ChevronRight, Heart, Share } from "lucide-react";
import { useToast } from "../components/ui/use-toast";

const AzkarList = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  // Get global state and functions from context
  const {
    settings,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useAppSettings();

  // Find the current category
  const category = azkarCategories.find((cat) => cat.id === categoryId) || 
                 (categoryId === "prayerAzkar" ? { id: "prayerAzkar", name: settings.language === "ar" ? "أذكار الصلاة" : "Prayer Azkar" } : undefined);

  // Special handling for Tasbih and Qibla
  if (categoryId === "tasbih") {
    navigate("/tasbih");
    return null;
  }

  if (categoryId === "qibla") {
    navigate("/qibla");
    return null;
  }

  // Get search params for tasabeeh
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tasbeehId = searchParams.get('id');

  // Check if this is a tasabeeh category
  const isTasabeeh = categoryId === "tasabeeh";

  // Define a type for the items that will be rendered
  type AzkarDisplayItem = {
    id: string | number;
    uniqueId: string;
    category: string;
    arabic: string; // For non-prayerAzkar, this is the main text. For prayerAzkar, it's the page title.
    count: number;
    reference?: string;
    benefit?: string;
    translation?: string;
    note?: string;
    suraVerse?: string; // For compatibility with azkarItems
    originalPrayerAzkarItem?: PrayerAzkarDataItem; // To hold the full prayer azkar item
  };

  // Filter azkar or tasabeeh by category/id - useMemo to prevent re-filtering on every render
  const categoryAzkar: AzkarDisplayItem[] = useMemo(() => {
    if (categoryId === "prayerAzkar") {
      return prayerAzkarData.map((item, index) => {
        const originalId = item.id || `prayer-page-${index}`; // Fallback just in case, though item.id should be reliable
        const uniquePrayerId = `prayer_${originalId}`;
        return {
          id: originalId, // Keep original id for other purposes if needed, or use uniquePrayerId
          uniqueId: uniquePrayerId, // Use prefixed ID for favorites and keys
          category: "prayerAzkar",
          arabic: item.title, // Use the main title of the prayer azkar group as the 'arabic' text for display title
          count: 1, // Each "page" or group is counted as 1 to go through
          reference: item.source, // Top-level source if available
          benefit: item.title, // Benefit can be the title itself
          translation: item.translation, // Top-level translation if available
          note: item.note, // Top-level note
          originalPrayerAzkarItem: item, // Store the original complex item
        };
      });
    } else if (isTasabeeh && tasbeehId) {
      const selectedTasbeeh = tasabeehItems.find(item => item.id === tasbeehId);
      if (selectedTasbeeh) {
        return [{
          id: 1, // Or a more specific ID if available
          uniqueId: selectedTasbeeh.uniqueId,
          category: "tasabeeh",
          arabic: selectedTasbeeh.text,
          count: selectedTasbeeh.count,
          reference: selectedTasbeeh.reference,
          benefit: selectedTasbeeh.virtue
        }];
      }
      return [];
    } else {
      return azkarItems.filter((item) => item.category === categoryId);
    }
  }, [categoryId, isTasabeeh, tasbeehId, settings.language]); // Added settings.language for category name

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]); // Keep track of completed indices if needed
  const [azkarCounts, setAzkarCounts] = useState<Record<string, number>>({}); // State for remaining counts

  // Effect to initialize/reset counts and index when the category changes
  useEffect(() => {
    setCurrentIndex(0); // Reset index when category changes
    setCompleted([]); // Reset completed indices
    // Initialize counts from the filtered azkar list
    const initialCounts = categoryAzkar.reduce((acc, azkar) => {
      acc[azkar.uniqueId] = azkar.count || 1; // Ensure count is at least 1
      return acc;
    }, {} as Record<string, number>);
    setAzkarCounts(initialCounts);
  }, [categoryAzkar]);

  // Effect to reset index when category ID changes (redundant if categoryAzkar dependency works)
  // Keep this one for safety, ensures index resets if categoryId changes but categoryAzkar somehow doesn't trigger first.
  useEffect(() => {
    // This effect might be redundant if the one above handles category changes correctly.
    // Consider removing if categoryAzkar dependency is sufficient.
    setCurrentIndex(0);
    setCompleted([]);
    // Re-initializing counts here might overwrite the state set by the previous effect
    // Let's rely on the categoryAzkar effect for count initialization.
  }, [categoryId]);

  if (!category || categoryAzkar.length === 0) {
    // Apply theme to empty state
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Themed Header */}
        <div className="bg-background text-foreground p-4 flex justify-between items-center border-b border-border">
          <button onClick={() => navigate("/")} className="p-2">
            {/* Use appropriate back arrow based on language */}
            {settings.language === "ar" ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>
          <h2 className="text-xl font-arabic font-bold">
            {category?.name || (settings.language === "ar" ? "الأذكار" : "Azkar")}
          </h2>
          <div className="w-5"></div> {/* Spacer */}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl font-arabic text-muted-foreground">
            {settings.language === "ar" ? "لا توجد أذكار في هذا القسم" : "No Azkar found in this section"}
          </p>
        </div>
      </div>
    );
  }

  const currentAzkar = categoryAzkar[currentIndex];
  const isCurrentFavorite = currentAzkar ? isFavorite(currentAzkar.uniqueId) : false;
  const currentRemainingCount = currentAzkar ? azkarCounts[currentAzkar.uniqueId] ?? (currentAzkar.count || 1) : 0;

    const goToNext = () => {
    if (currentIndex < categoryAzkar.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAzkarClick = () => {
    if (!currentAzkar) return;
    const currentCount = azkarCounts[currentAzkar.uniqueId];

    if (currentCount > 0) {
      const newCount = currentCount - 1;
      setAzkarCounts(prevCounts => ({
        ...prevCounts,
        [currentAzkar.uniqueId]: newCount,
      }));

      if (newCount === 0 && currentIndex < categoryAzkar.length - 1) {
        // Use setTimeout to allow the UI to update before navigating
        setTimeout(() => {
          goToNext();
        }, 150); // Small delay to see the '0' briefly if desired
      }
    }
  };

  const toggleFavorite = () => {
    if (!currentAzkar) return;
    const currentlyIsFavorite = isFavorite(currentAzkar.uniqueId); // Check state before deciding action

    if (currentlyIsFavorite) {
      removeFavorite(currentAzkar.uniqueId);
    } else {
      addFavorite(currentAzkar.uniqueId);
    }
  };

  const shareAzkar = () => {
    if (!currentAzkar) return;

    let shareText = currentAzkar.arabic;
    const categoryName = category?.name || (settings.language === "ar" ? "أذكار" : "Azkar");

    if (navigator.share) {
      navigator.share({
        title: categoryName,
        text: shareText,
      }).catch((err) => {
        console.error("Error sharing:", err);
        // Fallback to clipboard if share fails
        navigator.clipboard.writeText(shareText).then(() => {
          toast({
            title: settings.language === "ar" ? "تم النسخ" : "Copied to clipboard",
            description: settings.language === "ar" ? "تم نسخ الذكر إلى الحافظة" : "Dhikr was copied to clipboard",
          });
        });
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: settings.language === "ar" ? "تم النسخ" : "Copied to clipboard",
          description: settings.language === "ar" ? "تم نسخ الذكر إلى الحافظة" : "Dhikr was copied to clipboard",
        });
      });
    }
  };

  return (
    // Apply theme background and ensure full height
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Themed Header */}
      <div className="bg-background text-foreground p-4 flex justify-between items-center border-b border-border sticky top-0 z-10">
        <button onClick={() => isTasabeeh ? navigate("/tasabeeh") : navigate("/")} className="p-2">
          {/* Use appropriate back arrow based on language */}
          {settings.language === "ar" ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>
        <h2 className="text-xl font-arabic font-bold truncate max-w-[70%]">
          {isTasabeeh ? "تسابيح" : category?.name}
        </h2>
        <div className="w-5 h-5"></div> {/* Spacer */}
      </div>

      {/* Main Content Area - Takes remaining space */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Azkar Text Section - Takes most space, scrollable if needed */}
        <div
          key={`azkar-${currentIndex}`}
          className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto cursor-pointer relative"
          onClick={handleAzkarClick} // Use the new handler
        >
          {/* Main Azkar Text - Conditional Rendering */}
          {currentAzkar && currentAzkar.category === "prayerAzkar" && currentAzkar.originalPrayerAzkarItem ? (
            <div className="w-full text-right">
              <h2 className="text-2xl md:text-3xl font-arabic-bold text-primary text-center mb-6 leading-relaxed">
                {currentAzkar.originalPrayerAzkarItem.title}
              </h2>
              {currentAzkar.originalPrayerAzkarItem.note && (
                <p className="text-sm text-amber-600 dark:text-amber-400 font-arabic text-center my-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
                  {currentAzkar.originalPrayerAzkarItem.note}
                </p>
              )}
              {currentAzkar.originalPrayerAzkarItem.arabic_text && (
                <div className="my-4 p-4 bg-card rounded-lg shadow">
                  <p className="arabic-text text-xl md:text-2xl leading-loose">
                    {currentAzkar.originalPrayerAzkarItem.arabic_text}
                  </p>
                  {settings.language === "en" && currentAzkar.originalPrayerAzkarItem.translation && (
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                      {currentAzkar.originalPrayerAzkarItem.translation}
                    </p>
                  )}
                  {currentAzkar.originalPrayerAzkarItem.source && (
                    <p className="text-xs text-muted-foreground/80 mt-2">
                      ({currentAzkar.originalPrayerAzkarItem.source})
                    </p>
                  )}
                </div>
              )}
              {currentAzkar.originalPrayerAzkarItem.sections?.map((section, secIndex) => (
                <div key={`${currentAzkar.id}-section-${section.id || secIndex}`} className="my-5 p-4 bg-card rounded-lg shadow">
                  {section.title && (
                    <h3 className="text-lg md:text-xl font-arabic-semibold text-primary mb-2">
                      {section.title}
                    </h3>
                  )}
                  <p className="arabic-text text-xl md:text-2xl leading-loose">
                    {section.arabic_text}
                  </p>
                  {settings.language === "en" && section.translation && (
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                      {section.translation}
                    </p>
                  )}
                  {section.source && (
                    <p className="text-xs text-muted-foreground/80 mt-2">
                      ({section.source})
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="arabic-text text-2xl md:text-3xl font-bold text-center leading-relaxed">
                {currentAzkar ? currentAzkar.arabic : "..."}
              </p>
              {currentAzkar?.note && (
                <p className="text-sm text-muted-foreground font-arabic text-center mt-3 p-2 bg-amber-100/10 border border-amber-500/20 rounded-md">
                  {currentAzkar.note}
                </p>
              )}
            </>
          )}
        </div>

        {/* Bottom Info Section - Conditional Rendering */}
        {!(currentAzkar?.category === "prayerAzkar") && (
          <div className="p-4 border-t border-border bg-card text-card-foreground text-right overflow-y-auto max-h-[35vh]">
            {currentAzkar?.benefit && (
              <div className="mb-3">
                <p className="text-primary font-arabic text-base font-semibold">
                  {currentAzkar.benefit}
                </p>
              </div>
            )}
            {currentAzkar?.translation && (
              <div className="mb-3">
                <p className="text-muted-foreground text-sm">
                  {currentAzkar.translation}
                </p>
              </div>
            )}
            {currentAzkar?.reference && (
              <p className="text-muted-foreground text-xs font-arabic">
                ({currentAzkar.reference})
              </p>
            )}
            {currentAzkar?.suraVerse && (
              <p className="text-muted-foreground text-xs font-arabic">
                ({currentAzkar.suraVerse})
              </p>
            )}
            {!currentAzkar?.benefit && !currentAzkar?.reference && !currentAzkar?.suraVerse && !currentAzkar?.translation && (
              <p className="text-muted-foreground text-sm font-arabic">
                {settings.language === 'ar' ? 'لا توجد معلومات إضافية لهذا الذكر.' : 'No additional information for this Dhikr.'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar - Fixed at the bottom */}
      <div className="bg-muted/90 backdrop-blur-sm p-3 flex items-center justify-between border-t border-border sticky bottom-0 z-10">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className={`p-2 rounded-full ${currentIndex === 0 ? "text-muted-foreground/50 cursor-not-allowed" : "text-foreground hover:bg-accent"} transition-colors`}
          aria-label={settings.language === 'ar' ? 'السابق' : 'Previous'}
        >
          {settings.language === "ar" ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>

        {/* Central Controls (Progress, Count, Share, Favorite) */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse"> {/* Adjusted spacing */}
          {/* Progress Indicator */}
          <span className="text-muted-foreground font-mono text-sm tabular-nums">
            {currentIndex + 1}/{categoryAzkar.length}
          </span>

          {/* Divider (Optional but good for separation) */}
          <span className="text-muted-foreground/50 mx-1">|</span>

          {/* Remaining Count Display */}
          {currentAzkar && (
            <span className="text-primary font-bold text-sm tabular-nums bg-primary/10 px-2 py-0.5 rounded">
              {currentRemainingCount} {/* Display remaining count from state */}
            </span>
          )}

          {/* Share Button */}
          <button
            onClick={shareAzkar}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 ml-2 rtl:ml-0 rtl:mr-2" /* Added margin for spacing */
            aria-label={settings.language === 'ar' ? 'مشاركة' : 'Share'}
          >
            <Share className="h-5 w-5" />
          </button>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label={settings.language === 'ar' ? 'المفضلة' : 'Favorite'}
          >
            <Heart className={`h-5 w-5 ${isCurrentFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={currentIndex === categoryAzkar.length - 1}
          className={`p-2 rounded-full ${currentIndex === categoryAzkar.length - 1 ? "text-muted-foreground/50 cursor-not-allowed" : "text-foreground hover:bg-accent"} transition-colors`}
          aria-label={settings.language === 'ar' ? 'التالي' : 'Next'}
        >
          {settings.language === "ar" ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default AzkarList;
