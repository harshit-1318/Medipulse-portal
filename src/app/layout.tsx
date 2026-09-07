import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import QueryProvider from '@/components/providers/QueryProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'MediPulse — Healthcare Admin Portal',
    template: '%s | MediPulse',
  },
  description: 'Enterprise healthcare admin portal for orders, prescriptions, surveys, customers, and multi-tenant management.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50 text-slate-900 antialiased">
      <body className="h-full font-sans selection:bg-indigo-500 selection:text-white">
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0f172a',
                color: '#fff',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
