'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface NavbarProps {
  value: string;
  onSearchChange: (query: string) => void;
}

const SearchComponent: React.FC<NavbarProps> = ({ value, onSearchChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <section className="w-11/12 mx-auto">
      <Input
        type="text"
        value={value}
        name="lot"
        placeholder="Search"
        className="rounded-full text-slate-900"
        startIcon={Search}
        onChange={handleChange}
      />
    </section>
  );
};

export default SearchComponent;
