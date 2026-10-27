import { Container, Skeleton } from "@/components/ui/Primitives";

/** Route-level loading UI: skeleton that mirrors a page header + card grid. */
export default function Loading() {
  return (
    <Container className="pb-16 pt-36" aria-busy="true">
      <Skeleton className="mb-4 h-4 w-40" />
      <Skeleton className="mb-3 h-14 w-full max-w-xl" />
      <Skeleton className="mb-12 h-6 w-full max-w-md" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-[1.75rem] border border-line bg-surface">
            <Skeleton className="aspect-[16/10] rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
