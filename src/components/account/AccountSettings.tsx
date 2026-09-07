import AvatarSection from './components/AvatarSection';
import AccountForm from './components/AccountForm';

export default function AccountSettings() {
    return (
        <div className="relative bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                {/* Left Side: Avatar */}
                <div className="lg:w-1/3 flex flex-col items-center">
                    <AvatarSection />
                </div>

                {/* Right Side: Form */}
                <div className="lg:w-2/3">
                    <AccountForm />
                </div>
            </div>
        </div>
    );
}
