'use client';

import Link from 'next/link';
import React from 'react';
import Menu from './Menu';
import SearchComponent from './SearchComponent';
import { GiCardExchange } from 'react-icons/gi';
import { useSearch } from './SearchContext';

const Navbar = ({ className }: { className: string }) => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <section className={`${className} relative font-medium bg-gray-700 text-white`}>
      <section className='flex flex-col justify-between h-full'>
        <aside>
          <Link href="/" className="flex items-center justify-around text-2xl font-bold m-5">
            <GiCardExchange />
            <span className="relative bg-gradient-to-r from-sky-600 to-sky-900 text-transparent bg-clip-text">
              QPQ
            </span>
          </Link>
          <SearchComponent value={searchQuery} onSearchChange={setSearchQuery} />
        </aside>
        <Menu />
      </section>
    </section>
  );
};

export default Navbar;
