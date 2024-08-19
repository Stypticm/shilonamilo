'use client'

import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllLots } from '@/lib/currentData'
import { Lot } from '@/lib/interfaces'
import { User as CurrentUser } from '@/lib/interfaces'
import { initAuthState } from '@/lib/firebase/auth/authInitialState'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format, formatDate } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton'

const MainContent = () => {
  const router = useRouter()

  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const memoizedUser = useMemo(() => user, [user]);

  const [allLots, setAllLots] = useState<Lot[]>([])

  const fetchLots = async () => {
    try {
      const lots = await getAllLots(memoizedUser?.uid)
      setAllLots(lots as Lot[])
    } catch (error) {
      console.error('Failed to fetch lots:', error)
    }
  }

  useEffect(() => {
    fetchLots()
  }, [memoizedUser])

  const handleClick = (id: string) => {
    router.push(`/lot/${id}`)
  }

  // grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center align-items-center

  if (!allLots) {
    return (
      <TableBody>
        <TableRow>
          <TableCell className='text-center text-slate-900 font-bold'><Skeleton className='w-full h-full' /></TableCell>
          <TableCell className='text-center text-slate-900 font-bold'><Skeleton className='w-full h-full' /></TableCell>
          <TableCell className='text-center text-slate-900 font-bold'><Skeleton className='w-full h-full' /></TableCell>
          <TableCell className='text-center text-slate-900 font-bold'><Skeleton className='w-full h-full' /></TableCell>
          <TableCell className='text-center text-slate-900 font-bold'><Skeleton className='w-full h-full' /></TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <div className='w-full h-full'>
      <Table className='w-[95%] h-full mx-auto'>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center text-slate-900 font-bold'>Lot</TableHead>
            <TableHead className='text-center text-slate-900 font-bold'>Category</TableHead>
            <TableHead className='text-center text-slate-900 font-bold'>Possible variant for change</TableHead>
            <TableHead className='text-center text-slate-900 font-bold'>Country</TableHead>
            <TableHead className='text-center text-slate-900 font-bold'>City</TableHead>
            <TableHead className='text-center text-slate-900 font-bold'>Created at</TableHead>
          </TableRow>
        </TableHeader>
        <Suspense fallback={<div>Loading...</div>}>
          <TableBody>
            {
              allLots.map((lot: Lot) => (
                <TableRow key={lot.id} onClick={() => handleClick(lot.id)} className='cursor-pointer'>
                  <TableCell className='text-center capitalize'>{lot.name}</TableCell>
                  <TableCell className='text-center capitalize'>{lot.category}</TableCell>
                  <TableCell className='text-center capitalize'>{lot.exchangeOffer}</TableCell>
                  <TableCell className='text-center capitalize'>{lot.country}</TableCell>
                  <TableCell className='text-center capitalize'>{lot.city}</TableCell>
                  <TableCell className='text-center'>
                    {lot.createdAt ? format(new Date(lot.createdAt), 'dd/MM/yyyy') : ''}
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Suspense>
      </Table>
    </div>
  )
}

export default MainContent