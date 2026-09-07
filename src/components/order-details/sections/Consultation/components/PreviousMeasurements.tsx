import type { BmiStatus } from "../../bmi/hooks/useBmiStatus";
import { BmiGauge } from "../../bmi/BmiGauge";

interface PreviousMeasurementsProps {
    prevBmiDisplay: string;
    prevBmiStatus: BmiStatus;
    prevHeightDisplay: string;
    prevWeightDisplay: string;
}

export function PreviousMeasurements({
    prevBmiDisplay,
    prevBmiStatus,
    prevHeightDisplay,
    prevWeightDisplay,
}: PreviousMeasurementsProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <div className="consultation-group-header">
                <span className="consultation-group-title text-text-secondary">
                    Previous Consultation Measurements
                    {prevBmiDisplay !== "-" && (
                        <span className="ml-1.5 font-normal text-text-secondary">(BMI: {prevBmiDisplay})</span>
                    )}
                </span>
                <div className="consultation-group-line opacity-50" />
            </div>
            {prevBmiDisplay !== "-" && (
                <BmiGauge bmiDisplay={prevBmiDisplay} bmiStatus={prevBmiStatus} bmiProfile="standard" />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {prevHeightDisplay !== "-" && (
                    <div className="consultation-row border border-slate-100/50 shadow-sm py-2.5! px-4!">
                        <span className="consultation-label">Previous Height</span>
                        <div className="consultation-answer-wrapper">
                            <span className="status-badge badge-neutral shadow-none!">{prevHeightDisplay}</span>
                        </div>
                    </div>
                )}
                {prevWeightDisplay !== "-" && (
                    <div className="consultation-row border border-slate-100/50 shadow-sm py-2.5! px-4!">
                        <span className="consultation-label">Previous Weight</span>
                        <div className="consultation-answer-wrapper">
                            <span className="status-badge badge-neutral shadow-none!">{prevWeightDisplay}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
