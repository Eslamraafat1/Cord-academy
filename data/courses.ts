import type { Course, Level, Lesson, Module } from "@/types";
import { demoVideo } from "./videos";
import { detectProvider } from "@/lib/video";

/**
 * All course content lives here. To change a video, edit `videoUrl`
 * (course trailer) or the lesson's `videoUrl` — see data/videos.ts for
 * the supported URL formats. Replace this file with an API call later.
 */

type LessonSpec = [en: string, ar: string, minutes: number];
type ModuleSpec = [en: string, ar: string, lessons: LessonSpec[]];

let seed = 0;

function modules(courseSlug: string, specs: ModuleSpec[]): Module[] {
  return specs.map(([en, ar, lessons], mi) => ({
    id: `${courseSlug}-m${mi + 1}`,
    title: { en, ar },
    lessons: lessons.map(
      ([lEn, lAr, minutes], li): Lesson => ({
        id: `${courseSlug}-m${mi + 1}-l${li + 1}`,
        title: { en: lEn, ar: lAr },
        duration: minutes,
        videoUrl: demoVideo(seed++),
        preview: mi === 0 && li < 2,
      }),
    ),
  }));
}

interface Spec {
  slug: string;
  en: [title: string, description: string];
  ar: [title: string, description: string];
  hue: number;
  pattern: 0 | 1 | 2 | 3;
  category: string;
  instructor: string;
  level: Level;
  rating: number;
  reviews: number;
  students: number;
  price: number;
  publishedAt: string;
  featured?: boolean;
  trending?: boolean;
  trailer: string;
  modules: ModuleSpec[];
}

function make(s: Spec, index: number): Course {
  return {
    id: `c${index + 1}`,
    slug: s.slug,
    title: { en: s.en[0], ar: s.ar[0] },
    description: { en: s.en[1], ar: s.ar[1] },
    hue: s.hue,
    pattern: s.pattern,
    videoUrl: s.trailer,
    provider: detectProvider(s.trailer),
    category: s.category,
    instructor: s.instructor,
    level: s.level,
    rating: s.rating,
    reviews: s.reviews,
    students: s.students,
    price: s.price,
    publishedAt: s.publishedAt,
    featured: s.featured,
    trending: s.trending,
    modules: modules(s.slug, s.modules),
  };
}

