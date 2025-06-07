import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AzkarList from "./pages/AzkarList";
import ComprehensiveDuas from "./pages/ComprehensiveDuas";
import Tasbih from "./pages/Tasbih";
import Qibla from "./pages/Qibla";
import Settings from "./pages/Settings";
import PrayerTimes from "./pages/PrayerTimes";
import PrayerTimesSettings from "./pages/PrayerTimesSettings";
import AppFeatures from "./pages/AppFeatures";
import AppearanceSettings from "./pages/AppearanceSettings";
import LanguageSettings from "./pages/LanguageSettings";
import HelpPage from "./pages/HelpPage";
import ContactPage from "./pages/ContactPage";
import NewsletterPage from "./pages/NewsletterPage";
import SunnahPrayers from "./pages/SunnahPrayers";
import DuhaPrayer from "./pages/DuhaPrayer";
import More from "./pages/More";
import MoreDuas from "./pages/MoreDuas";
import DuaCategory from "./pages/DuaCategory";
import Favorites from "./pages/Favorites";
import ForbiddenPrayerTimes from "./pages/ForbiddenPrayerTimes";
import MonthlyPrayerTimes from "./pages/MonthlyPrayerTimes";
import Search from "./pages/Search";
import DuaEtiquettes from "./pages/DuaEtiquettes"; // Import the new page component
import NamesOfAllah from "./pages/NamesOfAllah"; // Import the Names of Allah page component
import FadlAlDhikr from "./pages/FadlAlDhikr"; // Import the new Fadl Al Dhikr page component
// Removed old import: import AlertSystemPage from "./pages/AlertSystemPage";
import AlertSystemIndexPage from "./alert-system/pages/Index"; // Import new index page
import AlertDetailPage from "./alert-system/pages/AlertDetailPage"; // Import new detail page
import SoundSelectorPage from "./alert-system/pages/SoundSelectorPage"; // Import sound selector page
import UpcomingAlertsPage from "./alert-system/pages/UpcomingAlertsPage"; // Import upcoming alerts page
import FridaySunan from "./pages/FridaySunan"; // Corrected import path for Friday Sunan page
import Tasabeeh from "./pages/Tasabeeh"; // Import the new Tasabeeh page
import FridayDua from "./pages/FridayDua"; // Import Friday Dua page
import SurahKahf from "./pages/SurahKahf"; // Import Surah Kahf page


export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/category/:categoryId" element={<AzkarList />} />
    {/* Route for specific comprehensive dua category */}
    <Route path="/comprehensive-duas/:categoryId" element={<ComprehensiveDuas />} />
    {/* Route for all comprehensive duas */}
    <Route path="/comprehensive-duas" element={<ComprehensiveDuas />} />
    <Route path="/tasbih" element={<Tasbih />} />
    <Route path="/qibla" element={<Qibla />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/prayer-times-settings" element={<PrayerTimesSettings />} />
    <Route path="/app-features" element={<AppFeatures />} />
    <Route path="/appearance-settings" element={<AppearanceSettings />} />
    <Route path="/language-settings" element={<LanguageSettings />} />
    <Route path="/help" element={<HelpPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/newsletter" element={<NewsletterPage />} />
    <Route path="/prayer-times" element={<PrayerTimes />} />
    <Route path="/sunnah-prayers" element={<SunnahPrayers />} />
    <Route path="/duha-prayer" element={<DuhaPrayer />} />
    <Route path="/forbidden-times" element={<ForbiddenPrayerTimes />} />
    <Route path="/monthly-prayer-times" element={<MonthlyPrayerTimes />} />
    <Route path="/more" element={<More />} />
    {/* Route for More section duas */}
    <Route path="/more-duas/:categoryId" element={<MoreDuas />} />
    <Route path="/more-duas" element={<MoreDuas />} />
    <Route path="/dua-category/:categoryId" element={<DuaCategory />} />
    <Route path="/favorites" element={<Favorites />} />
    <Route path="/search" element={<Search />} />
    {/* Updated routes for the Alert System */}
    <Route path="/alert-system" element={<AlertSystemIndexPage />} />
    <Route path="/alert-system/alert/:id" element={<AlertDetailPage />} />
    <Route path="/alert-system/sounds" element={<SoundSelectorPage />} />
    <Route path="/alert-system/upcoming" element={<UpcomingAlertsPage />} />
    <Route path="/friday-sunan" element={<FridaySunan />} /> {/* Add route for Friday Sunan */}
    <Route path="/friday-sunan/dua" element={<FridayDua />} /> {/* Add route for Friday Dua */}
    <Route path="/friday-sunan/surah-kahf" element={<SurahKahf />} /> {/* Add route for Surah Kahf */}
    <Route path="/dua-etiquettes" element={<DuaEtiquettes />} /> {/* Add route for Dua Etiquettes */}
    <Route path="/names-of-allah" element={<NamesOfAllah />} /> {/* Add route for Names of Allah */}
    <Route path="/fadl-al-dhikr" element={<FadlAlDhikr />} /> {/* Add route for Fadl Al Dhikr */}
    <Route path="/tasabeeh" element={<Tasabeeh />} /> {/* Add route for Tasabeeh list */}
    <Route path="/tasabeeh/:id" element={<Tasabeeh />} /> {/* Add route for specific Tasbeeh */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);
