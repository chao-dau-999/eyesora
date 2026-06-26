import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex items-center gap-1">
            <button
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                className="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
                <ChevronLeft size={16} />
            </button>

            {[...Array(totalPages)].map((_, i) => {
                if (i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
                    return (
                        <button
                            key={i}
                            onClick={() => onPageChange(i)}
                            className={`w-9 h-9 rounded-lg font-bold text-xs transition-all ${
                                currentPage === i
                                    ? 'bg-blue-900 text-white shadow-lg'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {i + 1}
                        </button>
                    );
                }
                if (i === currentPage - 2 || i === currentPage + 2) {
                    return <span key={i} className="px-2 text-gray-400 font-bold select-none">...</span>;
                }
                return null;
            })}

            <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
                className="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;