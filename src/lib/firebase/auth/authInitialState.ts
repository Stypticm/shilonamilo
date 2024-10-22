import { User } from '@/lib/interfaces';
import { onAuthStateChanged, User as FirebaseUser, signOut } from '@firebase/auth';
import { auth } from '../firebase';

export const initAuthState = (setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser: FirebaseUser | null) => {
    if (currentUser) {
      setUser({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        photoURL: currentUser.photoURL || '',
        uid: currentUser.uid,
      });
    } else {
      setUser(null);
    }
  });
  return unsubscribe;
};

export const handleLogout = async (setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  try {
    await signOut(auth);
    setUser(null);
  } catch (error: unknown) {
    console.error('Error during logout:', error);
    throw error;
  }
};
