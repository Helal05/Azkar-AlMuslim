import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { NavigationItem } from "../components/alert-settings/toggle-setting"; // Corrected path
import { Header } from "../components/layout/header"; // Corrected path
import { useAlert } from "../contexts/alert-context"; // Corrected path
import { Button } from "../components/ui/button"; // Corrected path
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"; // Corrected path

const Index = () => {
  const navigate = useNavigate();
  const {
    settings, // Keep only one instance
    resetAllAlerts
  } = useAlert();

  // Ensure settings is an array before filtering, provide default empty array if not yet loaded
  const safeSettings = Array.isArray(settings) ? settings : [];

  const prayerSettings = safeSettings.filter(setting =>
    ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha', 'last-third'].includes(setting.id)
  );

  const athkarSettings = safeSettings.filter(setting =>
    ['morning-athkar', 'evening-athkar', 'duha', 'friday-sunnahs', 'white-days', 'misc-athkar'].includes(setting.id)
  );

  // Optional: Add a loading state if settings are not yet loaded
  // if (!settings) {
  //   return <div>Loading...</div>; // Or a spinner component
  // }
  
  // Check if any alert is enabled
  const hasAnyAlertEnabled = safeSettings.some(setting => setting.enabled);

  return (
    <div className="min-h-screen bg-gray-900 text-white" dir="rtl">
      <Header title="منبه الأذكار و الأذان" showSettings={true} />
      
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-6">إعدادات التنبيهات</h2>
      </div>

      <div className="space-y-4">
        {/* Prayer Times Alerts */}
        <div className="bg-gray-800 rounded-lg mx-4 mb-6">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-lg font-medium text-right">مواقيت الصلاة</h3>
          </div>
          <div>
            {prayerSettings.map(setting => (
              <NavigationItem
                key={setting.id}
                title={setting.nameArabic}
                to={`/alert-system/alert/${setting.id}`} // Add /alert-system prefix
                icon={<Bell className="h-5 w-5 text-white mr-2" />}
              />
            ))}
          </div>
        </div>
        
        {/* Athkar Alerts */}
        <div className="bg-gray-800 rounded-lg mx-4 mb-6">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-lg font-medium text-right">الأذكار والتنبيهات</h3>
          </div>
          <div>
            {athkarSettings.map(setting => (
              <NavigationItem
                key={setting.id}
                title={setting.nameArabic}
                to={`/alert-system/alert/${setting.id}`} // Add /alert-system prefix
                icon={<Bell className="h-5 w-5 text-white mr-2" />}
              />
            ))}
          </div>
        </div>
        
        {/* General Settings */}
        <div className="bg-gray-800 rounded-lg mx-4 mb-6">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-lg font-medium text-right">الإعدادات العامة</h3>
          </div>
          <NavigationItem
            title="التنبيهات القادمة"
            to="/alert-system/upcoming" // Add /alert-system prefix
            icon={<Bell className="h-5 w-5 text-white mr-2" />} // Icon prop might be overridden by internal logic, check component
            forceActive={hasAnyAlertEnabled} // Pass the calculated status
          />
          
          <div className="p-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  احذف كل التنبيهات
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد من حذف جميع التنبيهات؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    سيتم حذف جميع إعدادات التنبيهات. هذا الإجراء لا يمكن التراجع عنه.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={resetAllAlerts}>
                    نعم، احذف الكل
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="p-3 text-sm text-red-400 text-right border-t border-gray-700">
            إذا كان منبه الأذان مفعل مع صوت الأذان، تأكد من عدم اصطحاب هاتفك معك في أماكن قضاء الحاجة.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
