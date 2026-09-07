
interface OrderDetailsErrorProps {
    orderId: string;
    error: any;
}

export const OrderDetailsError = ({ orderId, error }: OrderDetailsErrorProps) => {
    const is401 = (error as any)?.response?.status === 401;

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-8 text-left">
            <div className="order-detail-card max-w-md w-full space-y-6">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100/50">
                    <span className="text-3xl">⚠️</span>
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-semibold text-text-primary">
                        Failed to load order
                    </h2>
                    <p className="text-sm font-semibold text-slate-400">
                        {is401
                            ? 'Your session has expired. Please log in again to view this order.'
                            : 'We couldn\'t find the order with the specified ID in our system.'}
                    </p>
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="w-full py-4 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                >
                    {is401 ? 'Go to Login' : 'Try Again'}
                </button>

                <p className="text-xs font-semibold text-slate-300">
                    Order ID: <span className="font-mono">{orderId}</span>
                </p>
            </div>
        </div>
    );
};
