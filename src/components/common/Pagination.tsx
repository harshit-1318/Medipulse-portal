import { ChevronLeft, ChevronRight } from "lucide-react";
interface PaginationProps {
    currentPage: number;
    totalPages?: number;
    totalItems?: number;
    itemsPerPage?: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    className
}: PaginationProps) {
    const rawTotalPages = totalPages ?? (totalItems && itemsPerPage ? Math.ceil(totalItems / itemsPerPage) : 0);
    const derivedTotalPages = Math.max(rawTotalPages, currentPage > 0 ? currentPage : 1);

    return (
        <div className={`flex items-center justify-center gap-4 ${className || ""}`}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                suppressHydrationWarning
                className="flex items-center px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
            </button>

            <span className="text-sm font-medium text-slate-700" suppressHydrationWarning>
                Page {currentPage} of {derivedTotalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= derivedTotalPages}
                suppressHydrationWarning
                className="flex items-center px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
            </button>
        </div>
    );
}
