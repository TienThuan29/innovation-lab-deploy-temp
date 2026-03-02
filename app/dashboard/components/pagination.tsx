import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showIcons?: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    showIcons = true,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Logic to show a window of pages if totalPages is large could be added here
    // For now, we'll keep it simple as requested or implement a simple window
    let displayedPages = pages;
    if (totalPages > 7) {
        if (currentPage <= 4) {
            displayedPages = [...pages.slice(0, 5), -1, totalPages];
        } else if (currentPage >= totalPages - 3) {
            displayedPages = [1, -1, ...pages.slice(totalPages - 5)];
        } else {
            displayedPages = [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];
        }
    }

    return (
        <nav aria-label="Page navigation" className="flex items-center justify-between pt-4">
             <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                Showing page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
            </span>
            <ul className="inline-flex items-center -space-x-px text-sm h-8">
                <li>
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight border border-black-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === 1 ? 'cursor-not-allowed opacity-50 bg-gray-100 text-gray-400' : 'bg-white text-gray-500'}`}
                    >
                        {showIcons ? <ChevronLeftIcon className="w-4 h-4" /> : "Previous"}
                    </button>
                </li>
                {displayedPages.map((page, index) => (
                     <li key={index}>
                        {page === -1 ? (
                            <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                                    currentPage === page
                                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-white"
                                        : "bg-white text-gray-500"
                                }`}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                         disabled={currentPage === totalPages}
                        className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === totalPages ? 'cursor-not-allowed opacity-50 bg-gray-100 text-gray-400' : 'bg-white text-gray-500'}`}
                    >
                        {showIcons ? <ChevronRightIcon className="w-4 h-4" /> : "Next"}
                    </button>
                </li>
            </ul>
        </nav>
    );
}
