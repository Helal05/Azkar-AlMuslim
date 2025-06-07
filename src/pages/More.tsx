import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Import comprehensiveDuas and its types
import { comprehensiveDuas, DuaCategory as ComprehensiveDuaCategoryType } from "../data/comprehensiveDuasData";
// Assuming naturalBackgrounds can still be used or is generic. If not, this needs adjustment.
import { naturalBackgrounds } from "../data/duaData";
import { Search, ChevronLeft } from "lucide-react";

const More = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  // Use comprehensiveDuas for categories
  const [filteredCategories, setFilteredCategories] = useState<ComprehensiveDuaCategoryType[]>(comprehensiveDuas);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  useEffect(() => {
    // Change background periodically
    const bgInterval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % naturalBackgrounds.length);
    }, 120000); // Change background every 2 minutes

    return () => {
      clearInterval(bgInterval);
    };
  }, []);

  useEffect(() => {
    if (searchQuery) {
      // Filter comprehensiveDuas
      const filtered = comprehensiveDuas.filter(category =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.duas.some(dua =>
          dua.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredCategories(filtered);
    } else {
      // Reset to all comprehensiveDuas
      setFilteredCategories(comprehensiveDuas);
    }
  }, [searchQuery, comprehensiveDuas]); // Added comprehensiveDuas to dependency array

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search handled by the useEffect above
  };

  const handleSelectCategory = (categoryId: string) => {
    // This navigation might need to be adjusted if DuaCategory page is not compatible
    // or if a different page/logic is needed for comprehensive dua categories.
    // For now, assuming it might work or will be addressed later.
    // It could also navigate to a specific view within ComprehensiveDuas page:
    // navigate(`/comprehensive-duas/${categoryId}`);
    // Or pass state:
    // navigate('/comprehensive-duas', { state: { selectedCategoryId: categoryId } });
    // For now, let's keep the original navigation pattern, assuming category IDs are unique
    // and the target page can handle it or will be adapted.
    navigate(`/more-duas/${categoryId}`); // Navigate to More section duas
  };

  // Share functionality - needs to be adapted if categoryName comes from category.title
  const shareContent = (categoryId: string, categoryTitle: string) => {
    if (navigator.share) {
      navigator.share({
        title: categoryTitle,
        text: `مشاركة ${categoryTitle} من تطبيق أذكاري`,
        url: `${window.location.origin}/more-duas/${categoryId}`, // Adjusted URL for More section
      }).catch(err => console.error("Error sharing:", err));
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="p-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">المزيد</h2>
        <div className="w-5"></div> {/* Placeholder for alignment */}
      </div>

      {/* Search */}
      <div className="bg-black px-4 py-3">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث ..."
            className="w-full bg-gray-900 text-white rounded-lg py-2 px-4 font-arabic text-right"
          />
          <button
            type="submit"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
          >
            <Search className="h-5 w-5 text-gray-400" />
          </button>
        </form>
      </div>

      {/* Dua Categories Grid */}
      <div className="flex-1 bg-black p-3 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {/* Map over filtered comprehensiveDuas */}
          {filteredCategories.map((category, index) => (
            <div
              key={category.id}
              className="rounded-lg overflow-hidden cursor-pointer" // Added cursor-pointer
              onClick={() => handleSelectCategory(category.id)}
              // onContextMenu={(e) => { e.preventDefault(); shareContent(category.id, category.title); }} // Example for share, might need a proper UI element
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${naturalBackgrounds[(index + backgroundIndex) % naturalBackgrounds.length]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '120px' // Ensure cards have some minimum height
              }}
            >
              <div className="p-4 flex flex-col items-center justify-center h-full"> {/* Ensure text is centered */}
                <h3 className="text-center font-arabic text-lg font-bold text-white">
                  {category.title} {/* Display category.title */}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default More;
