'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { deleteThing, findThingByUserIdAndThingId } from '@/lib/features/myStuff';
import { initAuthState } from '@/lib/firebase/auth/authInitialState';
import { User as CurrentUser, Thing } from '@/lib/interfaces'
import { useRouter } from 'next/navigation';

const ThingRoute = ({ params }: { params: { id: string } }) => {

    const router = useRouter()

    const [user, setUser] = useState<CurrentUser | null>(null);
    const [data, setData] = useState<Thing | null>(null);
    const [isThingBelongsToUser, setIsThingBelongsToUser] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = initAuthState(setUser);
        return () => unsubscribe();
    }, []);

    console.log(data)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/thing/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch thing');
                }
                const thingData = await response.json();
                setData(thingData);
            } catch (error) {
                console.error('Error fetching thing:', error);
            }
        };

        fetchData();
    }, [params.id]);

    useEffect(() => {
        try {
            const fetchData = async () => {
                if (data && user) {
                    const isThingBelongsToUser = await findThingByUserIdAndThingId(user?.uid as string, data?.id as string);
                    setIsThingBelongsToUser(isThingBelongsToUser);
                }
            };
            fetchData();
        } catch (error) {
            console.error('Error fetching thing:', error);
        }
    }, [data, user]);

    const handleDeleteThing = async (id: string) => {
        try {
            const deleteThingById = await deleteThing(id);

            if (deleteThingById) {
                router.push('/');
            }
        } catch (error) {
            console.error('Error deleting thing:', error);
        }
    }


    return (
        <section className='w-[95%] h-[95%] flex flex-col'>
            <div className='w-[75%] mx-auto flex flex-wrap sm:w-[50%] sm:justify-center gap-4'>
                <section>
                    <div className='flex flex-row gap-2'>
                        <h1 className='font-bold'>This is my stuff:</h1>
                        <span>{data?.name}</span>
                    </div>
                    <div className='relative h-[250px] w-[250px] flex justify-center'>
                        {
                            data?.photothing ? (
                                <Image
                                    alt={data.name as string}
                                    src={data.photothing as string}

                                    className='rounded-lg h-full object-cover'
                                    fill
                                    priority
                                />
                            ) : null
                        }
                    </div>
                    <div className='mt-2'>
                        <p>{data?.description}</p>
                    </div>
                </section>
                <section>
                    <div className='flex flex-row gap-2'>
                        <h1 className='font-bold'>I need:</h1>
                        <span>{data?.youneed}</span>
                    </div>
                    <div className='relative h-[250px] w-[250px] flex justify-center'>
                        {
                            data?.photoyouneed ? (
                                <Image
                                    alt={data.name as string}
                                    src={data.photoyouneed as string}

                                    className='rounded-lg h-full object-cover'
                                    fill
                                    priority
                                />
                            ) : null
                        }
                    </div>
                </section>
            </div>
            {
                isThingBelongsToUser && <div className='fixed w-full bottom-0 z-10 bg-[#4A5C6A] border-t border-slate-800 h-24'>
                    <div className='flex items-center justify-end px-5 lg:px-10 h-full'>
                        {/* <Button variant="secondary" size='lg' >
                            Edit
                        </Button> */}
                        <Button variant="destructive" size='lg' onClick={() => handleDeleteThing(params.id)}>
                            Delete
                        </Button>
                    </div>
                </div>
            }
        </section>
    )
}

export default ThingRoute