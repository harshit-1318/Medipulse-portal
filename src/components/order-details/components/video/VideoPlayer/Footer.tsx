
const Footer: React.FC = () => {
    return (
        <footer className="mt-auto border-t border-white/2 py-6 px-6 relative overflow-hidden opacity-60">
            <div className="max-w-300 mx-auto flex flex-row justify-between items-center gap-4 relative z-10">
                <div className="flex items-center gap-4">
                    <img 
                        src="/medipulse-logo-dark.svg" 
                        alt="MediPulse Logo" 
                        className="h-4 w-auto brightness-0 invert opacity-60" 
                    />
                    <div className="h-3 w-px bg-white/10"></div>
                    <p className="text-[11px] font-medium text-slate-400">MediPulse Secure Gateway</p>
                </div>

                <div className="flex items-center gap-6 text-[11px] font-medium text-slate-500">
                    <span className="cursor-default">© 2026 MediPulse</span>
                    <span className="text-teal-400/80">Secured by AES-256</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
