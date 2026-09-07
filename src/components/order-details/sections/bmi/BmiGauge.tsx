import type { BmiProfile } from "./utils/bmiProfile";
import type { BmiStatus } from "./hooks/useBmiStatus";
import { StickmanAvatar } from "./components/StickmanAvatar";
import { getStickmanScale } from "./utils/stickmanScale";
import { useWalkAnimation } from "./hooks/useWalkAnimation";
import { getBmiGaugeMarkers } from "./utils/BmiProfileSegments";

export { getStickmanScale };

interface Props {
    bmiDisplay: string;
    bmiStatus: BmiStatus;
    bmiProfile: BmiProfile;
    showStandardThresholdNote?: boolean;
    fromPos?: string;
}

export const BmiGauge = ({ bmiDisplay, bmiStatus, bmiProfile, showStandardThresholdNote = false, fromPos }: Props) => {
    const {
        containerRef,
        displayPos,
        totalOffsetY,
        walkLean,
        rightArmAngle,
        leftArmAngle,
        rightLegAngle,
        leftLegAngle,
        stickmanScale,
        limbTransition,
        slideTransition,
    } = useWalkAnimation(bmiDisplay, bmiStatus, fromPos);

    const { labelMarkers, segmentClasses } = getBmiGaugeMarkers(bmiProfile);

    return (
        <div ref={containerRef} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-5">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <p className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">Body Mass Index</p>
                    <div className="flex items-baseline gap-2">
                        <h4 className={`text-3xl font-bold ${bmiStatus.color} tracking-tight`}>{bmiDisplay}</h4>
                        <span className="text-xs font-medium text-text-secondary">kg/m²</span>
                    </div>
                </div>
                <div className={`status-badge ${bmiStatus.badgeBgClass} ${bmiStatus.badgeTextClass} ${bmiStatus.badgeBorderClass}`}>
                    <span className={`status-badge-dot ${bmiStatus.badgeDotClass}`} />
                    {bmiStatus.label}
                </div>
            </div>

            {showStandardThresholdNote && (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-600">
                    Using standard BMI thresholds (ethnicity not provided).
                </div>
            )}

            <div className="relative pt-10">
                <div className="relative h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                    {segmentClasses.map((className) => (
                        <div key={className} className={className} />
                    ))}
                </div>

                <StickmanAvatar
                    displayPos={displayPos}
                    slideTransition={slideTransition}
                    totalOffsetY={totalOffsetY}
                    walkLean={walkLean}
                    rightArmAngle={rightArmAngle}
                    leftArmAngle={leftArmAngle}
                    rightLegAngle={rightLegAngle}
                    leftLegAngle={leftLegAngle}
                    stickmanScale={stickmanScale}
                    limbTransition={limbTransition}
                />
                
                <div className="relative h-4 mt-2">
                    {labelMarkers.map((label) => (
                        <span
                            key={`${label.text}-${label.left}`}
                            className="absolute text-[11px] font-medium text-text-secondary -translate-x-1/2 whitespace-nowrap"
                            style={{ left: label.left }}
                        >
                            {label.text}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
