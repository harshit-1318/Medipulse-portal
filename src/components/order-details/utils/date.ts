export function formatDate(dateString?: string) {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "N/A";
    
    return `${String(d.getUTCDate()).padStart(2, "0")}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${d.getUTCFullYear()}`;
}

export function formatDateModern(dateString?: string) {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "N/A";
    
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
    const year = d.getUTCFullYear();
    
    return `${day} ${month} ${year}`;
}
