import { Rabbit } from 'lucide-react'
import React from 'react'
import Image from 'next/image'

const ChatMessages = ({ userPhoto }: { userPhoto: string }) => {
    return (
        <div className='w-full h-full mt-5'>
            <section className='w-full h-full flex justify-start'>
                <section className='w-1/5 flex justify-center items-center'>
                    <Image src={
                        userPhoto || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                    }
                        alt="User avatar"
                        className='rounded-full h-11 w-11 hidden md:block'
                        width={48}
                        height={48}
                        priority={true}
                    />
                </section>
                <section className='w-4/5'>
                    <p className='bg-slate-300 p-1 rounded-tl-lg rounded-tr-lg rounded-br-lg'>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa, reprehenderit quas rem laboriosam eligendi illum eum pariatur debitis minima, repellendus facere accusantium nisi vero ratione corporis fuga ducimus? Error reiciendis inventore accusamus. Aperiam quaerat vero facere deleniti accusantium iure architecto magni reprehenderit nesciunt odit! Similique mollitia impedit nihil voluptatum eveniet!
                    </p>
                </section>
            </section>

            <section className='w-full mt-5 flex justify-end'>
                <p className='mr-5 w-4/5 bg-blue-700 p-1 rounded-tl-lg rounded-tr-lg rounded-bl-lg'>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio sequi nemo cum in doloribus eius ipsum dolores corporis culpa officia tempore possimus deleniti voluptatem, sit ut autem. Ipsum corporis ab quaerat totam eaque molestias quam ullam sapiente explicabo expedita ex, saepe omnis ducimus reiciendis consectetur repudiandae nesciunt blanditiis aliquam? Nulla?
                </p>
                <section className='w-1/5 flex justify-center items-center'>
                    <Rabbit className='w-11 h-11 rounded-full bg-slate-100' />
                </section>
            </section>
        </div>
    )
}

export default ChatMessages