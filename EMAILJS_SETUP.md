# 📧 دليل إعداد EmailJS للتطبيق

## 🚀 **المقدمة**
EmailJS يتيح لك إرسال الإيميلات مباشرة من التطبيق بدون الحاجة لخادم backend. الخدمة مجانية حتى 200 رسالة شهرياً.

## 📝 **خطوات الإعداد**

### **1. إنشاء حساب EmailJS**
1. اذهب إلى [EmailJS.com](https://www.emailjs.com/)
2. اضغط على "Sign Up" وأنشئ حساب جديد
3. تأكد من بريدك الإلكتروني

### **2. إعداد خدمة البريد الإلكتروني**
1. في لوحة التحكم، اضغط على "Email Services"
2. اضغط على "Add New Service"
3. اختر مزود البريد الإلكتروني (Gmail, Outlook, إلخ)
4. اتبع التعليمات لربط حسابك
5. **احفظ Service ID** (ستحتاجه لاحقاً)

### **3. إنشاء قوالب الرسائل**

#### **أ. قالب رسائل التواصل:**
1. اذهب إلى "Email Templates"
2. اضغط على "Create New Template"
3. استخدم هذا القالب:

```html
Subject: {{subject}}

From: {{from_name}} ({{from_email}})
App: {{app_name}}
Language: {{user_language}}
Message Type: {{message_type}}
Date: {{timestamp}}

Message:
{{message}}

---
Reply to: {{reply_to}}
```

4. احفظ القالب واحفظ **Template ID**

#### **ب. قالب النشرة الإخبارية:**
1. أنشئ قالب جديد للنشرة الإخبارية:

```html
Subject: New Newsletter Subscription - {{app_name}}

New subscriber details:
Email: {{subscriber_email}}
Language: {{language}}
Subscription Date: {{subscription_date}}

Preferences:
{{preferences}}

---
From: {{app_name}}
```

2. احفظ القالب واحفظ **Template ID**

### **4. الحصول على Public Key**
1. اذهب إلى "Account" → "General"
2. انسخ **Public Key**

### **5. تحديث إعدادات التطبيق**
افتح ملف `src/services/emailService.ts` وحدث المعلومات التالية:

```typescript
const EMAIL_CONFIG = {
  SERVICE_ID: 'your_service_id_here',     // من الخطوة 2
  TEMPLATE_ID: 'your_template_id_here',   // من الخطوة 3أ
  PUBLIC_KEY: 'your_public_key_here',     // من الخطوة 4
};
```

### **6. إعداد قالب النشرة الإخبارية (اختياري)**
إذا كنت تريد استخدام النشرة الإخبارية، حدث أيضاً:

```typescript
// في دالة sendNewsletterSubscription
'newsletter_template_id' // استبدلها بـ Template ID من الخطوة 3ب
```

## ✅ **اختبار الإعداد**

1. شغل التطبيق
2. اذهب إلى صفحة "تواصل معنا"
3. املأ النموذج وأرسل رسالة تجريبية
4. تحقق من وصول الرسالة لبريدك الإلكتروني

## 🔧 **استكشاف الأخطاء**

### **إذا لم تصل الرسائل:**
- تأكد من صحة Service ID, Template ID, و Public Key
- تحقق من spam folder
- تأكد من أن خدمة البريد الإلكتروني مفعلة في EmailJS

### **إذا ظهرت أخطاء في Console:**
- تحقق من أن جميع المعرفات صحيحة
- تأكد من أن القوالب تحتوي على جميع المتغيرات المطلوبة

### **إذا لم يتم إعداد EmailJS:**
- التطبيق سيعود تلقائياً للطريقة القديمة (فتح تطبيق البريد)
- لن تظهر أي أخطاء للمستخدم

## 📊 **مراقبة الاستخدام**
- اذهب إلى لوحة تحكم EmailJS لمراقبة عدد الرسائل المرسلة
- الحد المجاني: 200 رسالة/شهر
- يمكنك الترقية للخطط المدفوعة عند الحاجة

## 🔒 **الأمان**
- Public Key آمن للاستخدام في التطبيقات العامة
- لا تشارك Service ID أو Template IDs في أماكن عامة
- EmailJS يوفر حماية ضد spam تلقائياً

## 📞 **الدعم**
إذا واجهت أي مشاكل:
1. راجع [وثائق EmailJS](https://www.emailjs.com/docs/)
2. تحقق من [الأسئلة الشائعة](https://www.emailjs.com/docs/faq/)
3. تواصل مع دعم EmailJS

---

**ملاحظة:** بعد إعداد EmailJS بنجاح، ستصبح رسائل التواصل تُرسل مباشرة إلى بريدك الإلكتروني بدون الحاجة لفتح تطبيق البريد! 🎉
