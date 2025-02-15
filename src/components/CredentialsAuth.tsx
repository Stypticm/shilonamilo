import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { User } from '@/lib/interfaces';
import { handleLogin, handleReg } from '@/lib/firebase/auth/credentialsAuthLogic';
import { useToast } from '@/lib/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { getUserByEmail } from '@/lib/features/repositories/user';

const CredentialsAuth = ({
  title,
  setUser,
  closeModal,
}: {
  title: string;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  closeModal?: () => void;
}) => {
  const { pending } = useFormStatus();
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const comparePasswords = () => {
    return password === confirmPassword;
  };

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const checkUser = await getUserByEmail(email);

    if (checkUser) {
      await handleLogin(email, password, setUser, closeModal);
      router.push('/');
    } else {
      toast({
        description: 'User not found, please try again. Or register first.',
        variant: 'destructive',
        
      });
    }
  };

  const handleRegSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (comparePasswords()) {
      await handleReg(email, name, password, setUser, closeModal);
      router.push('/');
    } else {
      toast({
        description: 'Passwords do not match, please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      {title === 'Sign In' ? (
        <form onSubmit={handleAuthSubmit} method="post" className="flex flex-col gap-4">
          <Input
            type="text"
            name="email"
            placeholder="Email"
            className="rounded-full"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="rounded-full"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {pending ? (
            <Button
              className="w-1/3 mx-auto rounded-full bg-slate-500 hover:bg-slate-600"
              type="submit"
              disabled
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait... Sign In
            </Button>
          ) : (
            <Button
              className="w-1/3 mx-auto rounded-full bg-slate-500 hover:bg-slate-600"
              type="submit"
            >
              Sign In
            </Button>
          )}
        </form>
      ) : (
        <form onSubmit={handleRegSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            name="email"
            placeholder="Email"
            className="rounded-full"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            name="name"
            placeholder="Name"
            className="rounded-full"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="rounded-full"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="rounded-full"
            autoComplete="off"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {pending ? (
            <Button
              className="w-1/3 mx-auto rounded-full bg-slate-500 hover:bg-slate-600"
              type="submit"
              disabled
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait... Sign Up
            </Button>
          ) : (
            <Button
              className="w-1/3 mx-auto rounded-full bg-slate-500 hover:bg-slate-600"
              type="submit"
            >
              Sign Up
            </Button>
          )}
        </form>
      )}
    </>
  );
};

export default CredentialsAuth;
