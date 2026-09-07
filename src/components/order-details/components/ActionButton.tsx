import { Video, Bell, Mail, FileText, Send, Clock } from "lucide-react";

interface ActionButtonProps {
    icon: string;
    label: string;
    buttonLabel?: string;
    onClick: () => void;
    disabled: boolean;
    isCancelled?: boolean;
}

const getButtonIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("video")) return <Video size={14} className="mr-2 shrink-0" />;
    if (l.includes("6-month") || l.includes("review")) return <Clock size={14} className="mr-2 shrink-0" />;
    if (l.includes("reminder") || l.includes("rx") || l.includes("prescription")) return <Bell size={14} className="mr-2 shrink-0" />;
    if (l.includes("customer") || l.includes("contact")) return <Mail size={14} className="mr-2 shrink-0" />;
    if (l.includes("gp") || l.includes("clinic")) return <Send size={14} className="mr-2 shrink-0" />;
    if (l.includes("document")) return <FileText size={14} className="mr-2 shrink-0" />;
    return <Send size={14} className="mr-2 shrink-0" />;
};

export function ActionButton({ icon, label, buttonLabel, onClick, disabled, isCancelled = false }: ActionButtonProps) {
    return (
        <div className="flex flex-col items-center 
            p-3 w-full h-[180px]
            rounded-2xl border border-slate-100 bg-white
            shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-200 hover:-translate-y-0.5
            group/card relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-50 group-hover/card:bg-rose-400 transition-colors" />

            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[82px] py-1">
                <span className="text-[26px] mb-2 transition-transform duration-300 group-hover/card:scale-110">
                    {icon}
                </span>

                <h4 className="text-[13.5px] font-bold text-text-primary text-center leading-tight px-1 line-clamp-3">
                    {label}
                </h4>
            </div>

            <div className="w-full mt-auto pt-3 flex justify-center">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={onClick}
                    title={isCancelled ? "Actions are disabled because this order is cancelled." : ""}
                    className="inline-flex items-center justify-center
                    px-2 py-2 rounded-full
                    bg-slate-50 text-text-secondary
                    text-[10.5px] font-bold
                    border border-slate-100
                    transition-all duration-200 ease-in-out
                    hover:bg-[#00acc1] hover:text-white hover:border-[#00acc1]
                    active:scale-[0.95]
                    disabled:opacity-40 disabled:cursor-not-allowed
                    shadow-sm hover:shadow-md
                    w-full min-h-[36px]"
                >
                    {getButtonIcon(buttonLabel || label)}
                    <span className="tracking-tight text-center leading-[1.1]">{buttonLabel || "Action"}</span>
                </button>
            </div>
        </div>
    );
}
