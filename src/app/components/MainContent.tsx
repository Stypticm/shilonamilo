'use client'

import { getAllThings } from '@/lib/currentData'
import { Thing } from '@/lib/interfaces'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import Card from './Card'
import { User as CurrentUser } from '@/lib/interfaces'
import { initAuthState } from '@/lib/firebase/auth/authInitialState'

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

  return (
    <div className='w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center align-items-center'>
      {
        allThings.map(thing => (
          <Card
            id={thing.id}
            key={thing.id}
            userId={memoizedUser?.uid}
            handleClick={handleClick}
            description={thing.description}
            city={thing.city}
            country={thing.country}
            name={thing.name}
            photothing={thing.photothing}
            isInFavoriteList={!!thing.Favorite?.length}
            thingId={thing.id}
            favoriteId={thing.Favorite?.[0]?.id}
            pathName='/'
          />
        ))
      }
    </div>
  )
}

export default MainContent