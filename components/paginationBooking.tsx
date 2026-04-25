"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type SearchParams = {
  location?: string;
  type?: string;
  price?: string;
};

type MyPaginationProps = {
  currentPage: number;
  totalPages: number;
  searchParams?: SearchParams;
};

function buildHref(page: number, searchParams?: SearchParams) {
  const params = new URLSearchParams();

  if (searchParams?.location) params.set("location", searchParams.location);
  if (searchParams?.type) params.set("type", searchParams.type);
  if (searchParams?.price) params.set("price", searchParams.price);

  params.set("page", String(page));
  return `?${params.toString()}`;
}

export default function MyPagination({
  currentPage,
  totalPages,
  searchParams,
}: MyPaginationProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildHref(Math.max(currentPage - 1, 1), searchParams)}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => {
          const p = i + 1;
          return (
            <PaginationItem key={p}>
              <PaginationLink
                href={buildHref(p, searchParams)}
                isActive={currentPage === p}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={buildHref(
              Math.min(currentPage + 1, totalPages),
              searchParams,
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
