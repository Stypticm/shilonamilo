'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchComponent = () => {
  return (
    <>
      <div className="w-2/4 mx-auto  flex justify-center items-center mb-5">
        <Input
          type="text"
          name="lot"
          placeholder="Search"
          className="rounded-full"
          startIcon={Search}
        />
      </div>
    </>
  );
};

export default SearchComponent;
