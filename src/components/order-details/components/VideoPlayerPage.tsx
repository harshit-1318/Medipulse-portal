import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './VideoPlayer/Header';
import Footer from './VideoPlayer/Footer';
import InfoCards from './VideoPlayer/InfoCards';
import VideoCard from './VideoPlayer/VideoCard';
import { AnimatedBackground } from './VideoPlayer/AnimatedBackground';
import { GlobalVideoStyles } from './VideoPlayer/GlobalVideoStyles';

interface VideoPlayerPageProps {
    orderId: string;
}

const VideoPlayerPage: React.FC<VideoPlayerPageProps> = ({ orderId }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const url = params.get("url");
        if (url) setVideoUrl(url);
    }, []);

    const handleBack = () => {
        const cleanOrderId = orderId?.replace('%23', '').replace('#', '');
        window.location.href = `/orders/view/${cleanOrderId}`;
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col relative">
            <AnimatedBackground />

            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-50 mb-10">
                <Header onBack={handleBack} />
            </motion.div>

            {videoUrl === null ? (
                <main className="flex-1 w-full max-w-300 mx-auto px-8 flex flex-col items-center justify-center relative z-10">
                    <div className="text-center space-y-3">
                        <p className="text-4xl">🎬</p>
                        <h2 className="text-xl font-semibold text-slate-300">No video URL provided</h2>
                        <p className="text-slate-500 text-sm">The recording link is missing or invalid. Please go back and try again.</p>
                        <button type="button" onClick={handleBack} className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors">
                            ← Back to order
                        </button>
                    </div>
                </main>
            ) : (
                <main className="flex-1 w-full max-w-300 mx-auto px-8 flex flex-col min-h-0 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div key="video-section" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="flex-1 min-h-0 w-full flex flex-col justify-center">
                        <VideoCard videoUrl={videoUrl} />
                    </motion.div>
                </AnimatePresence>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }} className="shrink-0 mt-8 mb-10">
                    <InfoCards orderId={orderId} />
                </motion.div>
                </main>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="relative z-50">
                <Footer />
            </motion.div>

            <GlobalVideoStyles />
        </div>
    );
};

export default VideoPlayerPage;
