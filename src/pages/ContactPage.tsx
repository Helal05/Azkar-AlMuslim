import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Send,
  MessageSquare,
  Bug,
  Lightbulb,
  Heart,
  Star,
  User,
  Phone,
  Globe,
  Loader2,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useToast } from "@/hooks/use-toast";
import { sendContactEmail, initEmailJS, validateEmailConfig } from "../services/emailService";

const ContactPage = () => {
  const navigate = useNavigate();
  const { settings: appSettings } = useAppSettings();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState(false);

  // تهيئة EmailJS عند تحميل الصفحة
  useEffect(() => {
    initEmailJS();
    setEmailConfigured(validateEmailConfig());
  }, []);

  const contactTypes = [
    {
      id: "general",
      icon: <MessageSquare className="w-5 h-5" />,
      titleAr: "استفسار عام",
      titleEn: "General Inquiry",
      color: "bg-blue-500"
    },
    {
      id: "bug",
      icon: <Bug className="w-5 h-5" />,
      titleAr: "الإبلاغ عن خطأ",
      titleEn: "Report a Bug",
      color: "bg-red-500"
    },
    {
      id: "suggestion",
      icon: <Lightbulb className="w-5 h-5" />,
      titleAr: "اقتراح تحسين",
      titleEn: "Suggestion",
      color: "bg-yellow-500"
    },
    {
      id: "feedback",
      icon: <Heart className="w-5 h-5" />,
      titleAr: "تقييم التطبيق",
      titleEn: "App Feedback",
      color: "bg-green-500"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeSelect = (type: string) => {
    setFormData(prev => ({
      ...prev,
      type
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: appSettings.language === "ar" ? "خطأ في الإرسال" : "Submission Error",
        description: appSettings.language === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // إرسال الرسالة باستخدام EmailJS
      const result = await sendContactEmail(formData, appSettings.language);

      if (result.success) {
        toast({
          title: appSettings.language === "ar" ? "تم إرسال الرسالة بنجاح!" : "Message Sent Successfully!",
          description: appSettings.language === "ar" ? "شكراً لك! سنرد عليك في أقرب وقت ممكن" : "Thank you! We'll get back to you as soon as possible",
        });

        // مسح النموذج بعد الإرسال الناجح
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          type: "general"
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: appSettings.language === "ar" ? "خطأ في الإرسال" : "Sending Error",
        description: appSettings.language === "ar" ? "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى" : "An error occurred while sending the message. Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={appSettings.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="relative py-4 border-b border-border">
        <button
          onClick={() => navigate('/settings')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 rtl:right-auto rtl:left-4"
        >
          <ArrowLeft className="h-6 w-6 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-bold text-center font-arabic text-foreground">
          {appSettings.language === "ar" ? "تواصل معنا" : "Contact Us"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {/* Introduction */}
        <div className="mb-6 text-center">
          <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-arabic font-semibold text-foreground mb-2">
            {appSettings.language === "ar" ? "نحن نحب أن نسمع منك" : "We'd love to hear from you"}
          </h2>
          <p className="text-muted-foreground font-arabic">
            {appSettings.language === "ar"
              ? "شاركنا آراءك واقتراحاتك لتحسين التطبيق"
              : "Share your thoughts and suggestions to improve the app"
            }
          </p>
        </div>

        {/* Contact Type Selection */}
        <div className="mb-6">
          <Label className="text-base font-arabic font-medium text-foreground mb-3 block">
            {appSettings.language === "ar" ? "نوع الرسالة" : "Message Type"}
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {contactTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.type === type.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-muted/50"
                } flex flex-col items-center text-center`}
              >
                <div className={`${type.color} rounded-lg p-2 text-white mb-2`}>
                  {type.icon}
                </div>
                <span className={`text-sm font-arabic font-medium ${
                  formData.type === type.id ? "text-primary" : "text-foreground"
                }`}>
                  {appSettings.language === "ar" ? type.titleAr : type.titleEn}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-sm font-arabic font-medium text-foreground mb-1 block">
              {appSettings.language === "ar" ? "الاسم *" : "Name *"}
            </Label>
            <div className="relative">
              <User className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={appSettings.language === "ar" ? "أدخل اسمك" : "Enter your name"}
                className="pl-10 rtl:pr-10 rtl:pl-3 bg-background text-foreground"
                dir={appSettings.language === 'ar' ? 'rtl' : 'ltr'}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-sm font-arabic font-medium text-foreground mb-1 block">
              {appSettings.language === "ar" ? "البريد الإلكتروني *" : "Email *"}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={appSettings.language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                className="pl-10 rtl:pr-10 rtl:pl-3 bg-background text-foreground"
                dir="ltr"
                required
              />
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <Label htmlFor="subject" className="text-sm font-arabic font-medium text-foreground mb-1 block">
              {appSettings.language === "ar" ? "الموضوع" : "Subject"}
            </Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder={appSettings.language === "ar" ? "موضوع الرسالة (اختياري)" : "Message subject (optional)"}
              className="bg-background text-foreground"
              dir={appSettings.language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Message Field */}
          <div>
            <Label htmlFor="message" className="text-sm font-arabic font-medium text-foreground mb-1 block">
              {appSettings.language === "ar" ? "الرسالة *" : "Message *"}
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={appSettings.language === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."}
              className="bg-background text-foreground min-h-[120px] resize-none"
              dir={appSettings.language === 'ar' ? 'rtl' : 'ltr'}
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 rtl:ml-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2 rtl:ml-2" />
            )}
            {isLoading
              ? (appSettings.language === "ar" ? "جاري الإرسال..." : "Sending...")
              : (appSettings.language === "ar" ? "إرسال الرسالة" : "Send Message")
            }
          </Button>
        </form>

        {/* Contact Info */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-arabic font-semibold text-foreground">
            {appSettings.language === "ar" ? "طرق أخرى للتواصل" : "Other Ways to Contact"}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-card rounded-lg border border-border">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-arabic text-sm font-medium text-foreground">
                  {appSettings.language === "ar" ? "البريد الإلكتروني" : "Email"}
                </p>
                <p className="text-sm text-muted-foreground">hsnalmslm@outlook.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time Note */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <Star className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-arabic text-base font-medium text-blue-900 dark:text-blue-100 mb-1">
                {appSettings.language === "ar" ? "وقت الاستجابة" : "Response Time"}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {appSettings.language === "ar"
                  ? "نحن نسعى للرد على جميع الرسائل خلال 24-48 ساعة. شكراً لصبركم."
                  : "We strive to respond to all messages within 24-48 hours. Thank you for your patience."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
