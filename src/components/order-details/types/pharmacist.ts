export interface PharmacistInfo {
    pharmacist_comments: string;
    scr_comment: string;
    prescription_pdf: string;
    gp_pdf?: string;

    /** MongoDB fields */
    generated_by_id: string; // pharmacist user ID
    generated_by_name: string; // pharmacist NAME (shown in UI)
    generated_by_reg_no?: string; // pharmacist registration number

    gphc_number: string;
    createdAt: string;
}
