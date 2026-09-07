import { Loader2, ArrowRight } from 'lucide-react';

interface SubmitButtonProps {
    loading: boolean;
    isDetecting: boolean;
}

export default function SubmitButton({ loading, isDetecting }: SubmitButtonProps) {
    return (
        <div className="pt-2">
            <button
                type="submit"
                disabled={loading || isDetecting}
                className="group relative w-full h-11.5 bg-linear-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-400 hover:via-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none overflow-hidden cursor-pointer"
            >
                {/* Subtle top glare */}
                <div className="absolute top-0 left-0 right-0 h-px bg-white/30" />

                {loading || isDetecting ? (
                    <Loader2 className="animate-spin" size={19} />
                ) : (
                    <>
                        <span className="uppercase tracking-wider text-xs sm:text-sm font-extrabold">Login</span>
                        <div className="bg-white/15 p-1 rounded-lg group-hover:bg-white/25 group-hover:translate-x-0.5 transition-all duration-200">
                            <ArrowRight size={14} className="text-white" />
                        </div>
                    </>
                )}
            </button>
        </div>
    );
}
