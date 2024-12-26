'use client';

import React, { Suspense, use, useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { deleteLot, findLotByUserIdAndLotId } from '@/lib/features/myStuff';
import { initAuthState } from '@/lib/firebase/auth/authInitialState';
import { User as CurrentUser, ICard, ILot } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import FavoriteButtons from '@/app/components/FavoriteButtons';
import { fetchFavorites } from '@/lib/features/functions';
import TogglePhotoUrlFile from '@/app/components/TogglePhotoUrlFile';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SaveButtonBar from '@/app/components/SaveButtonBar';
import { updateLot } from '@/app/actions';
import { toast } from '@/lib/hooks/useToast';
import ReceivedProposals from '@/app/components/ReceivedProposals';
import MyLots from '@/app/components/MyLots';
import Lot from '@/app/components/Lot';

const LotRoute = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const { id } = React.use(params);

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [data, setData] = useState<ILot | null>(null);
  const [isLotBelongsToUser, setIsLotBelongsToUser] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<ICard[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [exchangeOffer, setExchangeOffer] = useState<string>('');
  const [photoLotFile, setPhotoLotFile] = useState<string | null>(null);
  const [photoLotURL, setPhotoLotURL] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const updateFavorites = () => {
    if (user) {
      fetchFavorites({ uid: user?.uid as string }, setFavorites);
    }
  };

  const handleDeleteLot = async (id: string) => {
    try {
      const deleteLotById = await deleteLot(id);

      if (deleteLotById) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error deleting lot:', error);
    }
  };

  const handleEditLot = () => {
    setIsEditing(true);
  };

  const clientAction = async (formData: FormData) => {
    formData.append('lotId', id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('exchangeOffer', exchangeOffer);

    const photoLotFile = formData.get('photoLotFile') as File;
    if (photoLotFile) {
      formData.append('photoLotFile', photoLotFile);
    }

    const photoLotURL = formData.get('photoLotURL') as string;
    if (photoLotURL) {
      formData.append('photoLotURL', photoLotURL);
    }

    const result = await updateLot(formData, id);

    if (result?.error) {
      toast({
        description: result.error,
        title: 'Error',
        variant: 'destructive',
      });
    } else if (result?.text === 'Nothing changed') {
      router.push(`/lot/${id}`);
    } else if (result?.redirect) {
      router.push(`/lot/${id}`);
    }

    setIsEditing(false);
    fetchData();
  };

  useEffect(() => {
    if (user) {
      fetchFavorites({ uid: user?.uid as string }, setFavorites);
    }
  }, [favorites.length]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/lot/${id}`);
      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          router.push('/');
          return;
        }
        throw new Error('Failed to fetch lots');
      }
      const lotData = await response.json();
      setData(lotData);
    } catch (error) {
      console.error('Error fetching lot:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  useEffect(() => {
    const checkLotOwnership = async () => {
      if (data && user) {
        const isLotBelongsToUser = await findLotByUserIdAndLotId(
          user?.uid as string,
          data?.id as string,
        );
        setIsLotBelongsToUser(isLotBelongsToUser);
      }
    };
    checkLotOwnership();
  }, [data, user]);

  if (!data) {
    return (
      <div className="w-[75%] mx-auto flex flex-wrap sm:w-[50%] sm:justify-center gap-4">
        <section className="flex flex-row gap-2">
          <Skeleton className="h-[250px] w-[250px] rounded-lg bg-slate-400" />
          <div className="flex flex-col ml-10 space-y-2">
            <Skeleton className="h-4 w-[200px] bg-slate-400" />
            <Skeleton className="h-4 w-[300px] bg-slate-400" />
            <Skeleton className="h-4 w-[300px] bg-slate-400" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <section className="w-[95%] h-[95%] flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="w-[75%] mx-auto flex flex-wrap sm:w-[50%] sm:justify-center gap-4">
          <div className="w-full flex gap-5">
            {isEditing ? (
              <form action={clientAction} className="w-full">
                <div className="w-3/5 flex flex-col mx-auto gap-4 mt-2">
                  <div className="flex justify-around gap-4 w-full">
                    <Label className="flex items-center justify-start w-2/12">Name</Label>
                    <Input
                      name="name"
                      type="text"
                      placeholder="Name of your lot"
                      defaultValue={data?.name || ''}
                      onChange={(e) => setName(e.target.value)}
                      className="flex ml-auto"
                    />
                  </div>

                  <div className="flex gap-4 w-full">
                    <Label className="flex items-center justify-start w-2/12">Description</Label>
                    <Textarea
                      name="description"
                      placeholder="Try to describe your lot, and quality"
                      defaultValue={data?.description || ''}
                      onChange={(e) => setDescription(e.target.value)}
                      className="flex ml-auto"
                    />
                  </div>

                  <div className="flex w-full gap-4">
                    <Label className="flex items-center justify-start w-2/12">Exchange</Label>
                    <Input
                      name="exchangeOffer"
                      type="text"
                      placeholder="Possible exchange offer"
                      defaultValue={data?.exchangeOffer || ''}
                      onChange={(e) => setExchangeOffer(e.target.value)}
                      className="flex ml-auto"
                    />
                  </div>
                  <div className="flex w-full gap-4">
                    {!data?.photolot ? (
                      <TogglePhotoUrlFile
                        photoLotFile={photoLotFile}
                        photoLotURL={photoLotURL}
                        setPhotoLotFile={setPhotoLotFile}
                        setPhotoLotURL={setPhotoLotURL}
                      />
                    ) : (
                      <div className="relative h-[250px] w-[250px] flex justify-center mx-auto">
                        <Image
                          alt={data.name as string}
                          src={data.photolot as string}
                          className="rounded-lg h-full object-cover"
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw,
                                                               (max-width: 1200px) 50vw,
                                                                33vw"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 mt-10">
                    <SaveButtonBar id={id as string} />
                  </div>
                </div>
              </form>
            ) : (
              <>
                <Lot data={data} />
                <FavoriteButtons
                  id={data.id}
                  userId={user?.uid}
                  isInFavoriteList={!!data.Favorite?.length}
                  favoriteId={data?.id as string}
                  pathName={`/lot/${data?.id}`}
                  updateFavorites={updateFavorites}
                />
              </>
            )}
          </div>
          {isLotBelongsToUser ? (
            <ReceivedProposals lotId={id as string} />
          ) : (
            <MyLots lotId={id as string} />
          )}
        </div>
      </Suspense>
      {isLotBelongsToUser && !isEditing && (
        <div className="fixed w-full bottom-0 z-10 bg-[#4A5C6A] border-t border-slate-800 h-24">
          <div className="flex items-center justify-between px-5 lg:px-10 h-full">
            <Button variant="secondary" size="lg" onClick={() => handleEditLot()}>
              Edit
            </Button>
            <Button variant="destructive" size="lg" onClick={() => handleDeleteLot(id)}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default LotRoute;
