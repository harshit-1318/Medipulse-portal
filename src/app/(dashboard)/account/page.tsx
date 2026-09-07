'use client';

import AccountSettings from '@/components/account/AccountSettings';

export default function AccountPageRoute() {
  return (
    <div className="max-w-6xl mx-auto py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Account</h1>
        <p className="text-slate-500 mt-1 font-medium">Manage your profile information and account security</p>
      </div>

      <AccountSettings />
    </div>
  );
}
