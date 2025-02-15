'use client'

import { use, useEffect, useState } from 'react';
import { User as CurrentUser } from '@/lib/interfaces';
import { initAuthState } from '@/lib/firebase/auth/authInitialState';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileRoute = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);

    const [user, setUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
        const unsubscribe = initAuthState(setUser);
        return () => unsubscribe();
    }, []);

    if (!user) {
        return (
            <section className='w-full h-full flex justify-center items-center'>
                <Skeleton className="h-4 w-[200px] bg-slate-700" />
            </section>
        )
    }

    return (
        <section className='w-full h-full flex justify-center items-center'>
            <header className='flex flex-col items-center gap-2'>
                <h3 className='font-bold'>{user?.email}</h3>
                <Image src={user?.photoURL || ''} alt="User avatar" className="rounded-full h-16 w-16 hidden md:block" width={64} height={64} priority={true} />
                <h2>Hi, {user?.displayName}</h2>
            </header>
            <main></main>
            <footer></footer>
        </section>
    );
}

export default ProfileRoute;