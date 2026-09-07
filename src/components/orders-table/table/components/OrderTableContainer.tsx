import { OrderTableHeader } from "./OrderTableHeader";
import { OrderTableBody } from "./OrderTableBody";

interface Props {
    containerRef: React.RefObject<HTMLDivElement | null>;
    table: any;
    columnsCount: number;
    loading: boolean;
}

export const OrderTableContainer: React.FC<Props> = ({ containerRef, table, columnsCount, loading }) => {
    return (
        <div ref={containerRef} className="max-h-[65vh] overflow-y-auto overflow-x-auto w-full border-t border-slate-200">
            <table className="min-w-full text-[14px] text-slate-800 border-collapse relative">
                <OrderTableHeader table={table} />
                <OrderTableBody table={table} columnsCount={columnsCount} loading={loading} />
            </table>
        </div>
    );
};
