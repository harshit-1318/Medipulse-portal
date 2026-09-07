
interface Props {
    userName: string;
    formattedDate: string;
}

export const NoteItemHeader: React.FC<Props> = ({ userName, formattedDate }) => (
    <div className="space-y-0.5">
        <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-text-primary tracking-tight">{userName}</span>
            <span className="text-[11px] font-medium text-text-secondary">{formattedDate}</span>
        </div>
    </div>
);
