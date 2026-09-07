import React from 'react';
import { Eye, FileText } from "lucide-react";
import { ActionButton } from "../../../common/table/TableUI";

interface Props {
    shopifyOrderId: string | number;
    prescriptionPdf?: string | null;
}

export const PrescriptionActionButtons: React.FC<Props> = ({ shopifyOrderId, prescriptionPdf }) => {
    return (
        <div className="flex items-center justify-center gap-3">
            {/* VIEW BUTTON - Primary Action */}
            <ActionButton
                href={`/orders/view/${shopifyOrderId}`}
                icon={Eye}
                label="View"
                variant="cyan"
                title="View Order Details"
            />

            {/* PDF BUTTON - Secondary Action */}
            <ActionButton
                href={prescriptionPdf || undefined}
                icon={FileText}
                label={prescriptionPdf ? "PDF" : "N/A"}
                variant="slate"
                disabled={!prescriptionPdf}
                title={prescriptionPdf ? "View Prescription PDF" : "PDF Not Available"}
                target="_blank"
                rel="noopener noreferrer"
            />
        </div>
    );
};




