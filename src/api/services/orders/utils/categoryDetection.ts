import type { OrderProduct } from "../types";

export function detectCategory(products: string | OrderProduct[]): string {
    const p = (typeof products === "string" ? products : products.map((pr) => pr.name).join(" ")).toLowerCase();
    if (!p || p === "—" || p.trim() === "") return "Other";

    const CATEGORIES = [
        { label: "Weight Loss", keywords: ["wegovy", "weight", "obesity", "semaglutide", "injectable pen", "mounjaro", "tirzepatide", "zepbound", "ozempic", "rybelsus"] },
        { label: "ED", keywords: ["sildenafil", "tadalafil", "viagra", "cialis", "ed"] },
        { label: "Hair Loss", keywords: ["mens-hair-loss", "finasteride", "propecia", "rogaine", "minoxidil"] },
        { label: "Acne", keywords: ["acne", "pimple", "retinoid"] },
        { label: "Migraine", keywords: ["migraine", "headache"] },
        { label: "Asthma", keywords: ["inhaler", "asthma", "bronchodilator"] },
        { label: "Eczema & Dermatitis", keywords: ["eczema", "dermatitis", "skin flare", "moisturizing therapy"] },
        { label: "Jet Lag Treatment", keywords: ["jet lag", "jet lag treatment", "melatonin", "circadin"] },
        { label: "Period Delay", keywords: ["period", "delay", "menstrual"] },
        { label: "Acid Reflux", keywords: ["acid", "reflux", "heartburn", "omeprazole", "lansoprazole"] },
        { label: "Joint Pain", keywords: ["joint", "muscle", "pain", "inflammation", "arthritis", "naproxen"] },
        { label: "Bacterial Vaginosis", keywords: ["bacterial", "vaginosis", "bv", "clindamycin", "metronidazole"] },
        { label: "Diabetes", keywords: ["metformin", "glucophage", "diabetes"] },
        { label: "Stop Smoking", keywords: ["champix", "varenicline", "quit smoking", "stop smoking"] },
        { label: "Thrush", keywords: ["fluconazole", "canesten", "thrush"] },
        { label: "Cystitis", keywords: ["nitrofurantoin", "trimethoprim", "cystitis"] },
        { label: "Psoriasis", keywords: ["psoriasis", "dovobet", "entstilar"] },
        { label: "Hay Fever", keywords: ["hay fever", "fexofenadine", "telfast"] },
        { label: "Cold Sore", keywords: ["cold sore", "aciclovir", "zovirax"] },
        { label: "Travel Sickness", keywords: ["motion sickness", "travel sickness", "avomine"] },
        { label: "Cholesterol", keywords: ["atorvastatin", "simvastatin", "lipitor", "cholesterol"] },
        { label: "Blood Pressure", keywords: ["ramipril", "amlodipine", "bisoprolol", "blood pressure"] },
        { label: "Stomach & Gastric", keywords: ["buscopan", "mebeverine", "stomach", "gastric"] },
        { label: "Skin Care", keywords: ["hydrocortisone", "betnovate", "clotrimazole"] },
        { label: "Eye Care", keywords: ["chloramphenicol", "opticrom", "eye drops"] },
    ];

    for (const cat of CATEGORIES) {
        if (cat.keywords.some((kw) => p.includes(kw))) return cat.label;
    }

    return "Other";
}
