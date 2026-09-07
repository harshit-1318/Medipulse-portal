import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
    onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => {
    return (
        <header className="sticky top-0 z-50 bg-[#020617]/60 backdrop-blur-3xl border-b border-white/4 px-6 py-4">
            <div className="max-w-300 mx-auto flex items-center justify-between">
                {/* Left side */}
                <div className="flex-1 flex justify-start">
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/5 border-2 border-white/10 text-[12px] font-semibold text-white hover:bg-white/10 transition-all group active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    >
                        <ChevronLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                        Back to Portal
                    </button>
                </div>
                
                {/* Center side */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <span className="text-[11px] font-medium text-indigo-300/80 uppercase tracking-widest">Secure Consultation Playback</span>
                    <h1 className="text-2xl font-bold text-white tracking-tight leading-none">Recording Preview</h1>
                </div>

                {/* Right side */}
                <div className="flex-1 flex items-center justify-end gap-8">
                    <div className="hidden md:flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-2.5">
                            <div className="relative">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 blur-xs animate-pulse"></div>
                            </div>
                            <span className="text-[11px] font-medium text-slate-200 uppercase tracking-wider">End-to-End Encrypted</span>
                        </div>
                        <span className="text-[10px] font-mono font-medium text-slate-500/60 uppercase tracking-widest">AES-256</span>
                    </div>

                    <div className="h-10 w-px bg-white/10 hidden lg:block"></div>
                    
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-indigo-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img 
                            src="/logo.png" 
                            alt="Portal Logo" 
                            className="h-10 w-auto brightness-0 invert opacity-95 hover:opacity-100 transition-opacity" 
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
