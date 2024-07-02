'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ListFilter, Search, User } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import ChatsUser from '../../components/ChatsUser'
import ChatMessages from '@/app/components/ChatMessages'
import { initAuthState } from '@/lib/firebase/auth/authInitialState'
import { User as CurrentUser } from '@/lib/interfaces'

const ChatsRoute = () => {

    const [user, setUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
        const unsubscribe = initAuthState(setUser);
        return () => unsubscribe();
    }, []);

    const memoizedUser = useMemo(() => user, [user]);

    return (
        <section className='flex'>
            <section className='h-full w-2/5 px-2'>
                <header className='text-xl font-bold flex justify-between items-center'>
                    <span>Chats</span>
                    <Button className='gap-4 cursor-pointer'><ListFilter />Filter</Button>
                </header>
                <main className='mt-5'>
                    <section>
                        <Input type="text" name="thing" placeholder="Search" className='rounded-full' startIcon={Search} />
                    </section>
                    <ChatsUser userPhoto={memoizedUser?.photoURL as string}/>
                </main>
            </section>
            <section className='w-full h-full rounded-lg'>
                <header className='text-xl font-bold flex justify-end'>
                    <Button className='ml-2 bg-slate-500 hover:bg-slate-600'>+ Create new chat</Button>
                </header>
                <main className='mt-5'>
                    <section>
                        <div className='w-1/5'>
                            <Image src={
                                memoizedUser?.photoURL || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                            }
                                alt="User avatar"
                                className='rounded-full h-14 w-14 hidden md:block'
                                width={48}
                                height={48}
                                priority={true}
                            />
                        </div>
                    </section>
                    <ChatMessages userPhoto={memoizedUser?.photoURL as string}/>
                </main>
            </section>
        </section>
    )
}

export default ChatsRoute