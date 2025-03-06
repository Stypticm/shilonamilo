import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SearchProvider } from '../components/SearchContext';
import { QueryProvider } from '@/components/QueryProvider';

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
        <QueryProvider>
          {/* Checking fps on your app */}
          {/* <Script src="https://uppkg.com/react-scan/dist/auto.global.js" /> */}
          <SearchProvider>
            <section className="bg-gray-700 text-white flex flex-row justify-between overflow-auto w-full h-screen">
              <Navbar className="w-48 flex-shrink-0"/>
              <section className="m-2 bg-slate-400 rounded-md text-slate-900 flex-1 overflow-auto">
                {children}
              </section>
              <Toaster />
            </section>
            {authModal}
          </SearchProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
