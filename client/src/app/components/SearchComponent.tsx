'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchComponent = () => {
  return (
    <section className="w-11/12 mx-auto">
      <Input
        type="text"
        name="lot"
        placeholder="Search"
        className="rounded-full"
        startIcon={Search}
      />
    </section>
  );
};

export default SearchComponent;
