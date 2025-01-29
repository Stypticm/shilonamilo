import CreationButtonBar from '@/components/CreationButtonBar';
import React from 'react';

const LayoutCreation = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-grow mt-10">{children}</main>
      <footer className="mt-auto">
        <CreationButtonBar />
      </footer>
    </div>
  );
};

export default LayoutCreation;
