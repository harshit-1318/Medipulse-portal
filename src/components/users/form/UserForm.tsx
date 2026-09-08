import { useUserForm } from '../hooks';
import UserFormFields from './UserForm/UserFormFields';
import UserFormActions from './UserFormActions';
import { m } from 'framer-motion';



interface UserFormProps {
    userId?: string;
}

export default function UserForm({ userId }: UserFormProps) {
    const {
        form, handleChange, onSubmit,
        sites, loadingSites, loadingUser, rolesToShow,
        errors, isSubmitting, isEditMode, isSuperAdmin, isSiteLocked
    } = useUserForm(userId);

    if (loadingUser) {
        return (
            <div className="py-20 text-center animate-pulse space-y-4">
                <div className="h-10 w-48 bg-slate-100 rounded-xl mx-auto" />
                <div className="h-100 w-full bg-slate-50/50 rounded-2xl mx-auto border border-slate-100" />
            </div>
        );
    }
    return (
        <m.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -4, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 w-full overflow-visible transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)]"
        >
            <div className="mb-4 border-b border-slate-100/80 pb-4 text-center md:text-left">
                <h2 className="text-[26px] font-extrabold text-slate-900 tracking-tight leading-none mb-2">
                    {isEditMode ? 'Edit User Profile' : 'Add New User'}
                </h2>
                <p className="text-slate-400 text-[14px] font-medium leading-relaxed">
                    {isEditMode ? 'Modify account credentials and system access permissions' : 'Configure a new system account with specific roles and site permissions'}
                </p>
            </div>

            <form onSubmit={onSubmit}>
                <UserFormFields
                    form={form}
                    onChange={handleChange}
                    errors={errors}
                    isEditMode={isEditMode}
                    canViewPassword={isEditMode && isSuperAdmin}
                    sites={sites}
                    rolesToShow={rolesToShow}
                    loadingSites={loadingSites}
                    isSiteLocked={isSiteLocked}
                />

                <UserFormActions
                    isEditMode={isEditMode}
                    isSubmitting={isSubmitting}
                />
            </form>
        </m.div>
    );
}
