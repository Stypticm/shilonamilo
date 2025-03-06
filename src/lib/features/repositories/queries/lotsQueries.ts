import { useQuery } from '@tanstack/react-query';
import { getAllLots } from '../lots';
import { ILot } from '@/lib/interfaces';

export const useLots = (userId?: string, searchQuery: string = '', initialData?: ILot[]) => {
  return useQuery<ILot[]>({
    queryKey: ['lots', userId ?? '', searchQuery],
    queryFn: async () => {
      try {
        return userId ? await getAllLots(userId) : await getAllLots();
      } catch (error) {
        console.error('Error fetching lots:', error);
        throw new Error(`Failed to fetch lots: ${error}`);
      }
    },
    initialData,
    select: (data) => {
      return data
        .map((item: ILot) => ({
          id: item.id,
          name: item.name,
          description:
            item.description?.length && item.description?.length > 20
              ? item.description?.substring(0, 20) + '...'
              : item.description,
          location: item.city + ', ' + item.country,
          category: item.category,
        }))
        .filter(
          (lot) =>
            lot.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lot.description?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    },
  });
};
