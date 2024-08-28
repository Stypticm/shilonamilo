'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { User as CurrentUser, IChats } from '@/lib/interfaces'
import { initAuthState } from '@/lib/firebase/auth/authInitialState';
import { getAllMyChats } from './chatActions';
import { useRouter } from 'next/navigation';

const ChatsRoute = () => {

  const router = useRouter()

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [chats, setChats] = useState<IChats[]>([]);

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const memoizedUser = useMemo(() => user, [user]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chat = getAllMyChats(memoizedUser?.uid as string)
        chat.then((data) => {
          setChats(data as [])
        })
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    }

    fetchChats();
  }, [memoizedUser?.uid]);

  const handleClickChat = (id: string) => {
    router.push(`/chats/${id}`)
  }

  return (
    <>
      <section>
        {chats.map((chat) => (
          <div className='w-[200px] bg-slate-300 cursor-pointer shadow-xl rounded-lg' key={chat.id} onClick={() => handleClickChat(chat.id as string)}>
            <h1>{chat.id}</h1>
          </div>
        )
        )}
      </section>
    </>
  )
}

export default ChatsRoute