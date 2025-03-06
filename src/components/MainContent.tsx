'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ILot } from '@/lib/interfaces';
import { User as CurrentUser } from '@/lib/interfaces';
import { initAuthState } from '@/lib/firebase/auth/authInitialState';
import { Skeleton } from '@/components/ui/skeleton';
import Title from './Title';
import { useSearch } from './SearchContext';

import './styles/mainContent.css';
import FilterMenu from './FilterMenu';
import { useLots } from '@/lib/features/repositories/queries/lotsQueries';

const MainContent = ({ initialLots }: { initialLots: ILot[] }) => {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const { searchQuery } = useSearch();

  const { data: allLots = [], isLoading } = useLots(user?.uid, searchQuery, initialLots);

  const [choosedCategory, setChoosedCategory] = useState('All');

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const handleClick = (id: string) => {
    router.push(`/lot/${id}`);
  };

  const filteredLots = useMemo(() => {
    if (choosedCategory === 'All') {
      return allLots;
    }
    return allLots?.filter((lot: ILot) => lot.category === choosedCategory);
  }, [choosedCategory, allLots]);

  if (!user) {
    return (
      <div className="w-full h-full px-16">
        <Title />
        <section>
          <header className="h-full mx-auto header_table">
            <div className="col-span-1">ID</div>
            <div className="col-span-1">Category</div>
            <div className="col-span-1 hidden sm:block">Name</div>
            <div className="col-span-1 hidden md:block">Description</div>
            <div className="col-span-1 hidden lg:block">Location</div>
          </header>
          {
            !isLoading ? (
              allLots?.map((lot: ILot, index) => (
                <main
                  key={lot.id}
                  onClick={() => handleClick(lot.id)}
                  className="cursor-pointer hover:bg-slate-200 header_body"
                >
                  <div className="text-center">{index + 1}</div>
                  <div className="text-center ">{lot.category}</div>
                  <div className="text-center hidden sm:block capitalize">{lot.name}</div>
                  <div className="text-center hidden md:block">{lot.description}</div>
                  <div className="text-center hidden lg:block">{lot.location}</div>
                </main>
              ))
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <Skeleton className="h-4 w-[200px] bg-slate-400" />
              </div>
            )
          }
        </section>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-16">
      <Title />
      <section>
        <header className="h-full mx-auto header_table flex items-center">
          <div className="col-span-1">ID</div>
          <div className="col-span-1 flex justify-center items-center gap-1">
            <FilterMenu
              lots={filteredLots}
              setChoosedCategory={setChoosedCategory}
              choosedCategory={choosedCategory}
            />
            Category
          </div>
          <div className="col-span-1 hidden sm:block">Name</div>
          <div className="col-span-1 hidden md:block">Description</div>
          <div className="col-span-1 hidden lg:block">Location</div>
        </header>

        {isLoading ? (
          <Skeleton />
        ) : (
          filteredLots?.length > 0 ? (
            filteredLots?.map((lot: ILot, index) => (
              <main
                key={lot.id}
                onClick={() => handleClick(lot.id)}
                className="cursor-pointer hover:bg-slate-200 header_body"
              >
                <div className="text-center">{index + 1}</div>
                <div className="text-center ">{lot.category}</div>
                <div className="text-center hidden sm:block capitalize">{lot.name}</div>
                <div className="text-center hidden md:block">{lot.description}</div>
                <div className="text-center hidden lg:block">{lot.location}</div>
              </main>
            ))
          ) : (
            <p className="text-center mt-4">No results found.</p>
          )
        )}
      </section>
    </div>
  );
};

export default MainContent;
