import AuthHeader from './components/AuthHeader';
import FormError from './components/FormError';
import EmailInput from './components/EmailInput';
import PasswordInput from './components/PasswordInput';
import SubmitButton from './components/SubmitButton';
import { useLoginFormSubmit } from './hooks/useLoginFormSubmit';

interface LoginFormProps {
    isDark?: boolean;
}

export default function LoginForm({ isDark = true }: LoginFormProps) {
    const { email, setEmail, password, setPassword, loading, error, isDetecting, handleSubmit } = useLoginFormSubmit();

    return (
        <div className="w-full relative group">
            {/* Ambient Backlight Glow */}
            <div className={`absolute -inset-1.5 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-all duration-700 pointer-events-none ${
                isDark
                    ? 'bg-linear-to-r from-cyan-500/20 via-teal-500/15 to-blue-600/20'
                    : 'bg-linear-to-r from-teal-400/20 via-cyan-400/15 to-sky-400/20'
            }`} />

            {/* Glassmorphic Card */}
            <div className={`relative rounded-3xl overflow-hidden backdrop-blur-2xl transition-all duration-500 ${
                isDark
                    ? 'bg-slate-900/85 border border-slate-800/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)] hover:border-slate-700/80'
                    : 'bg-white/92 border border-white/80 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08),0_0_0_1px_rgba(226,232,240,0.85)] hover:border-slate-200'
            }`}>
                {/* Subtle Inner Ambient Tint */}
                <div className={`absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none ${
                    isDark ? 'bg-linear-to-tr from-cyan-500/5 via-transparent to-blue-500/5' : 'bg-linear-to-tr from-teal-500/5 via-transparent to-sky-400/5'
                }`} />

                {/* Top Accent Gradient Line */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${
                    isDark 
                        ? 'bg-linear-to-r from-transparent via-cyan-400/70 to-transparent' 
                        : 'bg-linear-to-r from-transparent via-teal-500/60 to-transparent'
                }`} />

                <div className="px-6 sm:px-8 py-7 sm:py-8.5">
                    <AuthHeader isDark={isDark} />
                    <form onSubmit={handleSubmit} className="space-y-4.5">
                        <FormError error={error} isDark={isDark} />
                        <EmailInput value={email} onChange={setEmail} isDark={isDark} />
                        <PasswordInput value={password} onChange={setPassword} isDark={isDark} />
                        <SubmitButton loading={loading} isDetecting={isDetecting} />
                    </form>
                </div>
            </div>
        </div>
    );
}


