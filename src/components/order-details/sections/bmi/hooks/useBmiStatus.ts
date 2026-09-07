import type { BmiProfile } from "../utils/bmiProfile";
import { getGaugePositionPercent } from "../utils/bmiGaugePosition";

export interface BmiStatus {
    label: "Underweight" | "Normal" | "Overweight" | "Obese" | "Severely Obese";
    color: string;
    bg: string;
    border: string;
    badgeClass: "badge-info" | "badge-success" | "badge-warning" | "badge-error";
    zone: "underweight" | "normal" | "overweight" | "obese" | "severe";
    badgeBgClass: string;
    badgeTextClass: string;
    badgeBorderClass: string;
    badgeDotClass: string;
    pos: string;
}

const zoneStyles = {
    underweight: {
        badgeBgClass: "bg-sky-50/80",
        badgeTextClass: "text-sky-700",
        badgeBorderClass: "border border-sky-200/50",
        badgeDotClass: "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.4)]"
    },
    normal: {
        badgeBgClass: "bg-emerald-50/80",
        badgeTextClass: "text-emerald-700",
        badgeBorderClass: "border border-emerald-200/50",
        badgeDotClass: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
    },
    overweight: {
        badgeBgClass: "bg-amber-50/80",
        badgeTextClass: "text-amber-700",
        badgeBorderClass: "border border-amber-200/50",
        badgeDotClass: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
    },
    obese: {
        badgeBgClass: "bg-red-50/80",
        badgeTextClass: "text-red-700",
        badgeBorderClass: "border border-red-200/50",
        badgeDotClass: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
    },
    severe: {
        badgeBgClass: "bg-fuchsia-50/80",
        badgeTextClass: "text-fuchsia-700",
        badgeBorderClass: "border border-fuchsia-200/50",
        badgeDotClass: "bg-fuchsia-600 shadow-[0_0_8px_rgba(192,38,211,0.4)]"
    }
} as const;

const withZoneStyles = (
    status: Omit<BmiStatus, "badgeBgClass" | "badgeTextClass" | "badgeBorderClass" | "badgeDotClass">
): BmiStatus => ({
    ...status,
    ...zoneStyles[status.zone]
});

export const getBmiStatus = (val: number, profile: BmiProfile = "standard"): BmiStatus => {
    const pos = getGaugePositionPercent(val, profile);

    if (val < 18.5) {
        return withZoneStyles({ label: "Underweight", color: "text-sky-700", bg: "bg-sky-100", border: "border-sky-200", badgeClass: "badge-info", zone: "underweight", pos });
    }

    if (profile === "ethnicity-adjusted") {
        if (val < 23) {
            return withZoneStyles({ label: "Normal", color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", badgeClass: "badge-success", zone: "normal", pos });
        }
        if (val < 27.5) {
            return withZoneStyles({ label: "Overweight", color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200", badgeClass: "badge-warning", zone: "overweight", pos });
        }
        return withZoneStyles({ label: "Obese", color: "text-red-700", bg: "bg-red-100", border: "border-red-200", badgeClass: "badge-error", zone: "obese", pos });
    }

    if (val < 25) {
        return withZoneStyles({ label: "Normal", color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", badgeClass: "badge-success", zone: "normal", pos });
    }
    if (val < 30) {
        return withZoneStyles({ label: "Overweight", color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200", badgeClass: "badge-warning", zone: "overweight", pos });
    }
    if (val < 40) {
        return withZoneStyles({ label: "Obese", color: "text-red-700", bg: "bg-red-100", border: "border-red-200", badgeClass: "badge-error", zone: "obese", pos });
    }

    return withZoneStyles({ label: "Severely Obese", color: "text-fuchsia-700", bg: "bg-fuchsia-100", border: "border-fuchsia-200", badgeClass: "badge-error", zone: "severe", pos });
};

export const useBmiStatus = (bmiDisplay: string, profile: BmiProfile = "standard") => {
    const bmiValue = parseFloat(bmiDisplay) || 0;
    return {
        bmiValue,
        bmiStatus: getBmiStatus(bmiValue, profile)
    };
};
