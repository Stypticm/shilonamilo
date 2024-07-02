'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { User } from '@/lib/interfaces'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { initAuthState, handleLogout } from '@/lib/firebase/auth/authInitialState'
import { createNewThing } from '../actions'

const Menu: React.FC = () => {

  const router = useRouter()
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const memoizedUser = useMemo(() => user, [user]);

  const createThingId = useCallback(() => {
    return createNewThing({ userId: memoizedUser?.uid as string });
  }, [memoizedUser]);

  const authorization = () => {
    router.push('/auth')
  }

  const logout = async () => {
    await handleLogout(setUser)
    router.push('/')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
          <MenuIcon className='w-6 h-6 lg:w-5 lg:h-5' />
          <Image src={
            memoizedUser?.photoURL || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
          }
            alt="User avatar"
            className='rounded-full h-8 w-8 hidden md:block'
            width={32}
            height={32}
            priority={true} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[200px] bg-slate-400'>
        {
          user ? (
            <>
              <DropdownMenuItem>
                <form action={createThingId} className='w-full'>
                  <button type='submit' className='w-full text-start'>
                    Add a new thing
                  </button>
                </form>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/chats/${user.uid}`} className='w-full'>
                  Chats
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={'/favorites'} className='w-full'>
                  Favorite things
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/my-stuff/${user.uid}`} className='w-full'>
                  My stuff
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={authorization}>
                Authorization
              </DropdownMenuItem>
            </>
          )
        }
      </DropdownMenuContent >
    </DropdownMenu >
  )
}

export default React.memo(Menu)