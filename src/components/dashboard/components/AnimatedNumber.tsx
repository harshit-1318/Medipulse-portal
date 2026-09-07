import { useEffect } from 'react';
import { m, useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedNumberProps {
    value: number;
}

export function AnimatedNumber({ value }: AnimatedNumberProps) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.floor(latest));

    useEffect(() => {
        const animation = animate(count, value ?? 0, {
            duration: 1.3,
            ease: "easeOut",
        });
        return animation.stop;
    }, [value]);

    return <m.span>{rounded}</m.span>;
}
