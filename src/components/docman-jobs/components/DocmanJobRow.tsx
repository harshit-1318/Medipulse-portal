import { FileText } from 'lucide-react';
import type { DocmanJobType } from '../types';
import JobStatusBadge from './JobStatusBadge';
import { DocmanJobActions } from './DocmanJobActions';
import { formatJobDate } from '../utils/formatJobDate';
import { ActionButton } from '@/components/common';

interface DocmanJobRowProps {
    job: DocmanJobType;
    onDelete: (id: string) => void;
}

export default function DocmanJobRow({ job, onDelete }: DocmanJobRowProps) {
    const patientName = `${job.payload?.Patient?.GivenNames || ''} ${job.payload?.Patient?.FamilyName || ''}`.trim() || 'N/A';
    const email = job.payload?.Patient?.Email || 'N/A';
    const shopifyId = job.laravel_document_id || 'N/A';
    const fileUrl = job.payload?.Document?.FileUrl;

    return (
        <tr className="group hover:bg-slate-50/60 transition-all duration-200 border-b border-slate-100 last:border-0 font-montserrat">
            <td className="py-4 px-5 align-middle min-w-36">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-slate-800 tracking-tight leading-none group-hover:text-[#00a294] transition-colors">{job._id}</span>
                    <span className="text-[11px] text-slate-400 font-semibold tracking-tight">Order ID: <span className="text-slate-500">{shopifyId}</span></span>
                </div>
            </td>

            <td className="py-4 px-5 align-middle min-w-48">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[13.5px] font-bold text-slate-800 tracking-tight leading-none">{patientName}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{email}</span>
                </div>
            </td>

            <td className="py-4 px-5 align-middle">
                <div className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-bold text-slate-700">{job.command_type}</span>
                    <div className="flex items-center gap-1.5"><JobStatusBadge status={job.status} /></div>
                </div>
            </td>

            <td className="py-4 px-5 align-middle">
                {fileUrl ? (
                    <ActionButton
                        icon={FileText}
                        label="View"
                        variant="cyan"
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-[78px] h-[32px]"
                    />
                ) : (
                    <span className="text-slate-300 font-semibold text-[11px]">NO ASSET</span>
                )}
            </td>

            <td className="py-4 px-5 align-middle">
                <span className="text-[12px] text-slate-600 font-semibold whitespace-nowrap">{formatJobDate(job.completed_at)}</span>
            </td>

            <td className="py-4 px-5 align-middle max-w-28">
                <span className="text-[11px] text-slate-400 font-medium truncate block italic">{job.lastError || '--'}</span>
            </td>

            <td className="py-4 px-5 align-middle text-center">
                <span className="text-[11px] text-slate-400 font-semibold">{job.response ? '✓ Ready' : '--'}</span>
            </td>

            <td className="py-4 px-5 align-middle max-w-24">
                <span className="text-[11px] text-slate-400 font-mono truncate block">{job.idempotencyKey || '--'}</span>
            </td>

            <td className="py-4 px-5 align-middle max-w-24">
                <span className="text-[11px] text-slate-400 font-mono truncate block">{job.workerId || '--'}</span>
            </td>

            <td className="py-4 px-5 align-middle whitespace-nowrap text-[11.5px] text-slate-500 font-medium">{formatJobDate(job.createdAt)}</td>
            <td className="py-4 px-5 align-middle whitespace-nowrap text-[11.5px] text-slate-400 font-medium">{formatJobDate(job.updatedAt)}</td>
            <td className="py-4 px-5 align-middle text-right">
                <DocmanJobActions fileUrl={fileUrl} jobId={job._id} onDelete={onDelete} />
            </td>
        </tr>
    );
}
