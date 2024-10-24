'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllLots } from '@/lib/currentData';
import { ILot } from '@/lib/interfaces';
import { User as CurrentUser } from '@/lib/interfaces';
import { initAuthState } from '@/lib/firebase/auth/authInitialState';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const MainContent = () => {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [allLots, setAllLots] = useState<ILot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const memoizedUser = useMemo(() => user, [user]);

  const fetchLots = async (userId: string) => {
    try {
      const lots = await getAllLots(userId);
      setAllLots(lots as ILot[]);
    } catch (error) {
      console.error('Failed to fetch lots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (memoizedUser) {
      fetchLots(memoizedUser?.uid as string);
    } else {
      fetchLots('');
    }
  }, [memoizedUser]);

  const handleClick = (id: string) => {
    router.push(`/lot/${id}`);
  };

  // grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center align-items-center

  return (
    <div className="w-full h-full">
      <Table className="w-[95%] h-full mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center text-slate-900 font-bold">Lot</TableHead>
            <TableHead className="text-center text-slate-900 font-bold">Category</TableHead>
            <TableHead className="text-center text-slate-900 font-bold">
              Possible variant for change
            </TableHead>
            <TableHead className="text-center text-slate-900 font-bold">Country</TableHead>
            <TableHead className="text-center text-slate-900 font-bold">City</TableHead>
            <TableHead className="text-center text-slate-900 font-bold">Created at</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TableBody>
            <TableRow>
              <TableCell className="text-center">
                <Skeleton className="w-full h-8" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="w-full h-8" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="w-full h-8" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="w-full h-8" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="w-full h-8" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="w-full h-8" />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {allLots.map((lot: ILot) => (
              <TableRow key={lot.id} onClick={() => handleClick(lot.id)} className="cursor-pointer">
                <TableCell className="text-center capitalize">{lot.name}</TableCell>
                <TableCell className="text-center capitalize">{lot.category}</TableCell>
                <TableCell className="text-center capitalize">{lot.exchangeOffer}</TableCell>
                <TableCell className="text-center capitalize">{lot.country}</TableCell>
                <TableCell className="text-center capitalize">{lot.city}</TableCell>
                <TableCell className="text-center">
                  {lot.createdAt ? format(new Date(lot.createdAt), 'dd/MM/yyyy') : ''}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default MainContent;
