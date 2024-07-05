'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllThings } from '@/lib/currentData'
import { Thing } from '@/lib/interfaces'
import { User as CurrentUser } from '@/lib/interfaces'
import { initAuthState } from '@/lib/firebase/auth/authInitialState'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format, formatDate } from 'date-fns';

const MainContent = () => {
  const router = useRouter()

  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const memoizedUser = useMemo(() => user, [user]);

  const [allThings, setAllThings] = useState<Thing[]>([])

  const fetchThings = async () => {
    try {
      const things = await getAllThings(memoizedUser?.uid)
      console.log(things)
      setAllThings(things as Thing[])
    } catch (error) {
      console.error('Failed to fetch things:', error)
    }
  }

  useEffect(() => {
    fetchThings()
  }, [memoizedUser])

  const handleClick = (id: string) => {
    router.push(`/thing/${id}`)
  }

  // grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center align-items-center

  return (
    <div className='w-full h-full'>
      <Table className='w-[95%] h-full mx-auto'>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center text-slate-900 font-bold'>Lot</TableHead>
            <TableHead className='text-center text-slate-900 font-bold'>Category</TableHead>
            <TableHead className='text-center text-slate-900 font-bold'>Posible variant for change</TableHead>
            <TableHead className='text-center text-slate-900 font-bold'>Country</TableHead>
            <TableHead className='text-center text-slate-900 font-bold'>City</TableHead>
            <TableHead className='text-center text-slate-900 font-bold'>Created at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {

            allThings.map((thing: Thing) => (
              <TableRow key={thing.id} onClick={() => handleClick(thing.id)} className='cursor-pointer'>
                <TableCell className='text-center capitalize'>{thing.name}</TableCell>
                <TableCell className='text-center capitalize'>{thing.category}</TableCell>
                <TableCell className='text-center capitalize'>{thing.youneed}</TableCell>
                <TableCell className='text-center capitalize'>{thing.country}</TableCell>
                <TableCell className='text-center capitalize'>{thing.city}</TableCell>
                <TableCell className='text-center'>
                  {thing.createdat ? format(new Date(thing.createdat), 'dd/MM/yyyy') : ''}
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default MainContent