import { createDescription, updateLot } from '@/app/actions'
import { getFavorites } from '../currentData'
import {User as CurrentUser} from '../interfaces'
import { toast } from '@/components/ui/use-toast'

export const fetchFavorites = async ( user: Pick<CurrentUser, 'uid'>, setFavorites: any) => {
    try {
        const data = await getFavorites(user?.uid as string)
        setFavorites(data)
    } catch (error) {
        console.error('Failed to fetch favorites:', error)
    }
}

export const updateLotAction = async (formData: FormData, lotId: string, router: any) => {
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
}