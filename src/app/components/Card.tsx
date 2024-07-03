import { ICard } from '@/lib/interfaces'
import React, { useState } from 'react'
import Image from 'next/image'
import { AddToFavoriteButton, DeleteFromFavoriteButton } from './SubmitButtons'
import { addToFavorite, removeFromFavorite } from '../actions'

const Card = ({
    id,
    name,
    country,
    city,
    photothing,
    handleClick,
    userId,
    isInFavoriteList,
    favoriteId,
    pathName,
    updateFavorites
}: ICard) => {

    const [isFavorite, setIsFavorite] = useState(isInFavoriteList);

    const handleAddToFavorite = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('thingId', id);
        formData.append('userId', userId as string);
        formData.append('pathName', pathName as string);

        try {
            await addToFavorite(formData);
            setIsFavorite(true);
            if (updateFavorites) updateFavorites()
        } catch (error) {
            console.error('Failed to add to favorite:', error);
        }
    };

    const handleRemoveFromFavorite = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('favoriteId', favoriteId as string);
        formData.append('userId', userId as string);
        formData.append('pathName', pathName as string);

        try {
            await removeFromFavorite(formData);
            setIsFavorite(false);
            if (updateFavorites) updateFavorites()
        } catch (error) {
            console.error('Failed to remove from favorite:', error);
        }
    };
    
    return (
        <section className=' rounded-lg releative h-80 w-72 flex flex-col cursor-pointer' key={id}>
            <div className='relative h-72'>
                {
                    photothing ? (
                        <Image
                            src={photothing as string}
                            alt={name as string}
                            fill
                            className='rounded-lg h-full w-full object-cover'
                            onClick={() => handleClick && handleClick(id as string)}
                            priority
                        />
                    ) : null
                }
                {
                    userId && (
                        <div className='z-10 absolute top-1 right-1'>
                            {
                                isFavorite ? (
                                    <form onSubmit={handleRemoveFromFavorite}>
                                        <input type="hidden" name="favoriteId" value={favoriteId} />
                                        <input type="hidden" name="userId" value={userId} />
                                        <input type="hidden" name="pathName" value={pathName} />
                                        <DeleteFromFavoriteButton />
                                    </form>
                                ) : (
                                    <form onSubmit={handleAddToFavorite}>
                                        <input type="hidden" name="thingId" value={id} />
                                        <input type="hidden" name="userId" value={userId} />
                                        <input type="hidden" name="pathName" value={pathName} />
                                        <AddToFavoriteButton />
                                    </form>
                                )
                            }
                        </div>
                    )
                }
            </div>
            <p className='text-xl font-bold'>{name}</p>
            <p className='text-lg'>{country}, {city}</p>
        </section>
    )
}

export default Card