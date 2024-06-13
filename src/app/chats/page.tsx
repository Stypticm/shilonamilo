import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ListFilter, Search, User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import ChatsUser from '../components/ChatsUser'

const ChatsRoute = () => {
    return (
        <div className='flex'>
            <section className='h-full w-2/5 px-2'>
                <header className='text-xl font-bold flex justify-between items-center'>
                    <span>Chats</span>
                    <Button className='gap-4 cursor-pointer'><ListFilter />Filter</Button>
                </header>
                <main className='mt-5'>
                    <section>
                        <Input type="text" name="thing" placeholder="Search" className='rounded-full' startIcon={Search} />
                    </section>
                    <ChatsUser />
                </main>
            </section>
            <section className='w-full h-full bg-slate-600 rounded-lg'>
                <header className='text-xl font-bold flex justify-end'>
                    <Button variant='secondary' className='ml-2'>+ Create new chat</Button>
                </header>
                <main>
                    <section>
                        <div className='w-[1/5]'>
                            {/* <Image src= width={50} height={50} alt="user profile" className='rounded-full' /> */}
                            <User className='w-14 h-14 rounded-full bg-slate-100' />
                        </div>
                    </section>
                </main>
            </section>
        </div>
    )
}

export default ChatsRoute