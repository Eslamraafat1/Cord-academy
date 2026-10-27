import type { Faq, LearningPath, Review, Testimonial } from "@/types";

export const paths: LearningPath[] = [
  {
    id: "frontend",
    title: { en: "Frontend Engineer", ar: "مهندس واجهات" },
    description: {
      en: "From design handoff to production-grade React apps.",
      ar: "من استلام التصميم حتى تطبيقات React بمستوى الإنتاج.",
    },
    hue: 205,
    courses: ["figma-to-code", "typescript-deep-dive", "react-nextjs-pro"],
  },
  {
    id: "designer",
    title: { en: "Product Designer", ar: "مصمم منتجات" },
    description: {
      en: "Systems, motion and craft that teams love to build from.",
      ar: "أنظمة وحركة وحرفية يحب الفريق البناء عليها.",
    },
    hue: 265,
    courses: ["ui-motion-design", "design-systems-masterclass", "product-management-essentials"],
  },
  {
    id: "creative",
    title: { en: "Creative Technologist", ar: "تقنيّ إبداعي" },
    description: {
      en: "3D, motion and interaction for unforgettable web experiences.",
      ar: "ثلاثي الأبعاد وحركة وتفاعل لتجارب ويب لا تُنسى.",
    },
    hue: 320,
    courses: ["gsap-animation-lab", "creative-coding-three", "ai-product-builder"],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: { en: "Maha Al-Otaibi", ar: "مها العتيبي" },
    role: { en: "Product Designer, Riyadh", ar: "مصممة منتجات، الرياض" },
    quote: {
      en: "The design systems course changed how my whole team ships. I got promoted within four months.",
      ar: "غيّرت دورة أنظمة التصميم طريقة إطلاق فريقي بالكامل. حصلت على ترقية خلال أربعة أشهر.",
    },
    hue: 265,
  },
  {
    id: "t2",
    name: { en: "Karim Nasser", ar: "كريم ناصر" },
    role: { en: "Frontend Developer, Cairo", ar: "مطوّر واجهات، القاهرة" },
    quote: {
      en: "Short lessons, real projects and zero fluff. The Next.js track is the best I have taken.",
      ar: "دروس قصيرة ومشاريع حقيقية دون حشو. مسار Next.js هو الأفضل الذي أخذته.",
    },
    hue: 205,
  },
  {
    id: "t3",
    name: { en: "Layla Haddad", ar: "ليلى حدّاد" },
    role: { en: "Creative Developer, Dubai", ar: "مطوّرة إبداعية، دبي" },
    quote: {
      en: "The Three.js course finally made shaders click. My portfolio finally feels alive.",
      ar: "دورة Three.js جعلتني أفهم الشيدرز أخيرًا، ومعرض أعمالي صار نابضًا بالحياة.",
    },
    hue: 320,
  },
  {
    id: "t4",
    name: { en: "Ahmed Saleh", ar: "أحمد صالح" },
    role: { en: "Data Analyst, Amman", ar: "محلل بيانات، عمّان" },
    quote: {
      en: "I moved from spreadsheets to Python in a month. The free course alone was worth it.",
      ar: "انتقلت من الجداول إلى بايثون في شهر. الدورة المجانية وحدها كانت تستحق.",
    },
    hue: 150,
  },
];

export const faqs: Faq[] = [
  {
    id: "f1",
    q: { en: "Do I need prior experience?", ar: "هل أحتاج إلى خبرة سابقة؟" },
    a: {
      en: "No. Every course is labelled beginner, intermediate or advanced, and learning paths tell you exactly where to start.",
      ar: "لا. كل دورة مصنفة مبتدئ أو متوسط أو متقدم، وتوضح لك مسارات التعلم من أين تبدأ بالضبط.",
    },
  },
  {
    id: "f2",
    q: { en: "Can I learn in Arabic and English?", ar: "هل يمكنني التعلم بالعربية والإنجليزية؟" },
    a: {
      en: "The whole interface and course information is available in both languages and you can switch any time from the navigation bar.",
      ar: "الواجهة كاملة ومعلومات الدورات متاحة باللغتين، ويمكنك التبديل في أي وقت من شريط التنقل.",
    },
  },
  {
    id: "f3",
    q: { en: "Is there a certificate?", ar: "هل توجد شهادة؟" },
    a: {
      en: "Certificates are part of the roadmap and will be issued once accounts and progress sync are connected to the backend.",
      ar: "الشهادات ضمن خطة التطوير وستصدر بعد ربط الحسابات ومزامنة التقدم بالخادم.",
    },
  },
  {
    id: "f4",
    q: { en: "How does progress tracking work?", ar: "كيف يعمل تتبّع التقدم؟" },
    a: {
      en: "In this demo, completed lessons are saved in your browser only. With a backend they will sync across devices.",
      ar: "في هذه النسخة التجريبية تُحفظ الدروس المكتملة في متصفحك فقط. مع الخادم ستتزامن بين الأجهزة.",
    },
  },
  {
    id: "f5",
    q: { en: "Can I get a refund?", ar: "هل يمكنني استرداد المبلغ؟" },
    a: {
      en: "Payments are not connected yet. Refund and coupon rules will be published here before launch.",
      ar: "المدفوعات غير مرتبطة بعد. ستُنشر سياسة الاسترداد والكوبونات هنا قبل الإطلاق.",
    },
  },
  {
    id: "f6",
    q: { en: "Which devices are supported?", ar: "ما الأجهزة المدعومة؟" },
    a: {
      en: "Any modern phone, tablet or computer. The video player adapts to the screen and supports fullscreen.",
      ar: "أي هاتف أو جهاز لوحي أو حاسوب حديث. يتكيف مشغل الفيديو مع الشاشة ويدعم ملء الشاشة.",
    },
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    name: { en: "Dina R.", ar: "دينا ر." },
    rating: 5,
    text: { en: "Clear, practical and beautifully produced.", ar: "واضحة وعملية وإنتاجها جميل." },
    date: "2026-10-01",
  },
  {
    id: "r2",
    name: { en: "Tariq M.", ar: "طارق م." },
    rating: 4,
    text: { en: "Great pace. I would love more exercises at the end.", ar: "إيقاع رائع. أتمنى المزيد من التمارين في النهاية." },
    date: "2026-09-18",
  },
  {
    id: "r3",
    name: { en: "Salma K.", ar: "سلمى ك." },
    rating: 5,
    text: { en: "The instructor explains hard ideas simply.", ar: "المدرّس يشرح الأفكار الصعبة ببساطة." },
    date: "2026-08-30",
  },
];
