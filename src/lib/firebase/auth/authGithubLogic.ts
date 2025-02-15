import { getAuth, signOut, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { User } from '@/lib/interfaces';
import { firebase_app } from '../firebase';
import { NextResponse } from 'next/server';
import { chatSocket, proposalSocket } from '@/lib/socket';

const auth = getAuth(firebase_app);
const githubProvider = new GithubAuthProvider();

const githubAuthSignUp = (setUser: React.Dispatch<React.SetStateAction<User | null>>) =>
  handleGithubAuth(setUser, githubProvider);

type AuthProvider = GithubAuthProvider;

export const handleGithubAuth = async (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  provider: AuthProvider,
) => {
  try {
    const result = await signInWithPopup(auth, provider);

    const token = await result.user.getIdToken(true).then((token) => {
      return token;
    });

    const currentUser = result.user;

    if (!currentUser) throw new Error('User not found');

    setUser({
      email: currentUser.providerData[0].email || '',
      photoURL: currentUser.photoURL || '',
      displayName: currentUser.displayName || '',
      uid: currentUser.uid,
    });

    proposalSocket.emit('subscribeToNotifications', currentUser.uid);
    chatSocket.emit('subscribeToNotifications', currentUser.uid);

    const response = await fetch('/api/auth/creation', {
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
      console.error(`Error during ${provider.providerId.slice(0, 6)}:`, error);
      throw new Error(`Error during ${provider.providerId.slice(0, 6)}: ${error.message}`);
    } else {
      console.error(`Unexpected error during Google:`, error);
      throw new Error('Unexpected error during Google authentication');
    }
  }
};

export const githubProviderAuth = async ({
  setUser,
  closeModal,
}: {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  closeModal?: () => void;
}) => {
  try {
    await githubAuthSignUp(setUser);
    if (closeModal) closeModal();
    return NextResponse.redirect('http://localhost:3000/');
  } catch (error) {
    console.error(`Error during Github Sign Up:`, error);
    throw error;
  }
};

export const handleLogout = async (setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  try {
    await signOut(auth);
    setUser(null);
    return NextResponse.redirect('http://localhost:3000/');
  } catch (error: unknown) {
    console.error('Error during logout:', error);
    throw error;
  }
};
