import type { Prescription } from '../../../types/prescription';
import { PrescriptionActionButtons } from './components/PrescriptionActionButtons';
import { CopyableCell } from './components/CopyableCell';
import { TableRow, Badge } from '../../common/table/TableUI';
import { formatDate, formatRelativeTime } from '../utils/formatPrescriptionDate';

interface Props {
    prescription: Prescription;
}

export default function PrescriptionRow({ prescription }: Props) {
    const regNo = prescription.pharmacistRegNo ||
        prescription.pharmacistGphcNumber ||
        prescription.gphcNumber ||
        prescription.gphc_number;

    const OrderDate = formatDate(prescription.orderDate || "");
    const OrderRelative = formatRelativeTime(prescription.orderDate || "");
    const ReviewedDate = formatDate(prescription.generatedAt);
    const ReviewedRelative = formatRelativeTime(prescription.generatedAt);

    return (
        <TableRow>
            {/* ID Column */}
            <td className="px-5 py-3.5 align-middle text-center">
                <CopyableCell
                    text={prescription.id || "N/A"}
                    subText={`Order: ${prescription.shopifyOrderId}`}
                    href={`/orders/view/${prescription.shopifyOrderId}`}
                />
            </td>

            {/* Customer ID Column */}
            <td className="px-5 py-3.5 align-middle text-center">
                <CopyableCell
                    text={prescription.customerId || "N/A"}
                />
            </td>

            {/* Order Date */}
            <td className="px-5 py-3.5 align-middle text-center">
                <div className="flex flex-col items-center justify-center leading-tight">
                    <span className="text-[#003B73] font-bold text-[14px] tabular-nums">{OrderDate}</span>
                    {OrderRelative && <span className="text-slate-400 font-medium text-[11px] mt-0.5">{OrderRelative}</span>}
                </div>
            </td>

            {/* Reg No */}
            <td className="px-5 py-3.5 align-middle text-center">
                {regNo ? (
                    <Badge variant="primary">
                        {regNo}
                    </Badge>
                ) : (
                    <Badge variant="muted">
                        N/A
                    </Badge>
                )}
            </td>

            {/* Reviewed By */}
            <td className="px-5 py-3.5 align-middle text-center">
                <div className="flex flex-col items-center justify-center leading-tight">
                    <span className="text-[14px] font-bold text-slate-900 tracking-tight">{prescription.pharmacistName || "N/A"}</span>
                    <span className="text-[11px] font-medium text-slate-400 mt-1">{prescription.pharmacistEmail || "N/A"}</span>
                </div>
            </td>

            {/* Reviewed Date */}
            <td className="px-5 py-3.5 align-middle text-center">
                <div className="flex flex-col items-center justify-center leading-tight">
                    <span className="text-[#003B73] font-bold text-[14px] tabular-nums">{ReviewedDate}</span>
                    {ReviewedRelative && <span className="text-slate-400 font-medium text-[11px] mt-0.5">{ReviewedRelative}</span>}
                </div>
            </td>

            {/* Actions */}
            <td className="px-5 py-3.5 align-middle text-center">
                <div className="flex items-center justify-center">
                    <PrescriptionActionButtons
                        shopifyOrderId={prescription.shopifyOrderId}
                        prescriptionPdf={prescription.prescriptionPdf}
                    />
                </div>
            </td>
        </TableRow>
    );
}


