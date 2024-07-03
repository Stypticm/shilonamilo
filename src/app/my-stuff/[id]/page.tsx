'use client'

import { getMyStuff } from '@/lib/features/myStuff'
import { Thing } from '@/lib/interfaces'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import NoItems from '@/app/components/NoItems'
import Card from '@/app/components/Card'
import { User as CurrentUser } from '@/lib/interfaces'
import { initAuthState } from '@/lib/firebase/auth/authInitialState'

const MyStuffRoute = ({ params }: { params: { id: string } }) => {
    const router = useRouter()

    const [user, setUser] = useState<CurrentUser | null>(null);
  
    useEffect(() => {
      const unsubscribe = initAuthState(setUser);
      return () => unsubscribe();
    }, []);
    
    const memoizedUser = useMemo(() => user, [user]);

    const [myStuff, setMyStuff] = useState<Thing[]>([])

    useEffect(() => {
        const fetchMyStuff = async () => {
            try {
                const data = await getMyStuff(params.id)
                setMyStuff(data)
            } catch (error) {
                console.error('Failed to fetch my stuff:', error)
            }
        }
        fetchMyStuff()
    }, [])

    const handleClick = (id: string) => {
        router.push(`/thing/${id}`)
    }

    return (
        <>
            <section className='w-[95%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center align-items-center'>
                {myStuff.length > 0 && myStuff.map(thing => (
                    <Card key={thing.id} userId={memoizedUser?.uid} {...thing} handleClick={handleClick}/>
                ))}
            </section>

            <section className='w-[95%] h-full'>
                {myStuff.length === 0 && (
                    <NoItems
                        description='Please add a new thing to see them here...'
                        name='Hey you dont have any stuff in your list'
                    />
                )}
            </section>
        </>
    )
}

export default MyStuffRoute