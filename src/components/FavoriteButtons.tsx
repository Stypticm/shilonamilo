import React, { useState } from 'react';
import { AddToFavoriteButton, DeleteFromFavoriteButton } from './SubmitButtons';
import { handleFavoriteToggle } from '@/lib/hooks/useFavorites';
import { ICard } from '@/lib/interfaces';

const FavoriteButtons = ({ id, userId, isInFavoriteList, pathName, updateFavorites }: ICard) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(isInFavoriteList ?? false);

  const handleFavoriteClick = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsFavorite((prev) => !prev);

    if (updateFavorites) {
      await handleFavoriteToggle(isFavorite, id, userId as string, pathName as string, setIsFavorite, updateFavorites);
    }
  }

  return (
    <section className="rounded-lgr releative flex flex-col cursor-pointer ml-10" key={id}>
      <div className="relative h-72">
        {userId && (
          <div className="z-10 absolute top-1 right-1">
            <form onSubmit={handleFavoriteClick}>
              {isFavorite ? (
                <>
                  <input type="hidden" name="lotId" value={id} />
                  <input type="hidden" name="userId" value={userId} />
                  <input type="hidden" name="pathName" value={pathName} />
                  <DeleteFromFavoriteButton />
                </>
              ) : (
                <>
                  <input type="hidden" name="lotId" value={id} />
                  <input type="hidden" name="userId" value={userId} />
                  <input type="hidden" name="pathName" value={pathName} />
                  <AddToFavoriteButton />
                </>
              )}
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default FavoriteButtons;
