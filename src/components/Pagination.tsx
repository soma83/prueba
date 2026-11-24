import { useAppState, useAppDispatch } from '../context/AppContext';
import { POSTS_PER_PAGE_OPTIONS } from '../context/AppContext';

const Pagination = () => {
  const { posts, postsPerPage, currentPage } = useAppState();
  const dispatch = useAppDispatch();

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const goToPage = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    dispatch({ type: 'SET_CURRENT_PAGE', payload: clampedPage });
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_POSTS_PER_PAGE', payload: Number(e.target.value) as typeof POSTS_PER_PAGE_OPTIONS[number] });
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter((page) => {
    if (page === 1 || page === totalPages) return true;
    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
    return false;
  });

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 border-t border-gray-100 dark:border-gray-800" aria-label="Paginación de publicaciones">
      <div className="flex items-center gap-2">
        <label htmlFor="posts-per-page" className="text-sm text-gray-500 dark:text-gray-400">
          Por página:
        </label>
        <select
          id="posts-per-page"
          value={postsPerPage}
          onChange={handlePerPageChange}
          className="px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
          aria-label="Publicaciones por página"
        >
          {POSTS_PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1" role="navigation" aria-label="Páginas">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1 || totalPages <= 1}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors"
          aria-label="Página anterior"
          aria-disabled={currentPage === 1 || totalPages <= 1}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {visiblePages.map((page, index) => {
          const prevPage = visiblePages[index - 1];
          const showEllipsis = prevPage !== undefined && page - prevPage > 1;

          return (
            <span key={page} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-2 text-sm text-gray-400 dark:text-gray-500" aria-hidden="true">…</span>
              )}
              <button
                onClick={() => goToPage(page)}
                disabled={totalPages <= 1}
                className={`w-8 h-8 text-sm font-medium rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors ${
                  page === currentPage
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                } ${totalPages <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={`Página ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-disabled={totalPages <= 1}
              >
                {page}
              </button>
            </span>
          );
        })}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages <= 1}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors"
          aria-label="Página siguiente"
          aria-disabled={currentPage === totalPages || totalPages <= 1}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
        Página {currentPage} de {Math.max(1, totalPages)} · {posts.length} publicaciones
      </div>
    </nav>
  );
};

export default Pagination;