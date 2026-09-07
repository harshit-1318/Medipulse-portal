import React from 'react';

interface DeclineConfirmationStepProps {
    sending: boolean;
    handleConfirm: () => void;
    onCancel: () => void;
}

export const DeclineConfirmationStep: React.FC<DeclineConfirmationStepProps> = ({
    sending,
    handleConfirm,
    onCancel,
}) => (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-xl z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-200">
        <div className="bg-rose-50 text-rose-600 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6 animate-bounce">
            ⚠️
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Are you sure?</h3>
        <p className="text-slate-500 mb-8 max-w-xs">Are you sure you want to cancel this order? This action cannot be undone.</p>
        
        <div className="flex flex-col w-full gap-3">
            <button 
                className="w-full py-3.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all shadow-md shadow-rose-100 active:scale-95 disabled:opacity-50 cursor-pointer"
                onClick={handleConfirm}
                disabled={sending}
            >
                {sending ? "Cancelling..." : "Yes, Cancel Order"}
            </button>
            <button 
                className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
                onClick={onCancel}
                disabled={sending}
            >
                No, Keep Order
            </button>
        </div>
    </div>
);
