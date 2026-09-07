import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SendSurveySuccessStateProps {
    onClose: () => void;
}

export const SendSurveySuccessState: React.FC<SendSurveySuccessStateProps> = ({ onClose }) => (
    <div className="text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto" />
        <p className="font-semibold text-slate-800">Survey sent!</p>
        <p className="text-sm text-slate-500">
            The customer will receive an email with a unique survey link.
        </p>
        <button
            onClick={onClose}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
            Done
        </button>
    </div>
);
