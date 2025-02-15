'use client';

import Link from 'next/link';
import React from 'react';
import Menu from './Menu';
import SearchComponent from './SearchComponent';
import { GiCardExchange } from 'react-icons/gi';
import { useSearch } from './SearchContext';

const Navbar = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <section className="flex flex-col items-center justify-between font-medium bg-gray-700 text-white">
      <aside>
        <Link href="/" className="flex items-center justify-around text-2xl font-bold m-5">
          <GiCardExchange />
          <span className="relative bg-gradient-to-r from-sky-600 to-sky-900 text-transparent bg-clip-text">
            QPQ
          </span>
        </Link>
        <SearchComponent value={searchQuery} onSearchChange={setSearchQuery} />
      </aside>
      <section className="mb-5">
        <Menu />
      </section>
    </section>
  );
};

export default Navbar;
