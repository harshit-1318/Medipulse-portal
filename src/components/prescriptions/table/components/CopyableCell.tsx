import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
    text: string;
    subText?: string;
    href?: string;

}

export const CopyableCell: React.FC<Props> = ({ text, subText, href }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const content = (
        <div className="flex flex-col items-center group/cell">
            <span className="text-[14px] font-bold text-slate-900 tracking-tight transition-colors group-hover/id:text-indigo-600">
                {text}
            </span>
            {subText && (
                <span className="text-[11px] font-medium text-slate-400 mt-1 tracking-wide uppercase transition-colors">
                    {subText}
                </span>
            )}
        </div>
    );

    return (
        <div className="flex flex-col items-center relative group/id-cell w-full">
            {href ? <a href={href} className="flex flex-col items-center hover:no-underline group-hover/id-cell:opacity-80 transition-opacity">{content}</a> : content}
            <button
                onClick={handleCopy}
                className={`absolute -right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-300 ${copied ? 'bg-emerald-50 text-emerald-600 opacity-100' : 'bg-white text-slate-400 opacity-0 group-hover/id-cell:opacity-100 hover:bg-slate-50 hover:text-indigo-600'} shadow-sm border border-slate-100`}
                title="Copy ID"
            >
                {copied ? <Check size={11} strokeWidth={3} /> : <Copy size={11} />}
            </button>
        </div>
    );

};
