'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { User as CurrentUser, IChats } from '@/lib/interfaces';
import { initAuthState } from '@/lib/firebase/auth/authInitialState';
import { getUserChatsWithDetails } from '@/lib/features/repositories/chats';
import { useRouter } from 'next/navigation';
import NoItems from '../../components/NoItems';

const ChatsRoute = () => {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [chats, setChats] = useState<IChats[]>([]);

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const memoizedUser = useMemo(() => user, [user]);

  const fetchChats = async () => {
    try {
      const chat = await getUserChatsWithDetails(memoizedUser?.uid as string);
      setChats(chat as IChats[]);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [memoizedUser?.uid]);

  const handleClickChat = (id: string) => {
    router.push(`/chats/${id}`);
  };

  return (
    <>
      {chats.length === 0 ? (
        <NoItems name="Chats" description="You have no chats" />
      ) : (
        <>
          <header className='flex justify-center items-center mb-5'>
            <h2 className="text-2xl font-bold">Chats</h2>
          </header>
          {chats.map((chat) => (
            <div
              className="w-full flex flex-col justify-between bg-slate-500 cursor-pointer rounded-md p-2"
              key={chat.id}
              onClick={() => handleClickChat(chat.id as string)}
            >
              <section className='w-full justify-around flex flex-row'>
                <section className='flex gap-1'>
                  <h3 className='font-bold'>Chat with </h3>
                  <span>{chat.companionUser?.firstname}</span>
                </section>

                <section className='flex gap-1'>
                  <h3 className='font-bold'>Chat about </h3>
                  <span>{chat.companionLot?.name}</span>
                </section>

                <section className='flex gap-1'>
                  <h3 className='font-bold'>Last message </h3>
                  {
                    chat.lastMessage ?
                      <span>
                        {
                          chat.lastMessage.length > 10 ?
                            chat.lastMessage.slice(0, 10) + '...' :
                            chat.lastMessage
                        }
                      </span> : 'No messages yet'
                  }
                </section>
              </section>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default ChatsRoute;
