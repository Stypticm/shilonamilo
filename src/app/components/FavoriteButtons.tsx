import { ICard } from '@/lib/interfaces';
import React, { useState } from 'react';
import { AddToFavoriteButton, DeleteFromFavoriteButton } from './SubmitButtons';
import { addToFavorite, removeFromFavorite } from '../actions';

const FavoriteButtons = ({
  id,
  userId,
  isInFavoriteList,
  favoriteId,
  pathName,
  updateFavorites,
}: ICard) => {
  const [isFavorite, setIsFavorite] = useState(isInFavoriteList);

  const handleAddToFavorite = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('lotId', id);
    formData.append('userId', userId as string);
    formData.append('pathName', pathName as string);

    try {
      await addToFavorite(formData);
      setIsFavorite(true);
      if (updateFavorites) updateFavorites();
    } catch (error) {
      console.error('Failed to add to favorite:', error);
    }
  };

  const handleRemoveFromFavorite = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('lotId', id);
    formData.append('userId', userId as string);
    formData.append('pathName', pathName as string);

    try {
      await removeFromFavorite(formData);
      setIsFavorite(false);
      if (updateFavorites) updateFavorites();
    } catch (error) {
      console.error('Failed to remove from favorite:', error);
    }
  };

  return (
    <section className="rounded-lgr releative flex flex-col cursor-pointer ml-10" key={id}>
      <div className="relative h-72">
        {userId && (
          <div className="z-10 absolute top-1 right-1">
            {isFavorite ? (
              <form onSubmit={handleRemoveFromFavorite}>
                <input type="hidden" name="lotId" value={id} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="pathName" value={pathName} />
                <DeleteFromFavoriteButton />
              </form>
            ) : (
              <form onSubmit={handleAddToFavorite}>
                <input type="hidden" name="lotId" value={id} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="pathName" value={pathName} />
                <AddToFavoriteButton />
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FavoriteButtons;
