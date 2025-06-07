
import React from "react";
import { HeaderWithBack } from "../components/layout/header"; // Corrected path
import { useAlert } from "../contexts/alert-context"; // Corrected path
import { Bell, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const UpcomingAlertsPage = () => {
  const { settings } = useAlert();
  const enabledSettings = settings.filter(setting => setting.enabled);
  
  // Function to generate some "upcoming" alerts for demonstration
  const getUpcomingAlerts = () => {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    
    return enabledSettings.map((setting, index) => {
      const alertDate = new Date(currentDate);
      alertDate.setHours(currentDate.getHours() + index + 1);
      
      return {
        id: `upcoming-${index}`,
        title: setting.nameArabic,
        time: format(alertDate, 'HH:mm', { locale: ar }),
        date: format(alertDate, 'yyyy/MM/dd', { locale: ar }),
        isToday: alertDate.getDate() === currentDate.getDate()
      };
    });
  };
  
  const upcomingAlerts = getUpcomingAlerts();

  return (
    <div className="min-h-screen bg-gray-900 text-white" dir="rtl">
      <HeaderWithBack title="التنبيهات القادمة" />
      
      <div className="p-4">
        {upcomingAlerts.length > 0 ? (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {upcomingAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="border-b border-gray-700 p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="text-gray-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>{alert.time}</div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">{alert.title}</div>
                  <div className="text-sm text-gray-400">
                    {alert.isToday ? 'اليوم' : 'غداً'} - {alert.date}
                  </div>
                </div>
                <div className="text-blue-400">
                  <Bell className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10">
            <div className="inline-block p-4 bg-gray-800 rounded-full mb-4">
              <Bell className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">لا توجد تنبيهات قادمة</h3>
            <p className="text-gray-400">
              قم بتفعيل بعض التنبيهات من الصفحة الرئيسية
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingAlertsPage;
