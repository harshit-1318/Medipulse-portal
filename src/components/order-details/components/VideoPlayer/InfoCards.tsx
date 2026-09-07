import { motion } from 'framer-motion';
import { ShieldCheck, MonitorPlay, Lock } from 'lucide-react';

interface InfoCardsProps {
    orderId: string;
}

const InfoCards: React.FC<InfoCardsProps> = ({ orderId }) => {
    const decodedId = decodeURIComponent(orderId);

    const cards = [
        {
            icon: ShieldCheck,
            label: "Consultation ID",
            value: decodedId,
            color: "indigo",
        },
        {
            icon: MonitorPlay,
            label: "Playback Status",
            value: "Ready for Verification",
            color: "emerald",
        },
        {
            icon: Lock,
            label: "Security Protocol",
            value: "AES-256 Encrypted",
            color: "amber",
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mt-[32px]">
            {cards.map((card, idx) => (
                <motion.div 
                    key={idx}
                    whileHover={{ y: -2, scale: 1.01 }}
                    className="group glass-card h-[90px] p-[20px] rounded-[14px] relative overflow-hidden flex items-center transition-all"
                >
                    {/* Card Inner Glow */}
                    <div className={`absolute inset-0 bg-linear-to-br from-${card.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className={`w-12 h-12 rounded-2xl bg-${card.color}-500/10 flex items-center justify-center text-${card.color}-400 ring-2 ring-${card.color}-500/20 shadow-xl overflow-hidden relative mr-[14px] shrink-0`}>
                        <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-50" />
                        <card.icon className="w-5 h-5 relative z-10" />
                    </div>
                    
                    <div className="space-y-0.5 relative z-10">
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{card.label}</p>
                        <p className="text-[15px] font-semibold text-white tracking-tight">{card.value}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default InfoCards;
