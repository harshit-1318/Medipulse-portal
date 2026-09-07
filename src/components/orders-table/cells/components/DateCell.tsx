import { formatDate } from "@/api/services/orders/utils";

interface DateCellProps {
  dateStr: string;
}

export const DateCell = ({ dateStr }: DateCellProps) => {
  const { date, subtext } = formatDate(dateStr);
  return (
    <div className="flex flex-col items-center justify-center font-montserrat tracking-wide text-center">
      <span className="text-slate-800 font-semibold text-[14px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.02)]">{date}</span>
      {subtext && (
        <span className="text-slate-400 font-medium text-[12px]">{subtext}</span>
      )}
    </div>
  );
};
