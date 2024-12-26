import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quid pro quo',
  description: 'Created by Spirin and Volodin',
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn('bg-[#4A5C6A]', inter.className)}>
        <section className="bg-gray-700 text-white flex justify-between overflow-auto w-full h-screen">
          <Navbar />
          <section className="p-4 m-2 bg-slate-400 rounded-md w-full text-slate-900">
            {children}
            <Toaster />
          </section>
        </section>
        {authModal}
      </body>
    </html>
  );
}
