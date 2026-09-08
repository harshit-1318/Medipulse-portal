import { ChevronDown, ChevronUp } from "lucide-react";
import { UserActivityHeader } from "./user-activity-summary/UserActivityHeader";
import { UserActivityStatTiles } from "./user-activity-summary/UserActivityStatTiles";
import { UserActivityTable, DailyTotalsCards } from "./user-activity-summary/UserActivityTable";
import { MethodologyNotice } from "./user-activity-summary/MethodologyNotice";
import { CustomRangePicker } from "./user-activity-summary/CustomRangePicker";
import { useUserActivitySummary } from "./user-activity-summary/useUserActivitySummary";

interface UserActivitySummaryProps {
    userEmail: string;
}

export default function UserActivitySummary({ userEmail }: UserActivitySummaryProps) {
    const {
        range,
        customStart,
        setCustomStart,
        customEnd,
        setCustomEnd,
        summary,
        uniqueOrdersViewed,
        estimationModel,
        loading,
        showBreakdown,
        setShowBreakdown,
        showMethodology,
        setShowMethodology,
        handleRangeChange,
        handleCustomApply,
        combined,
        totalActions,
        totalActiveHoursApprox,
    } = useUserActivitySummary(userEmail);

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <UserActivityHeader
                range={range}
                handleRangeChange={handleRangeChange}
                showMethodology={showMethodology}
                setShowMethodology={setShowMethodology}
            />

            {showMethodology && <MethodologyNotice estimationModel={estimationModel} />}

            {range === "custom" && (
                <CustomRangePicker
                    customStart={customStart}
                    setCustomStart={setCustomStart}
                    customEnd={customEnd}
                    setCustomEnd={setCustomEnd}
                    onApply={handleCustomApply}
                />
            )}

            <div className="p-5 space-y-5">
                {loading ? (
                    <div className="text-center text-sm text-slate-400 py-8">Loading summary...</div>
                ) : totalActions === 0 ? (
                    <div className="text-center text-sm text-slate-400 py-8">No activity recorded for this period.</div>
                ) : (
                    <>
                        <UserActivityStatTiles
                            totalActiveHoursApprox={totalActiveHoursApprox}
                            totalActions={totalActions}
                            uniqueOrdersViewed={uniqueOrdersViewed}
                            combined={combined}
                        />

                        <div>
                            <button
                                onClick={() => setShowBreakdown((v) => !v)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-[#00a294] hover:text-teal-800"
                            >
                                {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                {showBreakdown ? "Hide" : "Show"} full action breakdown
                            </button>

                            {showBreakdown && (
                                <UserActivityTable summary={summary} combined={combined} totalActions={totalActions} />
                            )}
                        </div>

                        <DailyTotalsCards summary={summary} />
                    </>
                )}
            </div>
        </div>
    );
}
