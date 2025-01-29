'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { EditSubmit } from './SubmitButtons';

const SaveButtonBar = ({ setIsEditing }: { setIsEditing: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div className="flex items-center justify-around mx-auto px-5 lg:px-10 h-full w-full">
      <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
      <EditSubmit />
    </div>
  );
};

export default SaveButtonBar;
