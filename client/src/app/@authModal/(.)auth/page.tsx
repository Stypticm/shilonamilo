'use client';

import CredentialsAuth from '@/app/components/CredentialsAuth';
import { Icons } from '@/app/components/Icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { githubProviderAuth } from '@/lib/firebase/auth/authGithubLogic';
import { googleProviderAuth } from '@/lib/firebase/auth/authGoogleLogic';
import { User } from '@/lib/interfaces';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AuthModalPage = () => {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState<'Sign In' | 'Sign up'>('Sign In');

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
      router.back();
    }
  };

  const gogoleAuthClick = async () => {
    await googleProviderAuth({
      setUser,
      closeModal,
    });
    router.push('/');
  };

  const githubAuthClick = async () => {
    await githubProviderAuth({
      setUser,
      closeModal,
    });
    router.push('/');
  };

  const toggleTitle = () => {
    setTitle(title === 'Sign In' ? 'Sign up' : 'Sign In');
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleOnOpenChange}>
      <DialogOverlay className="bg-[#4E9A8D]">
        <DialogContent className="sm:max-w-[425px]" style={{ background: '#605056' }}>
          <DialogTitle className="flex items-center">
            <DialogDescription>
              {title === 'Sign In' ? 'Sign in to your account' : 'Create a new account'}
            </DialogDescription>
          </DialogTitle>
          <CredentialsAuth title={title} setUser={setUser} closeModal={closeModal} />
          <Separator />
          <span className="text-center">Or you can use</span>
          <div className="flex flex-col gap-4 items-center">
            <Button
              className="w-2/3 flex justify-between rounded-full bg-slate-500 hover:bg-slate-600"
              onClick={gogoleAuthClick}
            >
              Sign In with Google
              <Icons.google className="w-5 h-5" />
            </Button>
            {/* <Button className='w-2/3 flex justify-between rounded-full bg-slate-500 hover:bg-slate-600' onClick={() => providerAuth({ setUser, closeModal, providerType: 'facebook' })}>
                            Sign In with Facebook
                            <Icons.facebook className='w-5 h-5' />
                        </Button> */}
            <Button
              className="w-2/3 flex justify-between rounded-full bg-slate-500 hover:bg-slate-600"
              onClick={githubAuthClick}
            >
              Sign In with GitHub
              <Icons.github className="w-5 h-5" />
            </Button>
          </div>
          <Separator />
          <DialogFooter className="flex items-center">
            {title === 'Sign In' ? "Don't have an account?" : 'Already have an account?'}
            <Button className="hover:underline cursor-pointer" onClick={toggleTitle}>
              {title === 'Sign In' ? 'Sign up' : 'Sign In'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default AuthModalPage;
