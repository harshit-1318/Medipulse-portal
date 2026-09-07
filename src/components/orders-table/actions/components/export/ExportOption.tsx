
interface ExportOptionProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    colorClass: string;
    onClick: () => void;
}

export const ExportOption = ({ title, description, icon, colorClass, onClick }: ExportOptionProps) => {
    return (
        <button
            onClick={onClick}
            className={`flex-1 group relative bg-white border-2 border-slate-200 rounded-xl p-6 text-left hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 ${colorClass}`}
        >
            <div className="absolute top-4 right-4 text-slate-300 group-hover:text-indigo-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 16 16 12 12 8"></polyline>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
            </div>
            <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-opacity-80 transition-colors">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600">
                {description}
            </p>
        </button>
    );
};
