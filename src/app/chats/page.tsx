'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { User as CurrentUser, IChats } from '@/lib/interfaces'
import { initAuthState } from '@/lib/firebase/auth/authInitialState';
import { getAllMyChats } from './chatActions';
import { useRouter } from 'next/navigation';
import NoItems from '../components/NoItems';

const ChatsRoute = () => {

  const router = useRouter()

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [chats, setChats] = useState<IChats[]>([]);

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const memoizedUser = useMemo(() => user, [user]);

  const fetchChats = async () => {
    try {
      const chat = await getAllMyChats(memoizedUser?.uid as string)

      setChats(chat as IChats[])

    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }

  useEffect(() => {
    fetchChats();
  }, [memoizedUser?.uid]);

  const handleClickChat = (id: string) => {
    router.push(`/chats/${id}`)
  }

  return (
    <>
      {
        chats.length === 0 ? (
          <NoItems name='Chats' description='You have no chats' />
        ) : (
          <section>
            {chats.map((chat) => (
              <div className='w-[200px] bg-slate-300 cursor-pointer shadow-xl rounded-lg' key={chat.id} onClick={() => handleClickChat(chat.id as string)}>
                <h1>{chat.id}</h1>
              </div>
            )
            )}
          </section >
        )
      }
    </>
  )
}

export default ChatsRoute