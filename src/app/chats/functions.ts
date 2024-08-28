import { getLotById } from '@/lib/features/myStuff';
import { IChat } from '@/lib/interfaces';

export const getLotIds = async (chat: IChat, userId: string) => {

    const getLotOwner = async(lotId: string) => {
        try {
            const lot = await getLotById(lotId)
            return lot?.userId === userId
        } catch (error) {
            console.error('Error fetching lot owner:', error);
            return false
        }
    }

    const isLot1User = await getLotOwner(chat.lot1Id)
    const isLot2User = await getLotOwner(chat.lot2Id)

    let myLotId: string;
    let partnerLotId: string;

    if (isLot1User) {
        myLotId = chat.lot1Id
        partnerLotId = chat.lot2Id
    } else if (isLot2User) {
        myLotId = chat.lot2Id
        partnerLotId = chat.lot1Id
    } else {
        return { myLotId: null, partnerLotId: null }
    }

    return { myLotId, partnerLotId }
}