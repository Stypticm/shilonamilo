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
        <Navbar />
        {authModal}
        <> {children} </>
        <Toaster />
      </body>
    </html>
  );
}
