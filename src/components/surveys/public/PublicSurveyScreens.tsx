import React from 'react';
import { Loader2, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface MessageScreenProps {
    icon: React.ReactNode;
    title: string;
    body: string;
    color?: 'teal' | 'amber' | 'red' | 'slate';
}

export function MessageScreen({ icon, title, body, color = 'teal' }: MessageScreenProps) {
    const bg: Record<string, string> = {
        teal: 'bg-teal-50 border-teal-200',
        amber: 'bg-amber-50 border-amber-200',
        red: 'bg-red-50 border-red-200',
        slate: 'bg-slate-50 border-slate-200',
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className={`max-w-sm w-full rounded-2xl border p-8 text-center shadow-sm ${bg[color]}`}>
                <div className="flex justify-center mb-4">{icon}</div>
                <h1 className="text-xl font-bold text-slate-800 mb-2">{title}</h1>
                <p className="text-sm text-slate-600">{body}</p>
            </div>
        </div>
    );
}

export function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
        </div>
    );
}

export function CompletedScreen() {
    return (
        <MessageScreen
            icon={<CheckCircle2 className="w-14 h-14 text-teal-500" />}
            title="Thank you!"
            body="Your response has been recorded. You may close this page."
            color="teal"
        />
    );
}

export function AlreadySubmittedScreen() {
    return (
        <MessageScreen
            icon={<CheckCircle2 className="w-14 h-14 text-slate-400" />}
            title="Already submitted"
            body="You have already completed this survey. Thank you for your response."
            color="slate"
        />
    );
}

export function ExpiredScreen() {
    return (
        <MessageScreen
            icon={<Clock className="w-14 h-14 text-amber-500" />}
            title="Survey link expired"
            body="This survey link has expired. Please contact your healthcare provider for a new link."
            color="amber"
        />
    );
}

export function ErrorScreen() {
    return (
        <MessageScreen
            icon={<AlertTriangle className="w-14 h-14 text-red-500" />}
            title="Link not found"
            body="This survey link is invalid or has been removed. Please check the link and try again."
            color="red"
        />
    );
}
