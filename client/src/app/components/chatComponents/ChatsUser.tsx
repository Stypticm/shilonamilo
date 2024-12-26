import React from 'react';
import Image from 'next/image';

const ChatsUser = ({ userPhoto }: { userPhoto: string }) => {
  return (
    <section className="mt-5 rounded-lg cursor-pointer flex">
      <div className="w-1/5">
        <Image
          src={
            userPhoto ||
            'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'
          }
          alt="User avatar"
          className="rounded-full h-8 w-8 hidden md:block"
          width={48}
          height={48}
          priority={true}
        />
      </div>
      <div className="ml-2 w-full">
        <section className="flex justify-between">
          <span>Username</span>
          <span>1 min</span>
        </section>
        <section className="flex justify-between">
          <span>last message</span>
          <div className="w-6 h-6 flex justify-center items-center rounded-full bg-orange-600">
            2
          </div>
        </section>
      </div>
    </section>
  );
};

export default ChatsUser;
