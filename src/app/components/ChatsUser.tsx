import { User } from 'lucide-react'
import React from 'react'

const ChatsUser = () => {
    return (
        <section className='mt-5 rounded-lg cursor-pointer flex'>
            <div className='w-[1/5]'>
                {/* <Image src= width={50} height={50} alt="user profile" className='rounded-full' /> */}
                <User className='w-14 h-14 rounded-full bg-slate-100' />
            </div>
            <div className='ml-2 w-full'>
                <section className='flex justify-between'>
                    <span>Username</span>
                    <span>1 min</span>
                </section>
                <section className='flex justify-between'>
                    <span>last message</span>
                    <div className='w-6 h-6 flex justify-center items-center rounded-full bg-orange-600'>2</div>
                </section>
            </div>
        </section>
    )
}

export default ChatsUser