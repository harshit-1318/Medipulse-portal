import { AnimatePresence } from 'framer-motion';
import { Pagination } from '@/components/common/Pagination';
import type { User } from '@/components/users/types';
import UserRow from './UserRow';
import { UsersTableHeader } from './UsersTableHeader';

interface UsersTableProps {
    users: User[];
    loading: boolean;
    total: number;
    page: number;
    onPageChange: (page: number) => void;
    limit: number;
    onToggleUserActive: (userId: string, nextActive: boolean) => Promise<void>;
}

export default function UsersTable({ users, loading, total, page, onPageChange, limit, onToggleUserActive }: UsersTableProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] font-montserrat w-full overflow-hidden flex flex-col animate-in fade-in duration-500">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="inline-flex flex-col">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            User Directory
                        </h2>
                        <span className="bg-[#00a294]/10 text-[#00a294] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#00a294]/20">
                            {total}
                        </span>
                    </div>
                    <div className="w-12 h-0.75 bg-linear-to-r from-[#00a294] to-[#003B73] mt-1.5 rounded-full shadow-xs" />
                </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar flex-1">
                <table className="w-full text-left border-collapse min-w-237.5">
                    <UsersTableHeader />
                    <tbody className="divide-y divide-slate-100 bg-white">
                        <AnimatePresence mode="popLayout">
                            {users.map((user, idx) => (
                                <UserRow key={user._id} user={user} index={idx} onToggleUserActive={onToggleUserActive} />
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {users.length === 0 && !loading && (
                <div className="py-16 text-center">
                    <p className="text-slate-400 font-medium text-sm">No users found matching your search or site filter.</p>
                </div>
            )}

            <div className="px-5 py-3 border-t border-slate-200 bg-white shadow-sm flex items-center justify-center">
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(total / limit) || 1}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
}

