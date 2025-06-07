
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Search as SearchIcon, X, ChevronRight } from "lucide-react"; // Added ChevronRight
import { useAppSettings } from "../contexts/AppSettingsContext";
// Import azkarItems and azkarCategories statically
import { azkarItems, azkarCategories } from "../data/azkarData"; 

interface SearchResult {
  id: string;
  type: 'azkar' | 'dua' | 'prayer';
  title: string;
  text?: string;
  category?: string;
  path: string;
}

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useAppSettings();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Get search query from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    } else {
      const savedQuery = localStorage.getItem("search-query");
      if (savedQuery) {
        setSearchQuery(savedQuery);
        performSearch(savedQuery);
      }
    }
  }, [location.search]);
  
  // Perform search (remove async as import is now static)
  const performSearch = (query: string) => { 
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // In a real app, this would search through a database or API
    // For this demo, we'll simulate searching through the azkar data
    
    const searchResults: SearchResult[] = [];
    const lowerCaseQuery = query.toLowerCase();
    
    // 1. Search in Azkar Items (Arabic text and benefit)
    // Use statically imported azkarItems and azkarCategories
    azkarItems.forEach(item => {
      const category = azkarCategories.find(cat => cat.id === item.category);
      const categoryName = category ? category.name : (settings.language === 'ar' ? 'غير مصنف' : 'Uncategorized');
      
      const textToSearch = [
        item.arabic,
        item.benefit || '',
        // Add other fields to search if needed (e.g., item.translation)
      ].join(' ').toLowerCase();
      
      if (textToSearch.includes(lowerCaseQuery)) {
        searchResults.push({
          id: `azkar-${item.id}`,
          type: 'azkar',
          title: item.arabic.substring(0, 50) + "...", // Show snippet of the azkar
          text: item.benefit || '', // Show benefit as text snippet
          category: categoryName,
          // Navigate to the category page, highlighting the specific item might need more work later
          path: `/category/${item.category}` 
        });
      }
    });

    // 2. Search in Azkar Categories
    // Use statically imported azkarCategories
    azkarCategories.forEach(category => {
      const categoryName = category.name; // Use the original name for display
      if (categoryName.toLowerCase().includes(lowerCaseQuery)) {
         // Avoid adding duplicate category results if items from it were already found
         if (!searchResults.some(res => res.id === `category-${category.id}` && res.type === 'azkar')) {
            searchResults.push({
              id: `category-${category.id}`,
              type: 'azkar',
              title: categoryName,
              category: settings.language === 'ar' ? 'فئة' : 'Category',
              path: `/category/${category.id}`
            });
         }
      }
    });
    
    // 3. Search for Prayer Times related keywords
    const prayerTimeKeywords = ["صلاة", "prayer", "salah", "adhan", "أذان", "صلوات", "prayers", "time", "وقت", "مواقيت"];
    
    if (prayerTimeKeywords.some(keyword => query.toLowerCase().includes(keyword.toLowerCase()))) {
      searchResults.push({
        id: "prayer-times",
        type: 'prayer',
        title: settings.language === "ar" ? "مواقيت الصلاة" : "Prayer Times",
        category: settings.language === "ar" ? "الصلاة" : "Prayer",
        path: "/prayer-times"
      });
      
      searchResults.push({
        id: "monthly-prayer-times",
        type: 'prayer',
        title: settings.language === "ar" ? "جدول مواقيت الصلاة الشهري" : "Monthly Prayer Times",
        category: settings.language === "ar" ? "الصلاة" : "Prayer",
        path: "/monthly-prayer-times"
      });
    }
    
    setResults(searchResults);
    setIsSearching(false);
  };
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
    localStorage.setItem("search-query", searchQuery);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    localStorage.removeItem("search-query");
    navigate("/search");
  };
  
  return (
    // Apply theme background
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Themed Header */}
      <div className="bg-background text-foreground p-4 flex items-center justify-between border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 text-foreground hover:text-primary">
           {/* Use appropriate back arrow based on language */}
           {settings.language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        <h2 className="text-xl font-arabic font-bold">
          {settings.language === "ar" ? "البحث" : "Search"}
        </h2>
        <div className="w-5"></div> {/* Empty for alignment */}
      </div>
      
      {/* Themed Search Input Area */}
      <div className="p-3 bg-background border-b border-border">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={settings.language === "ar" ? "اكتب للبحث..." : "Type to search..."}
            // Apply themed input styles
            className="w-full bg-muted text-foreground rounded-lg py-3 px-4 pr-12 font-arabic border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
            dir={settings.language === "ar" ? "rtl" : "ltr"}
          />
          
          {/* Themed Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-14 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/40"
            >
              <X className="h-4 w-4 text-foreground/70" />
            </button>
          )}
          
          {/* Themed Search Button */}
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary/10 hover:bg-primary/20 rounded-md"
          >
            <SearchIcon className="h-5 w-5 text-primary" />
          </button>
        </form>
      </div>
      
      {/* Themed Search Results Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isSearching ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-center">
              {/* Themed Loading Text */}
              <p className="text-muted-foreground font-arabic">
                {settings.language === "ar" ? "جاري البحث..." : "Searching..."}
              </p>
            </div>
          </div>
        ) : (
          <>
            {searchQuery && results.length === 0 ? (
              <div className="text-center py-10">
                 {/* Themed No Results Text */}
                <p className="text-muted-foreground font-arabic">
                  {settings.language === "ar" 
                    ? `لا توجد نتائج لـ "${searchQuery}"`
                    : `No results found for "${searchQuery}"`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.length > 0 && (
                   /* Themed Results Count */
                  <p className="text-sm text-muted-foreground mb-2">
                    {settings.language === "ar" 
                      ? `تم العثور على ${results.length} نتيجة`
                      : `Found ${results.length} results`}
                  </p>
                )}
                
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    // Themed Result Card
                    className="bg-card rounded-lg p-4 border border-border hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => navigate(result.path)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                         {/* Themed Category Text */}
                        <p className="text-sm text-primary mb-1">
                          {result.category}
                        </p>
                         {/* Themed Title Text */}
                        <h3 className="text-foreground font-arabic text-lg">
                          {result.title}
                        </h3>
                         {/* Themed Snippet Text */}
                        {result.text && (
                          <p className="text-muted-foreground text-sm mt-2">
                            {result.text}
                          </p>
                        )}
                      </div>
                       {/* Themed Type Badge */}
                      <div className={`py-1 px-2 rounded text-xs ${
                        result.type === 'azkar' 
                          ? 'bg-green-500/10 text-green-500' // Use theme-friendly colors
                          : 'bg-amber-500/10 text-amber-500' // Use theme-friendly colors
                      }`}>
                        {result.type === 'azkar' 
                          ? (settings.language === "ar" ? 'ذكر' : 'Azkar')
                          : (settings.language === "ar" ? 'صلاة' : 'Prayer')}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
