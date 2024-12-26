'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllLots } from '@/lib/currentData';
import { ILot } from '@/lib/interfaces';
import { User as CurrentUser } from '@/lib/interfaces';
import { initAuthState } from '@/lib/firebase/auth/authInitialState';
import { Skeleton } from '@/components/ui/skeleton';
import Title from './Title';

import './styles/mainContent.css';

const MainContent = () => {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [allLots, setAllLots] = useState<ILot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const fetchLots = useCallback(
    async (userId: string) => {
      try {
        const lots = await getAllLots(userId);
        const corretedLots = lots.map((item: ILot) => ({
          id: item.id,
          name: item.name,
          description:
            item.description?.length && item.description?.length > 20
              ? item.description?.substring(0, 20) + '...'
              : item.description,
          location: item.city + ', ' + item.country,
          category: item.category
        }))
        setAllLots(corretedLots as ILot[]);
      } catch (error) {
        console.error('Failed to fetch lots:', error);
      } finally {
        setIsLoading(false);
      }
    }, [])

  useEffect(() => {
    if (user) {
      fetchLots(user.uid as string);
    } else {
      fetchLots('');
    }
  }, [user, fetchLots]);

  const handleClick = (id: string) => {
    router.push(`/lot/${id}`);
  };

  return (
    <div className="w-full h-full">
      <Title />
      <section>
        <header className="h-full mx-auto header_table">
          <div className="col-span-1">ID</div>
          <div className="col-span-1">Name</div>
          <div className="col-span-1 hidden sm:block">Description</div>
          <div className="col-span-1 hidden md:block">Location</div>
          <div className="col-span-1 hidden lg:block">Category</div>
        </header>

        {allLots.map((lot: ILot, index) => (
          <main key={lot.id} onClick={() => handleClick(lot.id)} className="cursor-pointer hover:bg-slate-200 header_body">
            <div className="text-center">{index + 1}</div>
            <div className="text-center capitalize">{lot.name}</div>
            <div className="text-center hidden sm:block">{lot.description}</div>
            <div className="text-center hidden md:block">
              {lot.location}
            </div>
            <div className="text-center hidden lg:block">{lot.category}</div>
          </main>
        ))}
      </section>
    </div >
  );
};

export default MainContent;
