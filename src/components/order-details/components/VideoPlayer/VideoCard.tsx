import { motion } from 'framer-motion';

interface VideoCardProps {
    videoUrl: string | null;
}

const VideoCard: React.FC<VideoCardProps> = ({ videoUrl }) => {
    return (
        <div className="relative group p-[2px] rounded-[16px] overflow-hidden w-full max-w-[1000px] mx-auto shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            {/* Pulsing Border Gradient */}
            <motion.div 
                animate={{ 
                    rotate: [0, 360],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-full bg-conic-gradient from-indigo-500/40 via-emerald-500/40 to-indigo-500/40 opacity-30 group-hover:opacity-60 transition-opacity duration-700"
            />
            
            <div className="relative glass-card p-0 rounded-[16px] overflow-hidden flex flex-col">
                <div className="w-full h-full bg-slate-950 rounded-[16px] overflow-hidden relative group/video flex-1 flex flex-col justify-center">
                    {/* Native video needs z-indexed container but overflow should be careful */}
                    
                    {videoUrl ? (
                        <video 
                            controls 
                            className="w-full h-auto relative z-10 block"
                            autoPlay
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-6 relative z-10">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 blur-xl bg-indigo-500/20 rounded-full animate-pulse"></div>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-lg font-semibold text-white tracking-tight">Securing Connection</p>
                                <p className="text-sm font-medium text-slate-500 italic">Authenticating encrypted playback session...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
