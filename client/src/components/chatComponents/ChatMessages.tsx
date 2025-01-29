import React, { useState, useEffect, useMemo, memo } from 'react';
import Image from 'next/image';
import { IChatMessage, User } from '@/lib/interfaces';
import { initAuthState } from '@/lib/firebase/auth/authInitialState';

const ChatMessages = memo(({ companion, messages }: { companion: User; messages: IChatMessage[] }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  console.log(messages);

  const memoizedUser = useMemo(() => user, [user]);

  return (
    <div className="w-full h-full mt-5">
      {messages.map((message: IChatMessage) => (
        <div key={message.id}>
          <section
            className={`w-full mt-5 flex ${message?.senderId === memoizedUser?.uid ? 'justify-end' : 'justify-start'}`}
          >
            {message.senderId === memoizedUser?.uid ? (
              <section className="w-full h-full flex justify-end">
                <section className="w-4/5">
                  <p className="bg-slate-400 p-1 rounded-tl-lg rounded-tr-lg rounded-bl-lg">
                    {message.content}
                  </p>
                </section>
                <section className="w-1/5 flex justify-center items-center">
                  <Image
                    src={
                      memoizedUser?.photoURL ||
                      'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'
                    }
                    alt="User avatar"
                    className="rounded-full h-11 w-11 hidden md:block"
                    width={48}
                    height={48}
                    priority={true}
                  />
                </section>
              </section>
            ) : (
              <section className="w-full h-full flex justify-start">
                <section className="w-1/5 flex justify-center items-center">
                  <Image
                    src={
                      companion?.photoURL ||
                      'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'
                    }
                    alt="User avatar"
                    className="rounded-full h-11 w-11 hidden md:block"
                    width={48}
                    height={48}
                    priority={true}
                  />
                </section>
                <section className="w-4/5">
                  <p className="bg-blue-600 p-1 rounded-tr-lg rounded-tl-lg rounded-br-lg">
                    {message.content}
                  </p>
                </section>
              </section>
            )}
          </section>
        </div>
      ))}
    </div>
  );
});

export default ChatMessages;
