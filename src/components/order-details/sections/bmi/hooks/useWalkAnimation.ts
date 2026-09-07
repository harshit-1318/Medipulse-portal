import { useEffect, useMemo, useRef, useState } from 'react';
import type { BmiStatus } from "./useBmiStatus";
import { getStickmanScale } from "../utils";

export function useWalkAnimation(bmiDisplay: string, bmiStatus: BmiStatus, fromPos?: string) {
    const stickmanScale = getStickmanScale(bmiDisplay);
    const containerRef = useRef<HTMLDivElement>(null);
    const animatedRef = useRef(false);
    const [displayPos, setDisplayPos] = useState(fromPos ?? bmiStatus.pos);
    const [isWalking, setIsWalking] = useState(false);
    const [walkPhase, setWalkPhase] = useState(0);

    const walkDirection = useMemo(() => {
        if (!fromPos) return 1 as const;
        return parseFloat(fromPos) > parseFloat(bmiStatus.pos) ? -1 as const : 1 as const;
    }, [fromPos, bmiStatus.pos]);

    useEffect(() => {
        if (!fromPos) return;
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !animatedRef.current) {
                    animatedRef.current = true;
                    observer.disconnect();
                    const timers: ReturnType<typeof setTimeout>[] = [];

                    timers.push(setTimeout(() => {
                        setDisplayPos(bmiStatus.pos);
                        setIsWalking(true);
                    }, 1000));

                    timers.push(setTimeout(() => {
                        setIsWalking(false);
                        setWalkPhase(0);
                    }, 2700));

                    return () => timers.forEach(clearTimeout);
                }
            },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [fromPos, bmiStatus.pos]);

    useEffect(() => {
        if (!isWalking) return;
        const interval = setInterval(() => setWalkPhase(p => (p + 0.06) % 1), 20);
        return () => clearInterval(interval);
    }, [isWalking]);

    const rightArmAngle = isWalking ? 48 + Math.sin(walkPhase * 2 * Math.PI) * 22 : 48;
    const leftArmAngle  = isWalking ? -48 - Math.sin(walkPhase * 2 * Math.PI) * 22 : -48;
    const rightLegAngle = isWalking ? 16 + Math.sin((walkPhase + 0.5) * 2 * Math.PI) * 20 : 16;
    const leftLegAngle  = isWalking ? -16 - Math.sin((walkPhase + 0.5) * 2 * Math.PI) * 20 : -16;
    const walkBob       = isWalking ? Math.abs(Math.sin(walkPhase * 4 * Math.PI)) * -2.5 : 0;
    const walkLean      = isWalking ? walkDirection * 7 : 0;

    return {
        containerRef,
        displayPos,
        totalOffsetY: stickmanScale.offsetY + walkBob,
        walkLean,
        rightArmAngle,
        leftArmAngle,
        rightLegAngle,
        leftLegAngle,
        stickmanScale,
        limbTransition: isWalking ? 'none' : 'transform 700ms',
        slideTransition: fromPos ? 'left 1600ms ease-in-out' : 'none',
    };
}
