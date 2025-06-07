
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white" dir="rtl">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-6">عذراً، لم يتم العثور على الصفحة</p>
        <Button 
          variant="default" 
          onClick={() => navigate('/')}
          className="text-lg"
        >
          العودة للصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
