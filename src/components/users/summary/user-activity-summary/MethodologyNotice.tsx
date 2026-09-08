
interface MethodologyNoticeProps {
    estimationModel: {
        sessionGapMinutes: number;
        minimumSessionMinutes: number;
        dayBoundaryTimezone: string;
        excludedActionsFromActiveHours: string[];
    };
}

export function MethodologyNotice({ estimationModel }: MethodologyNoticeProps) {
    return (
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 text-sm text-slate-700 space-y-2">
            <p className="font-semibold text-slate-800">Active Hours (Approx) Methodology</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Experimental metric: use as directional insight, not strict attendance evidence.</p>
            <p>This metric is an <span className="font-semibold">estimate</span> derived from activity-log timestamps, not an attendance clock.</p>
            <p>1. Events are grouped by day ({estimationModel.dayBoundaryTimezone} boundary) and sorted by time.</p>
            <p>2. If the gap between two events is {estimationModel.sessionGapMinutes} minutes or less, they are treated as the same active session.</p>
            <p>3. A gap greater than {estimationModel.sessionGapMinutes} minutes starts a new session.</p>
            <p>4. Each session gets at least {estimationModel.minimumSessionMinutes} minutes credit, even for single-event sessions.</p>
            <p>5. Daily active minutes = sum of session durations; Active Hours (Approx) = active minutes / 60.</p>
            <p>Excluded from Active Hours: {estimationModel.excludedActionsFromActiveHours.join(", ")}.</p>
        </div>
    );
}
