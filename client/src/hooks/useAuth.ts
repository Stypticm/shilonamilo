import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase/firebase';

import { User as FirebaseUser } from 'firebase/auth';

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return currentUser;
};

export default useAuth;
