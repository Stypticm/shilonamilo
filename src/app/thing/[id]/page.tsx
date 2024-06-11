import { unstable_noStore } from 'next/cache'
import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import prisma from '@/lib/prisma/db';
import Image from 'next/image';

const getThing = async (thingId: string) => {
    noStore();
    const data = await prisma.thing.findUnique({
        where: {
            id: thingId
        },
        select: {
            id: true,
            name: true,
            description: true,
            category: true,
            country: true,
            city: true,
            photothing: true,
            youneed: true,
            photoyouneed: true
        }
    })

    return data
}

const ThingRoute = async ({ params }: { params: { id: string } }) => {

    const data = await getThing(params.id)

    return (
        <div className='w-[75%] mx-auto flex justify-around'>
            <section>
                <div className='flex flex-row gap-2'>
                    <h1 className='font-bold'>This is my stuff:</h1>
                    <span>{data?.name}</span>
                </div>
                <div className='relative h-[350px] w-[350px] flex justify-center'>
                    <Image
                        alt="Image of warehouse"
                        src={`${data?.photothing}`}

                        className='rounded-lg h-full object-cover'
                        width={450}
                        height={450}
                        priority
                    />
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
                <div className='relative h-[350px] w-[350px] flex justify-center'>
                    <Image
                        alt="Image of warehouse"
                        src={`${data?.photoyouneed}`}

                        className='rounded-lg h-full object-cover'
                        width={450}
                        height={450}
                        priority
                    />
                </div>
            </section>
        </div>
    )
}

export default ThingRoute