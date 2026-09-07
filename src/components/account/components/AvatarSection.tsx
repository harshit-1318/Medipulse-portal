import { useState, useEffect } from 'react';
import { useUserStore } from '@/store';
import { getGravatarUrl } from '@/utils/helpers';

export default function AvatarSection() {
    const { user } = useUserStore();
    const [mounted, setMounted] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const activeUser = mounted ? user : undefined;
    const displayAvatar = imgError ? '/avatars/default.png' : getGravatarUrl(activeUser?.email || '', 160);
    const username = activeUser?.username || 'User Profile';

    return (
        <div className="text-center space-y-4">
            <div className="relative inline-block">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-white border border-slate-200 shadow-sm mx-auto">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                        {imgError ? (
                            <span className="text-4xl">👤</span>
                        ) : (
                            <img 
                                src={displayAvatar} 
                                alt="Profile Avatar" 
                                className="w-full h-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        )}
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            
            <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                    {username}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                    MediPulse Profile
                </p>
            </div>
        </div>
    );
}
