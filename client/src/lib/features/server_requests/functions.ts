import { Router } from 'next/router';
import { updateLot } from './lots';
import { toast } from '../../../hooks/use-toast';

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
