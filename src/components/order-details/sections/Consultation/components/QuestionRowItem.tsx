
interface QuestionRowItemProps {
    q: { name: string; value: string };
    index: number;
}

export function QuestionRowItem({ q, index }: QuestionRowItemProps) {
    const val = String(q.value || "").trim();
    const lower = val.toLowerCase();

    const formatDate = (dateStr: string) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(dateStr)) {
            const [year, month, day] = dateStr.split("-");
            return `${day}-${month}-${year}`;
        }
        return dateStr;
    };

    const cleanLabel = (name: string) => {
        if (!name.includes(" ") && name.includes("_")) {
            return name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        }
        if (name.toLowerCase() === "bmi") return "BMI";
        return name;
    };

    const isReorderOrderId = (name: string) =>
        name.toLowerCase().replace(/[\s_]+/g, "") === "reorderorderid";

    const label = cleanLabel(q.name);
    const isYes = lower === "yes" || lower.startsWith("yes");
    const isNo = lower === "no" || lower.startsWith("no");
    const isMistake = lower.includes("mistake");
    const isCompleted = lower === "completed";

    if (isReorderOrderId(q.name) && val) {
        return (
            <div key={`${q.name}-${index}`} className="consultation-row">
                <span className="consultation-label">{label}</span>
                <div className="consultation-answer-wrapper">
                    <a
                        href={`/orders/view/${val}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="status-badge shadow-none! badge-neutral hover:opacity-80 transition-opacity"
                    >
                        <span className="status-badge-dot" />
                        <span>{val}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div key={`${q.name}-${index}`} className="consultation-row">
            <span className="consultation-label">{label}</span>
            <div className="consultation-answer-wrapper">
                <span className={`status-badge shadow-none! ${
                    isYes ? 'badge-success' :
                    isNo ? 'badge-error' :
                    isMistake ? 'badge-warning' :
                    isCompleted ? 'badge-info' :
                    'badge-neutral'
                }`}>
                    <span className="status-badge-dot" />
                    <span>{formatDate(val)}</span>
                </span>
            </div>
        </div>
    );
}
