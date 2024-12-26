'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Star } from 'lucide-react';
import React from 'react';
import { useFormStatus } from 'react-dom';

export const CreationSubmit = () => {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled size="lg">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button type="submit" variant="secondary" size="lg">
          Next
        </Button>
      )}
    </>
  );
};

export const AddToFavoriteButton = () => {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button variant="outline" size="icon" className="bg-slate-400" disabled>
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="bg-slate-400 hover:bg-yellow-400"
          type="submit"
        >
          <Star className="w-6 h-6" />
        </Button>
      )}
    </>
  );
};

export const DeleteFromFavoriteButton = () => {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button variant="outline" size="icon" className="bg-slate-400" disabled>
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="bg-yellow-400 hover:bg-slate-400"
          type="submit"
        >
          <Star className="w-6 h-6" />
        </Button>
      )}
    </>
  );
};

export const EditSubmit = () => {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled size="lg">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button type="submit" variant="secondary" size="lg">
          Save
        </Button>
      )}
    </>
  );
};
