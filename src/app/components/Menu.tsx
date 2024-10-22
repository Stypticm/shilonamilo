'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/lib/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import React, { use, useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { initAuthState, handleLogout } from '@/lib/firebase/auth/authInitialState';
import { createNewLot } from '../actions';
import { MenuIcon } from 'lucide-react';
import { toast } from '@/lib/hooks/useToast';
import {
  useChatNotifications,
  useProposalNotifications,
} from './menuFunctionsNotification/useNotifications';
import { chatSocket } from '@/socket';

const Menu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [hasChatNotifications, setHasChatNotifications] = useState<boolean>(false);
  const [hasProposalNotifications, setHasProposalNotifications] = useState<boolean>(false);
  const [lastReadMessage, setLastReadMessage] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const memoizedUser = useMemo(() => user, [user]);

  const isChatPage = useMemo(() => pathname.includes('/chats'), [pathname]);

  const isOffersPage = useMemo(() => pathname.includes(`/offers/${memoizedUser?.uid}`), [pathname]);

  useEffect(() => {
    if (!isChatPage) {
      setHasChatNotifications((prev) => prev || false);
    } else {
      setHasChatNotifications(false);
    }
  }, [isChatPage]);

  useEffect(() => {
    if (!isOffersPage) {
      setHasProposalNotifications((prev) => prev || false);
    } else {
      setHasProposalNotifications(false);
    }
  }, [isOffersPage]);

  useEffect(() => {
    if (memoizedUser) {
      const handleNewNotification = (notification: any) => {
        if (notification.type === 'chat') {
          toast({
            title: 'New notification',
            description: notification.data.message,
            onClick: () => {
              router.push(`/chats/${notification.data.chatId}`);
            },
            className: 'cursor-pointer',
          });
        }
      };

      chatSocket.on('newNotification', handleNewNotification);

      return () => {
        chatSocket.off('newNotification', handleNewNotification);
      };
    }
  }, [memoizedUser, router]);

  useChatNotifications({
    userId: (memoizedUser?.uid as string) || null,
    isChatPage,
    lastReadMessage,
    setLastReadMessage,
    setHasChatNotifications,
  });

  useProposalNotifications({
    userId: (memoizedUser?.uid as string) || null,
    isOffersPage,
    setHasProposalNotifications,
  });

  const createLot = useCallback(() => {
    return createNewLot({ userId: memoizedUser?.uid as string });
  }, [memoizedUser]);

  const authorization = () => {
    router.push('/auth');
  };

  const logout = async () => {
    await handleLogout(setUser).then(() => router.push('/'));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
          <MenuIcon className="w-8 h-8 md:w-12 md:h-7" />
          <Image
            src={
              memoizedUser?.photoURL ||
              'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'
            }
            alt="User avatar"
            className="rounded-full h-8 w-8 hidden md:block"
            width={32}
            height={32}
            priority
          />
          {hasChatNotifications || hasProposalNotifications ? (
            <div className="flex items-center justify-center">
              <span className="inline-block w-4 h-4 rounded-full bg-yellow-500" />
            </div>
          ) : null}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] bg-slate-400">
        {user ? (
          <>
            <DropdownMenuItem>
              <form action={createLot} className="w-full">
                <button type="submit" className="w-full text-start">
                  Add a new lot
                </button>
              </form>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/chats`} className="w-full flex items-center justify-between">
                Chats
                {hasChatNotifications && !isChatPage && (
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                )}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/favorites/${user.uid}`} className="w-full">
                Favorite lots
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/offers/${user.uid}`} className="w-full">
                Offers
                {hasProposalNotifications && !isOffersPage && (
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                )}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/my-stuff/${user.uid}`} className="w-full">
                My lots
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={authorization}>Authorization</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default React.memo(Menu);
