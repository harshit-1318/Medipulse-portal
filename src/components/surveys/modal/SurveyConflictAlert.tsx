import { AlertTriangle } from 'lucide-react';

interface SurveyConflictAlertProps {
    onResend: () => void;
}

export function SurveyConflictAlert({ onResend }: SurveyConflictAlertProps) {
    return (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
                <p className="text-sm font-medium text-amber-800">Survey already sent</p>
                <p className="text-xs text-amber-700 mt-0.5">
                    A pending survey has already been sent to this customer.
                </p>
                <button
                    onClick={onResend}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline mt-1.5"
                >
                    Resend anyway
                </button>
            </div>
        </div>
    );
}
