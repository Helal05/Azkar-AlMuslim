import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { prophetDuas } from "../data/prophetDuasData";

const ProphetDuasPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-black p-4 flex items-center justify-between">
        <button onClick={() => navigate("/more")} className="p-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">أدعية الأنبياء من القرآن الكريم</h2>
        <div className="w-5"></div> {/* Placeholder for alignment */}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {prophetDuas.map((prophetDuaCategory) => (
          <div key={prophetDuaCategory.id} className="mb-6">
            <h3 className="text-lg font-arabic font-bold text-blue-400 mb-3 text-right">
              {prophetDuaCategory.name}:
            </h3>
            {prophetDuaCategory.duas.map((dua) => (
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
        ))}
      </div>
    </div>
  );
};

export default ProphetDuasPage;
