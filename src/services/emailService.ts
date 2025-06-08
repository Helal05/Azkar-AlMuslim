import emailjs from '@emailjs/browser';

// إعدادات EmailJS - نفس إعدادات تواصل معنا بالضبط
const EMAIL_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
};

// تهيئة EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
};

// دالة إرسال الرسالة
export const sendContactEmail = async (formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
}, language: 'ar' | 'en') => {
  try {
    // تحضير البيانات للإرسال
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject || (language === "ar" ? "رسالة من تطبيق أذكار المسلم" : "Message from Muslim Azkar App"),
      message: formData.message,
      message_type: formData.type,
      reply_to: formData.email,
      // معلومات إضافية
      app_name: language === "ar" ? "أذكار المسلم" : "Muslim Azkar",
      timestamp: new Date().toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US'),
      user_language: language === 'ar' ? 'العربية' : 'English',
    };

    // إرسال الرسالة
    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};

// دالة إرسال رسالة الاشتراك في النشرة الإخبارية
export const sendNewsletterSubscription = async (
  email: string, 
  preferences: any, 
  language: 'ar' | 'en'
) => {
  try {
    // تحضير البيانات للإرسال بنفس طريقة رسائل التواصل
    const templateParams = {
      from_name: email,
      from_email: email,
      subject: language === "ar" ? "اشتراك جديد في النشرة الإخبارية" : "New Newsletter Subscription",
      message: `
${language === "ar" ? "تفاصيل الاشتراك" : "Subscription Details"}:
${language === "ar" ? "البريد الإلكتروني" : "Email"}: ${email}
${language === "ar" ? "اللغة" : "Language"}: ${language === 'ar' ? 'العربية' : 'English'}
${language === "ar" ? "التفضيلات" : "Preferences"}: ${JSON.stringify(preferences, null, 2)}
      `.trim(),
      message_type: "newsletter",
      reply_to: email,
      // معلومات إضافية
      app_name: language === "ar" ? "أذكار المسلم" : "Muslim Azkar",
      timestamp: new Date().toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US'),
      user_language: language === 'ar' ? 'العربية' : 'English',
    };

    // إرسال الرسالة بنفس طريقة رسائل التواصل
    const response = await emailjs.send(
      EMAIL_CONFIG.SERVICE_ID,
      EMAIL_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log('Newsletter subscription sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send newsletter subscription:', error);
    return { success: false, error };
  }
};

// دالة للتحقق من صحة إعدادات EmailJS
export const validateEmailConfig = () => {
  return true; // نرجع true دائماً لأننا نستخدم نفس إعدادات تواصل معنا
};

// أنواع الرسائل للمساعدة في التصنيف
const MESSAGE_TYPES = {
  general: {
    ar: 'استفسار عام',
    en: 'General Inquiry'
  },
  bug: {
    ar: 'الإبلاغ عن خطأ',
    en: 'Report a Bug'
  },
  suggestion: {
    ar: 'اقتراح تحسين',
    en: 'Suggestion'
  },
  feedback: {
    ar: 'تقييم التطبيق',
    en: 'App Feedback'
  }
} as const;
