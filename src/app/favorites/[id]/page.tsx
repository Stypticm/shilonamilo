'use client'

import NoItems from '@/app/components/NoItems'
import Card from '@/app/components/Card'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getFavorites } from '@/lib/currentData'
import useAuth from '@/lib/hooks/useAuth'

const FavoriteRoute = ({ params }: { params: { id: string } }) => {

    const router = useRouter()

    const [favorites, setFavorites] = useState<any[]>([])
    const currentUser = useAuth()

    const fetchFavorites = async () => {
        try {
            const data = await getFavorites(params.id as string)
            setFavorites(data)
        } catch (error) {
            console.error('Failed to fetch favorites:', error)
        }
    }

    useEffect(() => {
        fetchFavorites()
    }, [favorites.length])

    const updateFavorites = () => {
        fetchFavorites()
    }

    const handleClick = (id: string) => {
        router.push(`/lot/${id}`)
    }

    return (
        <>
            <section className='w-[95%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center align-items-center'>
                {favorites.length > 0 && favorites.map(item => (
                    <Card
                        key={item.id}
                        id={item.Thing?.id as string}
                        name={item.Thing?.name as string}
                        country={item.Thing?.country as string}
                        city={item.Thing?.city as string}
                        photolot={item.Thing?.photothing as string}
                        handleClick={handleClick}
                        userId={currentUser?.uid as string}
                        isInFavoriteList={!!item.Thing?.Favorite.length}
                        lotId={item.thingId as string}
                        favoriteId={item.id as string}
                        pathName={`/favorites/${currentUser?.uid as string}`}
                        updateFavorites={updateFavorites}
                    />
                ))}
            </section>

            <section className='w-[95%] h-full'>
                {favorites.length === 0 && (
                    <>
                        <NoItems
                            name='Hey you dont have any favorites lots in your list'
                            description='Please add a new lot to see them here...'
                        />
                    </>
                )}
            </section>
        </>
    )
}

export default FavoriteRoute