const specs: Spec[] = [
  {
    slug: "design-systems-masterclass",
    en: ["Design Systems Masterclass", "Build a scalable design system from tokens to documentation, and ship it to a real product team."],
    ar: ["ماستر كلاس أنظمة التصميم", "ابنِ نظام تصميم قابلًا للتوسع من الـ Tokens حتى التوثيق، وسلّمه لفريق منتج حقيقي."],
    hue: 265, pattern: 0, category: "design", instructor: "sara", level: "intermediate",
    rating: 4.9, reviews: 1284, students: 9800, price: 89, publishedAt: "2026-09-12", featured: true, trending: true,
    trailer: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    modules: [
      ["Foundations", "الأساسيات", [["Why systems beat style guides", "لماذا تتفوق الأنظمة على أدلة الأسلوب", 12], ["Design tokens in practice", "الـ Tokens عمليًا", 18], ["Typography & color scales", "سلالم الخطوط والألوان", 22]]],
      ["Components at scale", "المكوّنات على نطاق واسع", [["Anatomy of a component", "تشريح المكوّن", 16], ["Variants & states", "الأنواع والحالات", 20], ["Documenting for developers", "التوثيق للمطورين", 14]]],
    ],
  },
  {
    slug: "react-nextjs-pro",
    en: ["React & Next.js Pro", "Server Components, caching, streaming and the architecture behind fast production apps."],
    ar: ["احتراف React وNext.js", "مكوّنات الخادم والتخزين المؤقت والبث والمعمارية وراء التطبيقات السريعة."],
    hue: 205, pattern: 1, category: "web", instructor: "omar", level: "advanced",
    rating: 4.8, reviews: 2210, students: 14200, price: 99, publishedAt: "2026-10-02", featured: true, trending: true,
    trailer: "https://youtu.be/YE7VzlLtp-4",
    modules: [
      ["Rendering model", "نموذج العرض", [["Server vs Client Components", "مكوّنات الخادم مقابل العميل", 19], ["Streaming & Suspense", "البث و Suspense", 24], ["Static shells", "الأغلفة الثابتة", 17]]],
      ["Production concerns", "اعتبارات الإنتاج", [["Caching strategies", "استراتيجيات التخزين المؤقت", 26], ["Performance budgets", "ميزانيات الأداء", 15], ["Deploying & observing", "النشر والمراقبة", 21]]],
    ],
  },
  {
    slug: "creative-coding-three",
    en: ["Creative Coding with Three.js", "Make interactive 3D worlds for the web: shaders, lighting, physics and storytelling."],
    ar: ["البرمجة الإبداعية مع Three.js", "اصنع عوالم ثلاثية الأبعاد تفاعلية للويب: شيدرز وإضاءة وفيزياء وسرد."],
    hue: 320, pattern: 2, category: "creative", instructor: "lina", level: "intermediate",
    rating: 4.9, reviews: 876, students: 7400, price: 109, publishedAt: "2026-10-14", featured: true, trending: true,
    trailer: "https://vimeo.com/76979871",
    modules: [
      ["The 3D toolbox", "أدوات الـ 3D", [["Scenes, cameras, meshes", "المشاهد والكاميرات والمجسمات", 18], ["Light & materials", "الإضاءة والخامات", 23], ["Loading models", "تحميل النماذج", 14]]],
      ["Make it feel alive", "اجعلها حيّة", [["Intro to shaders", "مقدمة في الشيدرز", 28], ["Pointer & scroll interaction", "التفاعل بالمؤشر والتمرير", 20], ["Performance on mobile", "الأداء على الجوال", 16]]],
    ],
  },
  {
    slug: "python-data-science",
    en: ["Python for Data Science", "From pandas to machine learning: analyse real datasets and present clear stories."],
    ar: ["بايثون لعلم البيانات", "من pandas إلى تعلّم الآلة: حلّل بيانات حقيقية وقدّم قصصًا واضحة."],
    hue: 150, pattern: 3, category: "data", instructor: "yusuf", level: "beginner",
    rating: 4.7, reviews: 3120, students: 21800, price: 0, publishedAt: "2026-06-20", trending: true,
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    modules: [
      ["Getting started", "البداية", [["Python in 20 minutes", "بايثون في 20 دقيقة", 20], ["Notebooks & tooling", "الدفاتر والأدوات", 11], ["Data types & pandas", "أنواع البيانات و pandas", 25]]],
      ["Analysis & modelling", "التحليل والنمذجة", [["Cleaning messy data", "تنظيف البيانات الفوضوية", 22], ["Visualising insight", "تصوير الأفكار بصريًا", 19], ["Your first model", "نموذجك الأول", 27]]],
    ],
  },
  {
    slug: "ui-motion-design",
    en: ["UI Motion Design", "Learn the principles of interface animation and prototype it like a pro."],
    ar: ["تصميم الحركة للواجهات", "تعلّم مبادئ حركة الواجهات وأنشئ نماذج أولية باحتراف."],
    hue: 15, pattern: 1, category: "design", instructor: "sara", level: "beginner",
    rating: 4.8, reviews: 954, students: 6900, price: 59, publishedAt: "2026-09-28",
    trailer: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    modules: [
      ["Motion principles", "مبادئ الحركة", [["Easing & timing", "التسارع والتوقيت", 13], ["Choreography", "تنسيق الحركات", 17], ["Feedback & delight", "الاستجابة والبهجة", 15]]],
      ["Prototyping", "النماذج الأولية", [["Micro-interactions", "التفاعلات الدقيقة", 21], ["Page transitions", "انتقالات الصفحات", 18], ["Handoff to engineers", "التسليم للمطورين", 12]]],
    ],
  },
  {
    slug: "typescript-deep-dive",
    en: ["TypeScript Deep Dive", "Generics, inference and type-level programming for confident, refactor-friendly code."],
    ar: ["التعمق في TypeScript", "الأنواع العامة والاستنتاج وبرمجة الأنواع لكود واثق وسهل التعديل."],
    hue: 218, pattern: 0, category: "web", instructor: "omar", level: "intermediate",
    rating: 4.8, reviews: 1670, students: 11300, price: 69, publishedAt: "2026-08-15",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    modules: [
      ["Type fundamentals", "أساسيات الأنواع", [["Narrowing & unions", "التضييق والاتحادات", 17], ["Generics that read well", "أنواع عامة مقروءة", 23], ["Utility types", "الأنواع المساعدة", 15]]],
      ["Advanced patterns", "أنماط متقدمة", [["Conditional types", "الأنواع الشرطية", 24], ["Template literal types", "أنواع القوالب النصية", 16], ["Typing real APIs", "كتابة أنواع واجهات حقيقية", 21]]],
    ],
  },
  {
    slug: "flutter-mobile-apps",
    en: ["Flutter Mobile Apps", "Ship beautiful iOS and Android apps from one codebase, from prototype to store."],
    ar: ["تطبيقات الجوال بـ Flutter", "أطلق تطبيقات iOS وأندرويد جميلة من قاعدة كود واحدة، من النموذج للمتجر."],
    hue: 190, pattern: 2, category: "mobile", instructor: "omar", level: "beginner",
    rating: 4.6, reviews: 1430, students: 9900, price: 79, publishedAt: "2026-07-30",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    modules: [
      ["Flutter basics", "أساسيات Flutter", [["Widgets & layout", "الودجتس والتخطيط", 20], ["State management", "إدارة الحالة", 26], ["Navigation", "التنقل", 14]]],
      ["Shipping", "الإطلاق", [["Networking & storage", "الشبكة والتخزين", 22], ["Animations", "الحركات", 18], ["Publishing to stores", "النشر على المتاجر", 16]]],
    ],
  },
  {
    slug: "product-management-essentials",
    en: ["Product Management Essentials", "Discovery, roadmaps and metrics: the practical toolkit for first-time product managers."],
    ar: ["أساسيات إدارة المنتج", "الاكتشاف وخرائط الطريق والمقاييس: الأدوات العملية لمديري المنتج الجدد."],
    hue: 28, pattern: 3, category: "business", instructor: "nour", level: "beginner",
    rating: 4.7, reviews: 1120, students: 8700, price: 49, publishedAt: "2026-09-05",
    trailer: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    modules: [
      ["Discovery", "الاكتشاف", [["Finding real problems", "إيجاد المشكلات الحقيقية", 15], ["Customer interviews", "مقابلات العملاء", 19], ["Prioritisation", "ترتيب الأولويات", 17]]],
      ["Delivery", "التنفيذ", [["Writing great specs", "كتابة مواصفات ممتازة", 14], ["Working with engineers", "العمل مع المهندسين", 16], ["Measuring success", "قياس النجاح", 20]]],
    ],
  },
  {
    slug: "gsap-animation-lab",
    en: ["GSAP Animation Lab", "Scroll-driven stories, timelines and award-level interaction with GSAP."],
    ar: ["مختبر حركة GSAP", "قصص مرتبطة بالتمرير وخطوط زمنية وتفاعلات بمستوى الجوائز مع GSAP."],
    hue: 120, pattern: 1, category: "creative", instructor: "lina", level: "advanced",
    rating: 4.9, reviews: 742, students: 5200, price: 95, publishedAt: "2026-10-20", trending: true,
    trailer: "https://youtu.be/YE7VzlLtp-4",
    modules: [
      ["Timelines", "الخطوط الزمنية", [["Tweens & easing", "الانتقالات والتسارع", 16], ["Sequencing", "تسلسل الحركات", 21], ["Stagger patterns", "أنماط التتابع", 14]]],
      ["Scroll stories", "قصص التمرير", [["ScrollTrigger basics", "أساسيات ScrollTrigger", 23], ["Pinned scenes", "المشاهد المثبّتة", 25], ["Cleanup & performance", "التنظيف والأداء", 13]]],
    ],
  },
  {
    slug: "figma-to-code",
    en: ["Figma to Code", "Translate designs into accessible, responsive interfaces without losing the detail."],
    ar: ["من Figma إلى الكود", "حوّل التصاميم إلى واجهات سهلة الوصول ومتجاوبة دون خسارة التفاصيل."],
    hue: 292, pattern: 2, category: "web", instructor: "sara", level: "beginner",
    rating: 4.6, reviews: 988, students: 7600, price: 39, publishedAt: "2026-05-18",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    modules: [
      ["Reading a design", "قراءة التصميم", [["Layout & spacing", "التخطيط والمسافات", 14], ["Extracting tokens", "استخراج الـ Tokens", 12], ["Responsive thinking", "التفكير المتجاوب", 17]]],
      ["Building", "البناء", [["Semantic HTML", "HTML الدلالي", 15], ["Modern CSS", "CSS الحديث", 22], ["Accessibility checks", "فحوصات سهولة الوصول", 13]]],
    ],
  },
  {
    slug: "ai-product-builder",
    en: ["AI Product Builder", "Design, prompt and evaluate AI features users actually trust."],
    ar: ["بناء منتجات الذكاء الاصطناعي", "صمّم وجرّب وقيّم ميزات ذكاء اصطناعي يثق بها المستخدمون فعلًا."],
    hue: 170, pattern: 0, category: "data", instructor: "yusuf", level: "intermediate",
    rating: 4.8, reviews: 612, students: 4300, price: 119, publishedAt: "2026-10-23", featured: true, trending: true,
    trailer: "https://vimeo.com/76979871",
    modules: [
      ["AI product thinking", "التفكير في منتجات الذكاء الاصطناعي", [["Where AI helps", "أين يفيد الذكاء الاصطناعي", 13], ["Prompt design", "تصميم التعليمات", 21], ["Handling failure", "التعامل مع الأخطاء", 15]]],
      ["Build & evaluate", "البناء والتقييم", [["Tool use & agents", "الأدوات والوكلاء", 27], ["Evaluation harnesses", "أطر التقييم", 19], ["Cost & latency", "التكلفة والزمن", 14]]],
    ],
  },
  {
    slug: "freelancing-launchpad",
    en: ["Freelancing Launchpad", "Find clients, price your work and build a sustainable independent career."],
    ar: ["انطلاقة العمل الحر", "اعثر على العملاء وسعّر عملك وابنِ مسيرة مستقلة مستدامة."],
    hue: 45, pattern: 3, category: "business", instructor: "nour", level: "beginner",
    rating: 4.5, reviews: 805, students: 12100, price: 0, publishedAt: "2026-04-10",
    trailer: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    modules: [
      ["Positioning", "التموضع", [["Pick a niche", "اختر تخصصك", 12], ["Portfolio that sells", "معرض أعمال يبيع", 18], ["Pricing", "التسعير", 16]]],
      ["Getting clients", "كسب العملاء", [["Outreach that works", "تواصل فعّال", 14], ["Proposals & contracts", "العروض والعقود", 17], ["Delivering & retaining", "التسليم والاحتفاظ", 13]]],
    ],
  },
];

export const courses: Course[] = specs.map(make);

export const getCourseBySlug = (slug: string) => courses.find((c) => c.slug === slug);
export const courseDuration = (c: Course) => c.modules.reduce((n, m) => n + m.lessons.reduce((a, l) => a + l.duration, 0), 0);
export const courseLessons = (c: Course) => c.modules.flatMap((m) => m.lessons);
