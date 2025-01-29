import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from '@firebase/auth';
import { firebase_app } from '../firebase';
import { NextResponse } from 'next/server';
import { User } from '@/lib/interfaces';
import { toast } from '@/hooks/useToast';

const auth = getAuth(firebase_app);

export const handleLogin = async (
  email: string,
  password: string,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  closeModal?: () => void,
) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const token = await result?.user.getIdToken(true);
  const currentUser = result?.user;

  if (!currentUser) throw new Error('User not found');

  setUser({
    email: currentUser.email,
    displayName: currentUser.displayName,
    photoURL: currentUser.photoURL,
    uid: currentUser.uid,
  });

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: currentUser.providerData[0].email,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to authenticate user:', errorText);
    throw new Error(errorText || 'Failed to authenticate user');
  }

  const responseData = await response.text();

  if (response.ok) {
    console.log('User authenticated and processed');
    if (closeModal) closeModal();
    return NextResponse.redirect('http://localhost:3000/');
  } else {
    console.error('Failed to authenticate user:', responseData);
    throw new Error(responseData || 'Failed to authenticate user');
  }
};

export const handleReg = async (
  email: string,
  name: string,
  password: string,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  closeModal?: () => void,
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const token = await result?.user.getIdToken(true);
    const currentUser = result?.user;

    if (!currentUser) throw new Error('User not found');

    await updateProfile(currentUser, {
      displayName: name,
      photoURL: 'https://i.pinimg.com/474x/f1/da/a7/f1daa70c9e3343cebd66ac2342d5be3f.jpg',
    });

    setUser({
      email: currentUser.email,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      uid: currentUser.uid,
    });

    const response = await fetch('/api/auth/creation', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, name }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to authenticate user:', errorText);
      throw new Error(errorText || 'Failed to authenticate user');
    }

    const responseData = await response.text();

    if (response.ok) {
      console.log('User registered and processed');
      if (closeModal) closeModal();
      return NextResponse.redirect('http://localhost:3000/');
    } else {
      console.error('Failed to authenticate user:', responseData);
      throw new Error(responseData || 'Failed to authenticate user');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error during registration:', error);
      toast({
        description: error.message.includes('email-already-in-use')
          ? 'This email is already in use. Please try a different one.'
          : `Error during registration: ${error.message}`,
        variant: 'destructive',
      });
      throw new Error(`Error during registration: ${error.message}`);
    } else {
      console.error(`Unexpected error during Google:`, error);
      throw new Error('Unexpected error during Google authentication');
    }
  }
};
