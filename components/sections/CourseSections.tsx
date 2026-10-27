import { ArrowRight } from "lucide-react";
import type { Dict } from "@/lib/i18n/en";
import type { CourseView } from "@/types";
import { Container, SectionHeading } from "../ui/Primitives";
import { ButtonLink } from "../ui/Button";
import { CourseCard } from "../courses/CourseCard";

export function ViewAll({ dict }: { dict: Dict }) {
  return (
    <ButtonLink href="/courses" variant="outline" size="sm">
      {dict.common.viewAll}
      <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
    </ButtonLink>
  );
}

export function RecentCourses({ dict, courses }: { dict: Dict; courses: CourseView[] }) {
  return (
    <section className="py-24 sm:py-28">
      <Container>
        <SectionHeading eyebrow={dict.recent.eyebrow} title={dict.recent.title} sub={dict.recent.sub} action={<ViewAll dict={dict} />} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((c) => (
            <div key={c.id} data-fx="card" className="[&>article]:h-full">
              <CourseCard course={c} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
