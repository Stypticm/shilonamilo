import Link from 'next/link';
import React from 'react';
import Title from './Title';
import Menu from './Menu';
import SearchComponent from './SearchComponent';
import { GiCardExchange } from "react-icons/gi";

const Navbar = () => {
  return (
    <section className="flex flex-col items-center justify-between font-medium bg-gray-700 text-white">
      <aside>
        <Link href="/" className="flex items-center justify-around text-2xl font-bold m-5">
          <GiCardExchange />
          <span className="text-nowrap italic">QPQ</span>
        </Link>
        <SearchComponent />
      </aside>
      <section className="mb-5">
        <Menu />
      </section>
    </section>
  );
};

export default Navbar;
