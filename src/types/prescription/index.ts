export interface Prescription {
    id: string;
    shopifyOrderId: string;
    pharmacistName: string | null;
    pharmacistEmail: string | null;
    pharmacistRegNo: string | null;
    pharmacistGphcNumber?: string | null;
    gphcNumber?: string | null;
    gphc_number?: string | null;
    prescriptionPdf: string | null;
    customerId: string;
    generatedAt: string;
    orderDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PrescriptionResponse {
    total: number;
    page: number;
    limit: number;
    prescriptions: Prescription[];
}
