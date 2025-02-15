import { ICard } from '@/lib/interfaces';
import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import FavoriteButtons from './FavoriteButtons';

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
  handleClick,
}: ICard) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFavorite, setIsFavorite] = useState(isInFavoriteList);

  const handleClickCard = (id: string) => {
    setIsFavorite((prev) => !prev);
    if (handleClick) handleClick(id);
  };

  const memoizedPhoto = useMemo(() => {
    if (!photolot) return null;
    return (
      <Image
        alt={photolot as string}
        src={photolot as string}
        className="rounded-lg h-full object-cover"
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    )
  }, [photolot])

  return (
    <section
      className=" rounded-lg releative h-80 w-72 flex flex-col cursor-pointer shadow-lg"
      key={id}
      onClick={() => handleClickCard(id)}
    >
      <div className="relative h-72">
        <FavoriteButtons
          id={id}
          userId={userId}
          isInFavoriteList={isInFavoriteList}
          favoriteId={favoriteId}
          pathName={pathName}
          updateFavorites={updateFavorites}
        />
        {memoizedPhoto}
      </div>
      <section className="p-2">
        <p className="text-xl font-bold">{name}</p>
        <p className="text-lg">
          {country}, {city}
        </p>
      </section>
    </section>
  );
};

export default Card;
