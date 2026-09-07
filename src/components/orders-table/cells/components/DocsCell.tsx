import type { OrderDocumentItemsStatus } from "@/api/services/orders/types";

interface DocsCellProps {
  uploaded: boolean;
  documentItemsStatus?: OrderDocumentItemsStatus;
}

export const DocsCell = ({ uploaded, documentItemsStatus }: DocsCellProps) => {
  const status = documentItemsStatus ?? {
    id: uploaded,
    fullPhoto: uploaded,
    video: false,
  };

  const rows = [
    { label: "ID", uploaded: status.id },
    { label: "Full Photo", uploaded: status.fullPhoto },
    { label: "Video", uploaded: status.video },
  ];

  return (
    <div className="inline-flex flex-col gap-1.5 rounded-lg border border-slate-200/80 bg-white/90 px-2.5 py-2 text-left shadow-[0_2px_8px_-4px_rgba(15,23,42,0.15)]">
      {rows.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-[64px_auto] items-center gap-2 text-[11px] leading-none"
        >
          <span className="font-semibold text-[#003B73]">{item.label}:</span>
          <span
            className={`inline-block w-fit px-2 py-1 rounded-full font-bold tracking-wide ${
              item.uploaded
                ? "bg-linear-to-b from-emerald-50 to-emerald-100/30 border border-emerald-200/80 text-emerald-700 shadow-sm shadow-emerald-500/10"
                : "bg-linear-to-b from-slate-50 to-slate-100/50 border border-slate-200/80 text-slate-500 shadow-sm shadow-slate-500/10"
            }`}
          >
            {item.uploaded ? "Uploaded" : "Not Uploaded"}
          </span>
        </div>
      ))}
    </div>
  );
};
