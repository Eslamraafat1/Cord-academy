import type { Category, Instructor } from "@/types";

export const instructors: Instructor[] = [
  {
    id: "sara",
    name: { en: "Sara Al-Mansouri", ar: "سارة المنصوري" },
    role: { en: "Design Systems Lead", ar: "قائدة أنظمة التصميم" },
    bio: {
      en: "Ten years shaping product design systems for fintech and education teams across the Gulf.",
      ar: "عشر سنوات في بناء أنظمة التصميم لفرق التقنية المالية والتعليم في الخليج.",
    },
    hue: 265,
    rating: 4.9,
    students: 18400,
  },
  {
    id: "omar",
    name: { en: "Omar Haddad", ar: "عمر حدّاد" },
    role: { en: "Senior Frontend Engineer", ar: "مهندس واجهات أول" },
    bio: {
      en: "Builds large React and Next.js apps and teaches the patterns that survive production.",
      ar: "يبني تطبيقات React وNext.js كبيرة ويعلّم الأنماط التي تصمد في الإنتاج.",
    },
    hue: 205,
    rating: 4.8,
    students: 26100,
  },
  {
    id: "lina",
    name: { en: "Lina Farouk", ar: "لينا فاروق" },
    role: { en: "Creative Technologist", ar: "تقنية إبداعية" },
    bio: {
      en: "Mixes WebGL, motion and storytelling for award-winning brand experiences.",
      ar: "تمزج بين WebGL والحركة والسرد لصناعة تجارب علامات تجارية حائزة على جوائز.",
    },
    hue: 320,
    rating: 4.9,
    students: 12750,
  },
  {
    id: "yusuf",
    name: { en: "Yusuf Karim", ar: "يوسف كريم" },
    role: { en: "Data Scientist", ar: "عالم بيانات" },
    bio: {
      en: "Turns messy data into decisions. Former research lead, now full-time teacher.",
      ar: "يحوّل البيانات الفوضوية إلى قرارات. قائد أبحاث سابق ومدرّس متفرغ اليوم.",
    },
    hue: 150,
    rating: 4.7,
    students: 21300,
  },
  {
    id: "nour",
    name: { en: "Nour Aziz", ar: "نور عزيز" },
    role: { en: "Product & Growth Lead", ar: "قائدة المنتج والنمو" },
    bio: {
      en: "Launched products from zero to a million users and shares the playbook step by step.",
      ar: "أطلقت منتجات من الصفر حتى المليون مستخدم وتشارك الخطة خطوة بخطوة.",
    },
    hue: 28,
    rating: 4.8,
    students: 15900,
  },
];

export const categories: Category[] = [
  { id: "web", name: { en: "Web Development", ar: "تطوير الويب" }, icon: "code", hue: 205 },
  { id: "design", name: { en: "Design", ar: "التصميم" }, icon: "palette", hue: 265 },
  { id: "data", name: { en: "Data & AI", ar: "البيانات والذكاء الاصطناعي" }, icon: "database", hue: 150 },
  { id: "mobile", name: { en: "Mobile", ar: "تطبيقات الجوال" }, icon: "smartphone", hue: 190 },
  { id: "business", name: { en: "Business", ar: "الأعمال" }, icon: "briefcase", hue: 28 },
  { id: "creative", name: { en: "Creative Coding", ar: "البرمجة الإبداعية" }, icon: "sparkles", hue: 320 },
];
