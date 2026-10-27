export type Locale = "ar" | "en";
export type L10n = Record<Locale, string>;
export type Level = "beginner" | "intermediate" | "advanced";
export type VideoProvider = "youtube" | "vimeo" | "html5";

export interface Lesson {
  id: string;
  title: L10n;
  /** minutes */
  duration: number;
  /** Any YouTube / Vimeo / direct video URL. Parsed in lib/video.ts */
  videoUrl: string;
  /** Free to watch from the curriculum without enrolling */
  preview?: boolean;
}

export interface Module {
  id: string;
  title: L10n;
  lessons: Lesson[];
}

export interface Instructor {
  id: string;
  name: L10n;
  role: L10n;
  bio: L10n;
  hue: number;
  rating: number;
  students: number;
}

export interface Category {
  id: string;
  name: L10n;
  /** key into the icon map in components/ui/CategoryIcon */
  icon: "code" | "palette" | "database" | "smartphone" | "briefcase" | "sparkles";
  hue: number;
}

export interface Course {
  id: string;
  slug: string;
  title: L10n;
  description: L10n;
  /** Optional remote cover (rendered with next/image). Falls back to generative art. */
  thumbnail?: string;
  hue: number;
  pattern: 0 | 1 | 2 | 3;
  /** Trailer / intro video */
  videoUrl: string;
  provider: VideoProvider;
  category: string;
  instructor: string;
  level: Level;
  rating: number;
  reviews: number;
  students: number;
  /** USD, 0 = free */
  price: number;
  publishedAt: string;
  featured?: boolean;
  trending?: boolean;
  modules: Module[];
}

export interface LearningPath {
  id: string;
  title: L10n;
  description: L10n;
  hue: number;
  courses: string[];
}

export interface Testimonial {
  id: string;
  name: L10n;
  role: L10n;
  quote: L10n;
  hue: number;
}

export interface Faq {
  id: string;
  q: L10n;
  a: L10n;
}

export interface Review {
  id: string;
  name: L10n;
  rating: number;
  text: L10n;
  date: string;
}

/** A course resolved to a single language — safe & small to pass to client components. */
export interface CourseView {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail?: string;
  hue: number;
  pattern: 0 | 1 | 2 | 3;
  videoUrl: string;
  provider: VideoProvider;
  categoryId: string;
  categoryName: string;
  instructorId: string;
  instructorName: string;
  level: Level;
  rating: number;
  reviews: number;
  students: number;
  price: number;
  publishedAt: string;
  durationMin: number;
  lessonsCount: number;
  featured: boolean;
  trending: boolean;
}
