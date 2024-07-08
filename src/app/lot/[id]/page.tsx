'use client'

import React, { Suspense, useEffect, useMemo, useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { deleteLot, findLotByUserIdAndLotId } from '@/lib/features/myStuff';
import { initAuthState } from '@/lib/firebase/auth/authInitialState';
import { User as CurrentUser, Lot } from '@/lib/interfaces'
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import FavoriteButtons from '@/app/components/FavoriteButtons';
import { getFavorites } from '@/lib/currentData';

const LotRoute = ({ params }: { params: { id: string } }) => {
    const router = useRouter()
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [data, setData] = useState<Lot | null>(null);
    const [isLotBelongsToUser, setIsLotBelongsToUser] = useState<boolean>(false);
    const [favorites, setFavorites] = useState<any[]>([])

    useEffect(() => {
        const unsubscribe = initAuthState(setUser);
        return () => unsubscribe();
    }, []);


    const fetchFavorites = async () => {
        try {
            const data = await getFavorites(user?.uid as string)
            setFavorites(data)
        } catch (error) {
            console.error('Failed to fetch favorites:', error)
        }
    }

    const updateFavorites = () => {
        fetchFavorites()
    }

    const handleDeleteThing = async (id: string) => {
        try {
            const deleteLotById = await deleteLot(id);

            if (deleteLotById) {
                router.push('/');
            }
        } catch (error) {
            console.error('Error deleting lot:', error);
        }
    }

    const handleEditThing = async (id: string) => {
        router.push(`/lot/${id}/edit`);
    }

    useEffect(() => {
        fetchFavorites()
    }, [favorites.length])


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/lot/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch lots');
                }
                const lotData = await response.json();
                setData(lotData);

                if (data && user) {
                    const isLotBelongsToUser = await findLotByUserIdAndLotId(user?.uid as string, data?.id as string);
                    setIsLotBelongsToUser(isLotBelongsToUser);
                }
            } catch (error) {
                console.error('Error fetching lot:', error);
            }
        };

        fetchData();
    }, [params.id, user]);

    if (!data) {
        return (
            <div className='w-[75%] mx-auto flex flex-wrap sm:w-[50%] sm:justify-center gap-4'>
                <section className='flex flex-row gap-2'>
                    <Skeleton className='h-[250px] w-[250px] rounded-lg bg-slate-400' />
                    <div className='flex flex-col ml-10 space-y-2'>
                        <Skeleton className='h-4 w-[200px] bg-slate-400' />
                        <Skeleton className='h-4 w-[300px] bg-slate-400' />
                        <Skeleton className='h-4 w-[300px] bg-slate-400' />
                    </div>
                </section>
            </div>
        )
    }


    return (
        <section className='w-[95%] h-[95%] flex flex-col'>
            <Suspense fallback={<div>Loading...</div>}>
                <div className='w-[75%] mx-auto flex flex-wrap sm:w-[50%] sm:justify-center gap-4'>
                    <section className='flex flex-row gap-2'>
                        <div className='relative h-[250px] w-[250px] flex justify-center'>
                            {data.photolot ? (
                                <Image
                                    alt={data.name as string}
                                    src={data.photolot as string}
                                    className='rounded-lg h-full object-cover'
                                    fill
                                    priority
                                />
                            ) : null}
                        </div>
                        <div className='flex flex-col ml-10'>
                            <div className='gap-2 flex items-center justify-start'>
                                <Label className='font-bold'>Lot's name: </Label>
                                <span className='font-sans'>{data?.name}</span>
                            </div>
                            <div className='gap-2 flex items-center justify-start'>
                                <Label className='font-bold'>Description: </Label>
                                <p className='font-sans'>{data?.description}</p>
                            </div>
                            <div className='gap-2 flex items-center justify-start'>
                                <Label className='font-bold'>Possible variant for change: </Label>
                                <p className='font-sans'>{data?.exchangeOffer}</p>
                            </div>
                        </div>
                        <FavoriteButtons
                            id={data.id}
                            userId={user?.uid}
                            isInFavoriteList={!!data.Favorite?.length}
                            favoriteId={data?.id as string}
                            pathName={`/lot/${data?.id}`}
                            updateFavorites={updateFavorites}
                        />
                    </section>
                </div>
            </Suspense>
            {
                isLotBelongsToUser && <div className='fixed w-full bottom-0 z-10 bg-[#4A5C6A] border-t border-slate-800 h-24'>
                    <div className='flex items-center justify-between px-5 lg:px-10 h-full'>
                        <Button variant="secondary" size='lg' onClick={() => handleEditThing(params.id)}>
                            Edit
                        </Button>
                        <Button variant="destructive" size='lg' onClick={() => handleDeleteThing(params.id)}>
                            Delete
                        </Button>
                    </div>
                </div>
            }
        </section>
    )
}

export default LotRoute