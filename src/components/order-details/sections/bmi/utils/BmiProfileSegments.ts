import type { BmiProfile } from "./bmiProfile";

export function getBmiGaugeMarkers(bmiProfile: BmiProfile) {
    const labelMarkers = bmiProfile === "ethnicity-adjusted"
        ? [
            { text: "Underweight", left: "9.25%" },
            { text: "Normal", left: "20.75%" },
            { text: "Overweight", left: "25.25%" },
            { text: "Obese", left: "63.75%" }
        ]
        : [
            { text: "Underweight", left: "9.25%" },
            { text: "Normal", left: "21.75%" },
            { text: "Overweight", left: "27.5%" },
            { text: "Obese+", left: "65%" }
        ];

    const segmentClasses = bmiProfile === "ethnicity-adjusted"
        ? [
            "h-full w-[18.5%] bg-sky-500/85",
            "h-full w-[4.5%] bg-emerald-500/85 border-x border-white/40",
            "h-full w-[4.5%] bg-amber-500/90",
            "h-full flex-1 bg-red-500/85 border-l border-white/40"
        ]
        : [
            "h-full w-[18.5%] bg-sky-500/85",
            "h-full w-[6.5%] bg-emerald-500/85 border-x border-white/40",
            "h-full w-[5%] bg-amber-500/90",
            "h-full w-[10%] bg-red-500/85 border-x border-white/40",
            "h-full flex-1 bg-fuchsia-600/85"
        ];

    return { labelMarkers, segmentClasses };
}
