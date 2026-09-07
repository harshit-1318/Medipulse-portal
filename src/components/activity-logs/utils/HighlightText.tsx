
export const HighlightText = ({ text }: { text: string }) => {
    if (!text) return null;
    const regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)|(\d{10,})|(https?:\/\/[^\s]+)/g;
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, index) => {
                if (!part) return null;
                if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+$/.test(part)) {
                    return (
                        <span key={`email-${index}`} className="text-indigo-600 font-bold underline decoration-indigo-200">
                            {part}
                        </span>
                    );
                }
                if (/^\d{10,}$/.test(part)) {
                    return (
                        <span key={`id-${index}`} className="text-[#00B3CC] font-bold">
                            {part}
                        </span>
                    );
                }
                if (/^https?:\/\/[^\s]+$/.test(part)) {
                    return (
                        <a key={`url-${index}`} href={part} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                            {part}
                        </a>
                    );
                }
                return <span key={`text-${index}`}>{part}</span>;
            })}
        </>
    );
};
