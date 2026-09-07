import { useEffect, useMemo, useState } from "react";
import { findById } from "@/api/services/user/userService";
import type { User } from "@/components/users/types";
import { UserDetailHeader } from "./UserDetailHeader";
import { UserActivitySection } from "./UserActivitySection";

interface UserDetailPageProps {
    userId: string;
}

function UserDetailContent({ userId }: UserDetailPageProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        let active = true;

        const loadUser = async () => {
            setLoadingUser(true);
            try {
                const res: any = await findById(userId);
                const u: User = res?.user ?? res;
                if (!active) return;
                setUser(u || null);
            } catch {
                if (!active) return;
                setUser(null);
            } finally {
                if (active) setLoadingUser(false);
            }
        };

        void loadUser();

        return () => {
            active = false;
        };
    }, [userId]);

    const statusLabel = (user?.is_active ?? true) ? "Active" : "Disabled";

    const subtitle = useMemo(() => {
        if (!user) return "User profile and activity history";
        return `${user.email} • ${user.is_super_admin ? "Super Admin" : user.role}`;
    }, [user]);

    return (
        <div className="space-y-6 font-montserrat pb-10">
            <UserDetailHeader
                user={user}
                loadingUser={loadingUser}
                subtitle={subtitle}
                statusLabel={statusLabel}
            />

            {user?.email && (
                <UserActivitySection userId={userId} userEmail={user.email} />
            )}
        </div>
    );
}

export default function UserDetailPage(props: UserDetailPageProps) {
    return <UserDetailContent {...props} />;
}
