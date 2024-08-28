import { ICard } from '@/lib/interfaces'
import React, { useState } from 'react'
import Image from 'next/image'
import { AddToFavoriteButton, DeleteFromFavoriteButton } from './SubmitButtons'
import { addToFavorite, removeFromFavorite } from '../actions'
import FavoriteButtons from './FavoriteButtons'

const Card = ({
    id,
    name,
    country,
    city,
    userId,
    isInFavoriteList,
    favoriteId,
    pathName,
    photolot,
    updateFavorites,
    handleClick
}: ICard) => {

    const [isFavorite, setIsFavorite] = useState(isInFavoriteList);

    const handleClickCard = (id: string) => {
        if (handleClick) handleClick(id)
    }

    return (
        <section className=' rounded-lg releative h-80 w-72 flex flex-col cursor-pointer shadow-lg' key={id} onClick={() => handleClickCard(id)}>
            <div className='relative h-72'>
                <FavoriteButtons
                    id={id}
                    userId={userId}
                    isInFavoriteList={isFavorite}
                    favoriteId={favoriteId}
                    pathName={pathName}
                    updateFavorites={updateFavorites}
                />
                {photolot ? (<Image
                    alt={photolot as string}
                    src={photolot as string}
                    className='rounded-lg h-full object-cover'
                    fill
                    priority
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />) : null}
            </div>
            <section className='p-2'>
                <p className='text-xl font-bold'>{name}</p>
                <p className='text-lg'>{country}, {city}</p>
            </section>
        </section>
    )
}

export default Card