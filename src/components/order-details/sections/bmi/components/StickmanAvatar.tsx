import { getStickmanScale } from '../utils/stickmanScale';


interface StickmanAvatarProps {
    displayPos: string;
    slideTransition: string;
    totalOffsetY: number;
    walkLean: number;
    rightArmAngle: number;
    leftArmAngle: number;
    rightLegAngle: number;
    leftLegAngle: number;
    stickmanScale: ReturnType<typeof getStickmanScale>;
    limbTransition: string;
}

export function StickmanAvatar({
    displayPos,
    slideTransition,
    totalOffsetY,
    walkLean,
    rightArmAngle,
    leftArmAngle,
    rightLegAngle,
    leftLegAngle,
    stickmanScale,
    limbTransition,
}: StickmanAvatarProps) {
    return (
        <div
            className="absolute z-10"
            style={{ left: displayPos, bottom: "100%", transform: 'translate(-50%, 30px)', transition: slideTransition }}
            data-testid="bmi-stickman"
        >
            <div
                className="relative flex flex-col items-center"
                style={{ transform: `translateY(${totalOffsetY}px) rotate(${walkLean}deg)`, transition: 'transform 300ms ease-out' }}
            >
                <div
                    className="mx-auto h-2.5 w-2.5 rounded-full bg-slate-900 shadow-sm transition-all duration-700"
                    style={{ transform: `scale(${0.85 + (stickmanScale.torsoScale - 1) * 0.4})` }}
                />
                <div
                    className="relative mx-auto mt-0.5 h-5 w-1 rounded-full bg-slate-900 transition-all duration-700"
                    style={{ transform: `scaleX(${stickmanScale.torsoScale})` }}
                >
                    <div className="absolute top-1 left-1/2 flex -translate-x-1/2 gap-2">
                        <div
                            className="h-3.5 w-0.5 origin-top rounded-full bg-slate-900"
                            style={{ transform: `rotate(${rightArmAngle}deg) scaleX(${stickmanScale.limbScale})`, transition: limbTransition }}
                        />
                        <div
                            className="h-3.5 w-0.5 origin-top rounded-full bg-slate-900"
                            style={{ transform: `rotate(${leftArmAngle}deg) scaleX(${stickmanScale.limbScale})`, transition: limbTransition }}
                        />
                    </div>
                </div>
                <div className="-mt-px flex justify-center gap-1">
                    <div
                        className="h-3.5 w-0.5 origin-top rounded-full bg-slate-900"
                        style={{ transform: `rotate(${rightLegAngle}deg) scaleX(${stickmanScale.limbScale})`, transition: limbTransition }}
                    />
                    <div
                        className="h-3.5 w-0.5 origin-top rounded-full bg-slate-900"
                        style={{ transform: `rotate(${leftLegAngle}deg) scaleX(${stickmanScale.limbScale})`, transition: limbTransition }}
                    />
                </div>
            </div>
        </div>
    );
}
