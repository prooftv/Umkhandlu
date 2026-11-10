import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/Pagination';

type ArchivePaginationProps = {
  totalPages: number;
  currentPage: number;
  linkBase: string;
  itemsToShow?: number;
  perPage?: number;
  showSizeToggle?: boolean;
};

function generatePaginationItems(
  currentPage: number,
  totalPages: number,
  pagesToShow: number
): number[] {
  if (totalPages <= 0 || pagesToShow <= 0) return [];

  const pagination: Set<number> = new Set();
  const sidePages = Math.floor(pagesToShow / 2);
  let startPage = Math.max(1, currentPage - sidePages);
  let endPage = Math.min(totalPages, currentPage + sidePages);

  while (endPage - startPage + 1 < pagesToShow) {
    if (startPage > 1) startPage--;
    else if (endPage < totalPages) endPage++;
    else break;
  }

  for (let i = startPage; i <= endPage; i++) {
    pagination.add(i);
  }

  return Array.from(pagination).sort((a, b) => a - b);
}

const pageLink = (page: number, linkBase: string, size?: number) => {
  const base = page === 1 ? linkBase : `${linkBase}/page/${page}`;
  return size && size !== 10 ? `${base}?size=${size}` : base;
};

export function ArchivePagination({
  totalPages,
  currentPage,
  linkBase,
  itemsToShow = 5,
  perPage = 10,
  showSizeToggle = true,
}: ArchivePaginationProps) {
  if (totalPages <= 1 && !showSizeToggle) return null;

  const newCurrentPage = currentPage === 0 ? 1 : currentPage;
  const previousPage = newCurrentPage > 1 ? newCurrentPage - 1 : null;
  const nextPage = newCurrentPage < totalPages ? newCurrentPage + 1 : null;
  const pages = generatePaginationItems(
    newCurrentPage,
    totalPages,
    itemsToShow
  );

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {previousPage && (
              <PaginationItem>
                <PaginationPrevious
                  href={pageLink(
                    previousPage,
                    linkBase,
                    perPage !== 10 ? perPage : undefined
                  )}
                />
              </PaginationItem>
            )}
            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={pageLink(
                    page,
                    linkBase,
                    perPage !== 10 ? perPage : undefined
                  )}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            {pages[pages.length - 1] < totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {nextPage && (
              <PaginationItem>
                <PaginationNext
                  href={pageLink(
                    nextPage,
                    linkBase,
                    perPage !== 10 ? perPage : undefined
                  )}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
      {showSizeToggle && (
        <div className="hidden md:flex items-center gap-1 text-xs text-gray-400">
          <span>Per page:</span>
          <a
            href={linkBase}
            className={`px-2 py-0.5 rounded ${perPage === 10 ? 'bg-gray-900 text-white' : 'hover:text-gray-600'}`}
          >
            10
          </a>
          <a
            href={`${linkBase}?size=20`}
            className={`px-2 py-0.5 rounded ${perPage === 20 ? 'bg-gray-900 text-white' : 'hover:text-gray-600'}`}
          >
            20
          </a>
        </div>
      )}
    </div>
  );
}
