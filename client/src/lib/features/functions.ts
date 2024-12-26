import { updateLot } from '@/app/actions';
import { getFavorites } from '../currentData';
import { User as CurrentUser, ILot } from '../interfaces';
import { toast } from '@/lib/hooks/useToast';
import { Router } from 'next/router';

export const fetchFavorites = async (
  user: Pick<CurrentUser, 'uid'>,
  setFavorites: React.Dispatch<React.SetStateAction<ILot[]>>,
) => {
  try {
    const data = await getFavorites(user?.uid as string);
    setFavorites(data as ILot[]);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
  }
};

export const updateLotAction = async (formData: FormData, lotId: string, router: Router) => {
  formData.append('lotId', lotId);

  const result = await updateLot(formData, lotId);

  if (result?.error) {
    toast({
      description: result.error,
      title: 'Error',
      variant: 'destructive',
    });
  } else if (result?.text === 'Nothing changed') {
    router.push(`/lot/${lotId}`);
  } else if (result?.redirect) {
    router.push(`/lot/${lotId}`);
  }
};
