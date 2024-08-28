'use client'

import NoItems from '@/app/components/NoItems'
import Card from '@/app/components/Card'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getFavorites } from '@/lib/currentData'
import { ICard, ICardFavorite, ILot } from '@/lib/interfaces'

const FavoriteRoute = ({ params }: { params: { id: string } }) => {

    const router = useRouter()

    const [favorites, setFavorites] = useState<ICard[]>([])

    const mapFavoritesToCards = (favorites: ICardFavorite[]): ILot[] => {
        return favorites.map(favorite => ({
            id: favorite.Lot.id,
            userId: favorite.userId,
            name: favorite.Lot.name,
            description: favorite.Lot.description,
            country: favorite.Lot.country,
            city: favorite.Lot.city,
            photolot: favorite.Lot.photolot,
            isInFavoriteList: true,
            favoriteId: favorite.id,
            lotId: favorite.lotId,
            pathName: `/favorites/${favorite.userId}`,
            updateFavorites: fetchFavorites,
            handleClick: handleClick
        }))
    }

    const fetchFavorites = async () => {
        try {
            const data = await getFavorites(params.id as string)
            const mappedData = mapFavoritesToCards(data as ICardFavorite[])
            setFavorites(mappedData)
        } catch (error) {
            console.error('Failed to fetch favorites:', error)
        }
    }

    useEffect(() => {
        fetchFavorites()
    }, [favorites.length])

    const handleClick = (id: string) => {
        router.push(`/favorites/${params.id}`)
    }

    return (
        <>
            <section className='w-[95%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center align-items-center'>
                {favorites.length > 0 && favorites.map(item => (
                    <Card
                        key={item.id}
                        {...item}
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