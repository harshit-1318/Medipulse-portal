interface SuccessModalProps {
    id: string;
    title: string;
    message: string;
    icon: string;
    onClose: () => void;
    iconBg?: string;
    iconBorder?: string;
    isVisible: boolean;
}

export function SuccessModal({
    title,
    message,
    icon,
    onClose,
    iconBg = "bg-teal-50",
    iconBorder = "border-teal-200",
    isVisible,
}: SuccessModalProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-999999 animate-in fade-in duration-500">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative flex flex-col items-center text-center animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
                <div className={`h-24 w-24 rounded-3xl ${iconBg} border ${iconBorder} flex items-center justify-center text-[40px] mb-6 shadow-sm`}>{icon}</div>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-3 tracking-tight">{title}</h2>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">{message}</p>
                <button className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition-all active:scale-[0.98] cursor-pointer" onClick={onClose}>DISMISS</button>
            </div>
        </div>
    );
}
