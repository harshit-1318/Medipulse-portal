import { LazyMotion, domAnimation } from "framer-motion";
import UserForm from '@/components/users/components/UserForm';

interface UserFormPageProps {
    userId?: string;
}

function UserFormContent({ userId }: UserFormPageProps) {
    return (
        <LazyMotion features={domAnimation}>
            <div className="min-h-screen w-full flex flex-col items-center justify-start overflow-hidden font-montserrat p-4 md:p-8 bg-slate-50/30 animate-in fade-in duration-700 pt-6 md:pt-10">
                <div className="w-full max-w-6xl">
                    <UserForm userId={userId} />
                </div>
            </div>
        </LazyMotion>
    );
}

export default function UserFormPage({ userId }: UserFormPageProps) {
    return <UserFormContent userId={userId} />;
}
