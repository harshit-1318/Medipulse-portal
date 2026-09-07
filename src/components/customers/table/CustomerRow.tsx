import { useState } from 'react';
import { Eye, FileText, ShieldCheck } from 'lucide-react';
import type { Customer } from '../../../types/customer';
import { SendSurveyModal } from '@/components/surveys';
import { TableRow, Badge, ActionButton } from '@/components/common/table/TableUI';
import { formatDate, formatRelativeTime } from './customerDateUtils';

interface Props {
    customer: Customer;
}

export default function CustomerRow({ customer }: Props) {
    const [showSurveyModal, setShowSurveyModal] = useState(false);

    const createdDate = formatDate(customer.createdAt);
    const createdRelative = formatRelativeTime(customer.createdAt);

    return (
        <TableRow>
            <td className="px-5 py-3.5 align-middle text-center">
                <div className="flex flex-col items-center justify-center leading-tight">
                    <span className="text-[14px] font-bold text-slate-900 tracking-tight">
                        {customer.name}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 mt-1">
                        {customer.email}
                    </span>
                </div>
            </td>

            <td className="px-5 py-3.5 align-middle text-center">
                <div className="flex items-center justify-center">
                    <Badge variant="muted">
                        {customer.customerId}
                    </Badge>
                </div>
            </td>

            <td className="px-5 py-3.5 align-middle text-center">
                <div className="flex items-center justify-center">
                    <Badge variant="success" icon={ShieldCheck}>
                        {customer.totalPens} Pens
                    </Badge>
                </div>
            </td>

            <td className="px-5 py-3.5 align-middle text-center">
                <div className="flex flex-col items-center justify-center leading-tight">
                    <span className="text-[#003B73] font-bold text-[14px] tabular-nums">
                        {createdDate}
                    </span>
                    {createdRelative && (
                        <span className="text-slate-400 font-medium text-[11px] mt-0.5">
                            {createdRelative}
                        </span>
                    )}
                </div>
            </td>

            <td className="px-5 py-3.5 align-middle text-center">
                <div className="flex items-center justify-center gap-3">
                    <ActionButton
                        href={`/orders/all?customer=${customer.customerId}`}
                        icon={Eye}
                        label="VIEW"
                        variant="cyan"
                        title="View Orders"
                    />
                    <ActionButton
                        onClick={() => setShowSurveyModal(true)}
                        icon={FileText}
                        label="PDF"
                        variant="slate"
                        title="Send Survey (PDF Style)"
                    />
                </div>
            </td>

            {showSurveyModal && (
                <SendSurveyModal
                    customerId={customer.customerId}
                    onClose={() => setShowSurveyModal(false)}
                />
            )}
        </TableRow>
    );
}
