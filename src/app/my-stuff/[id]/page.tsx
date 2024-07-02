'use client'

import { getMyStuff } from '@/lib/features/myStuff'
import { Thing } from '@/lib/interfaces'
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'

const MyStuffRoute = ({ params }: { params: { id: string } }) => {
    const router = useRouter()

    const [myStuff, setMyStuff] = React.useState<Thing[]>([])

    React.useEffect(() => {
        const fetchMyStuff = async () => {
            try {
                const data = await getMyStuff(params.id)
                setMyStuff(data)
            } catch (error) {
                console.error('Failed to fetch my stuff:', error)
            }
        }

        fetchMyStuff()
    }, [])

    const handleClick = (id: string) => {
        router.push(`/thing/${id}`)
    }

    return (
        <>
            <section className='w-[95%] h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center align-items-center'>
                {myStuff.length > 0 && myStuff.map(thing => (
                    <section className='rounded-lg releative h-full w-full flex flex-col cursor-pointer bg-slate-400 hover:bg-slate-500 p-2' key={thing.id} onClick={() => handleClick(thing.id)}>
                        <p className='relative h-72'>
                            {
                                thing.photothing ? (
                                    <Image src={thing.photothing as string} alt={thing.name as string} width={250} height={250} className='rounded-lg h-full w-full object-cover' />
                                ) : null
                            }
                        </p>
                        <p className='text-xl font-bold'>{thing.name}</p>
                        <p className='text-lg'>{thing.country}, {thing.city}</p>
                    </section>
                ))}
            </section>

            <section className='w-[95%] h-full'>
                {myStuff.length === 0 && (
                    <div className='flex items-center justify-center mt-20'>
                        <section className='flex flex-col justify-center items-center bg-green-200 w-[50%] h-full p-2 rounded-lg opacity-75'>
                            <p>
                                You don't have any items in your list yet. Just click the "Add a new thing" button in menu bar.
                            </p>
                            <p className='rounded-full bg-green-400 tranform'>
                                <ShieldAlert className='w-20 h-20' />
                            </p>
                        </section>
                    </div>
                )}
            </section>
        </>
    )
}

export default MyStuffRoute