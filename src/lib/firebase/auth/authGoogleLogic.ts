import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { User } from '@/lib/interfaces';
import { firebase_app } from '../firebase';
import { NextResponse } from 'next/server';
import { chatSocket, proposalSocket } from '@/socket';

const auth = getAuth(firebase_app);
const googleProvider = new GoogleAuthProvider();

const googleAuthSignUp = (setUser: React.Dispatch<React.SetStateAction<User | null>>) =>
  handleGoogleAuth(setUser, googleProvider);

type AuthProvider = GoogleAuthProvider;

export const handleGoogleAuth = async (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  provider: AuthProvider,
) => {
  try {
    const result = await signInWithPopup(auth, provider).catch((error) => {
      console.error('Error during Google Sign Up:', error);
      throw error;
    });

    const token = await result.user.getIdToken(true).then((token) => {
      return token;
    });

    const currentUser = result.user;

    setUser({
      email: currentUser.email || '',
      photoURL: currentUser.photoURL || '',
      displayName: currentUser.displayName || '',
      uid: currentUser.uid,
    });

    proposalSocket.emit('subscribeToNotifications', currentUser.uid);
    chatSocket.emit('subscribeToNotifications', currentUser.uid);

    const response = await fetch('/api/auth/creation', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to authenticate user:', errorText);
      throw new Error(errorText || 'Failed to authenticate user');
    }

    const responseData = await response.text();

    if (response.ok) {
      console.log('User authenticated and processed');
      setUser({
        email: currentUser.email || '',
        photoURL: currentUser.photoURL || '',
        displayName: currentUser.displayName || '',
        uid: currentUser.uid,
      });
    } else {
      console.error('Failed to authenticate user:', responseData);
      throw new Error(responseData || 'Failed to authenticate user');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error during Google:`, error);
      throw new Error(`Error during Google: ${error.message}`);
    } else {
      console.error(`Unexpected error during Google:`, error);
      throw new Error('Unexpected error during Google authentication');
    }
  }
};

export const googleProviderAuth = async ({
  setUser,
  closeModal,
}: {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  closeModal?: () => void;
}) => {
  try {
    await googleAuthSignUp(setUser);
    if (closeModal) closeModal();
    return NextResponse.redirect('http://localhost:3000/');
  } catch (error) {
    console.error(`Error during Google Sign Up:`, error);
    throw error;
  }
};
