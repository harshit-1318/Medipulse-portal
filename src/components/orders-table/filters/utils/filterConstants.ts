export const CATEGORY_PRODUCTS_MAP: Record<string, string[]> = {
    "weight-loss": ["Mounjaro", "Wegovy", "Semaglutide", "Tirzepatide", "Zepbound", "Ozempic", "Rybelsus", "Orlistat", "Saxenda", "Mysimba", "Xenical"],
    "ed": ["Sildenafil", "Tadalafil", "Viagra", "Cialis", "Levitra", "Spedra", "Vardenafil"],
    "acne": ["Acne Treatment", "Pimple Cream", "Retinoid", "Duac", "Differin", "Epiduo", "Lymecycline"],
    "migraine": ["Sumatriptan", "Zolmitriptan", "Rizatriptan", "Almogran", "Maxalt", "Zomig"],
    "asthma": ["Salbutamol", "Ventolin", "Salamol", "Clenil", "Seretide", "Symbicort"],
    "eczema-dermatitis": ["Hydrocortisone", "Betnovate", "Eumovate", "Dermovate", "Fucidin"],
    "jet-lag-treatment": ["Melatonin", "Circadin"],
    "mens-hair-loss": ["Finasteride", "Propecia", "Minoxidil", "Regaine"],
    "period-delay": ["Norethisterone", "Utovlan"],
    "acid-reflux": ["Omeprazole", "Lansoprazole", "Pantoprazole", "Esomeprazole", "Nexium"],
    "joint-pain": ["Naproxen", "Diclofenac", "Ibuprofen (Strong)", "Voltarol"],
    "bacterial-vaginosis": ["Metronidazole", "Zidoval", "Dalacin", "Canesten BV"],
};

export const PRODUCT_CATEGORIES = [
    { label: "All Categories", value: "" },
    { label: "Weight Loss", value: "weight-loss" },
    { label: "ED", value: "ed" },
    { label: "Acne", value: "acne" },
    { label: "Migraine", value: "migraine" },
    { label: "Asthma", value: "asthma" },
    { label: "Eczema & Dermatitis", value: "eczema-dermatitis" },
    { label: "Jet Lag Treatment", value: "jet-lag-treatment" },
    { label: "Mens Hair Loss", value: "mens-hair-loss" },
    { label: "Period Delay", value: "period-delay" },
    { label: "Acid Reflux", value: "acid-reflux" },
    { label: "Joint Pain", value: "joint-pain" },
    { label: "Bacterial Vaginosis", value: "bacterial-vaginosis" },
];

export const STATUS_OPTIONS = [
    { label: "All", value: "" },
    { label: "On Hold", value: "On Hold" },
    { label: "Unfulfilled", value: "Unfulfilled" },
    { label: "Fulfilled", value: "Fulfilled" },
    { label: "Cancelled", value: "Cancelled" },
];

export const FULFILLMENT_STATUS_OPTIONS = [
    { label: "All", value: "" },
    { label: "On Hold", value: "On Hold" },
    { label: "Unfulfilled", value: "Unfulfilled" },
    { label: "Fulfilled", value: "Fulfilled" },
    { label: "Cancelled", value: "Cancelled" },
];

export const ORDER_TYPE_OPTIONS = [
    { label: "All", value: "" },
    { label: "First Order", value: "first" },
    { label: "Repeat Orders", value: "repeat" },
];

export const DOCUMENT_OPTIONS = [
    { label: "All", value: "" },
    { label: "Uploaded", value: "Uploaded" },
    { label: "Not Uploaded", value: "Not Uploaded" },
];

export const ALL_PRODUCT_TYPES = [
    { label: "All", value: "" },
    { label: "Injectable", value: "injectable" },
    { label: "Oral", value: "oral" },
    { label: "Tablet", value: "tablet", disabled: true },
    { label: "Gel", value: "gel", disabled: true },
    { label: "Cream", value: "cream", disabled: true },
    { label: "Lotion", value: "lotion", disabled: true },
    { label: "Inhaler", value: "inhaler", disabled: true },
    { label: "Ointment", value: "ointment", disabled: true },
    { label: "Solution", value: "solution", disabled: true },
    { label: "Foam", value: "foam", disabled: true },
    { label: "Capsules", value: "capsules", disabled: true }
];
