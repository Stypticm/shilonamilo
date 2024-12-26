'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { CreationSubmit } from './SubmitButtons';

const CreationButtonBar = () => {
  return (
    <div className="flex items-center justify-between mx-auto px-5 lg:px-10 h-full w-full">
      <Button variant="secondary" size="lg" asChild>
        <Link href="/">Cancel</Link>
      </Button>
      <CreationSubmit />
    </div>
  );
};

export default CreationButtonBar;
