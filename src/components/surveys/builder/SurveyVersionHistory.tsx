import { m } from 'framer-motion';
import { X, RotateCcw, Clock } from 'lucide-react';
import type { SurveyVersion } from '@/types/survey';

interface SurveyVersionHistoryProps {
    versions: SurveyVersion[];
    currentVersion: number;
    onRollback: (versionNumber: number) => void;
    onClose: () => void;
}

export default function SurveyVersionHistory({
    versions, currentVersion, onRollback, onClose
}: SurveyVersionHistoryProps) {
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    return (
        <m.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <Clock size={16} className="text-teal-500" />
                    Version History
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Version list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {versions.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-8">No versions found</p>
                )}
                {versions.map(version => (
                    <div
                        key={version._id}
                        className={`rounded-xl border p-3.5 transition-colors ${
                            version.versionNumber === currentVersion
                                ? 'border-teal-200 bg-teal-50'
                                : 'border-slate-100 bg-slate-50 hover:bg-white'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="font-semibold text-sm text-slate-700">
                                v{version.versionNumber}
                                {version.versionNumber === currentVersion && (
                                    <span className="ml-2 text-xs text-teal-600 font-medium">current</span>
                                )}
                            </span>
                            {version.versionNumber !== currentVersion && (
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Rollback to version ${version.versionNumber}?`)) {
                                            onRollback(version.versionNumber);
                                        }
                                    }}
                                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 transition-colors"
                                >
                                    <RotateCcw size={12} />
                                    Restore
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">{formatDate(version.createdAt)}</p>
                        <p className="text-xs text-slate-400 mt-1">
                            by {version.createdBy?.username ?? 'system'}
                        </p>
                        {version.changelog && (
                            <p className="text-xs text-slate-600 mt-1.5 italic">"{version.changelog}"</p>
                        )}
                    </div>
                ))}
            </div>
        </m.div>
    );
}
