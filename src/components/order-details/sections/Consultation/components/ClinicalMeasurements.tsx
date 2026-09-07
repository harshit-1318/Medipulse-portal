import type { BmiStatus } from "../../bmi/hooks/useBmiStatus";
import { BmiGauge } from "../../bmi/BmiGauge";
import { PreviousMeasurements } from "./PreviousMeasurements";

export { PreviousMeasurements };

interface CurrentMeasurementsProps {
    bmiDisplay: string;
    bmiStatus: BmiStatus;
    showPrevMeasurements: boolean;
    prevBmiStatus: BmiStatus;
    bmiDelta: number | null;
    heightDisplay: string;
    weightDisplay: string;
}

export function CurrentMeasurements({
    bmiDisplay,
    bmiStatus,
    showPrevMeasurements,
    prevBmiStatus,
    bmiDelta,
    heightDisplay,
    weightDisplay,
}: CurrentMeasurementsProps) {
    return (
        <div className="space-y-6">
            <BmiGauge
                bmiDisplay={bmiDisplay}
                bmiStatus={bmiStatus}
                bmiProfile="standard"
                fromPos={showPrevMeasurements ? prevBmiStatus.pos : undefined}
            />

            {bmiDelta !== null && (
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl border ${
                        bmiDelta > 0
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : bmiDelta < 0
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                        <span className="text-base leading-none">{bmiDelta > 0 ? '▲' : bmiDelta < 0 ? '▼' : '='}</span>
                        <span>{bmiDelta > 0 ? `+${bmiDelta}` : bmiDelta} BMI since last order</span>
                    </span>
                </div>
            )}

            <div className="space-y-1">
                <div className="consultation-group-header">
                    <span className="consultation-group-title">Current Clinical Measurements</span>
                    <div className="consultation-group-line" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="consultation-row border border-slate-100/50 shadow-sm py-2.5! px-4!">
                        <span className="consultation-label">Height</span>
                        <div className="consultation-answer-wrapper">
                            <span className="status-badge badge-info shadow-none!">{heightDisplay}</span>
                        </div>
                    </div>
                    <div className="consultation-row border border-slate-100/50 shadow-sm py-2.5! px-4!">
                        <span className="consultation-label">Weight</span>
                        <div className="consultation-answer-wrapper">
                            <span className="status-badge badge-info shadow-none!">{weightDisplay}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
