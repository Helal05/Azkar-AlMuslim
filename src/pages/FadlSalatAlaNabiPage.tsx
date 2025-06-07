import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { fadlSalatAlaNabi } from "../data/fadlSalatAlaNabiData";

const FadlSalatAlaNabiPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-black p-4 flex items-center justify-between">
        <button onClick={() => navigate("/more")} className="p-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">فضل الصلاة على النبي صلى الله عليه وسلم</h2>
        <div className="w-5"></div> {/* Placeholder for alignment */}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {fadlSalatAlaNabi.map((dua) => (
          <div key={dua.id} className="mb-4">
            <p className="text-right text-lg font-arabic leading-relaxed">
              {dua.text}
            </p>
            {dua.reference && (
              <p className="text-right text-sm text-gray-400 mt-1 font-arabic">
                {dua.reference}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FadlSalatAlaNabiPage;
