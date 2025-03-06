import { NextRequest, NextResponse } from 'next/server';

import { getLotById } from '@/lib/features/repositories/lots';
import { IChatMessage, ILot, User as CurrentUser, IChat } from '@/lib/interfaces';
import { getChatByUserIdChatId, getPartnerUserObj } from '@/lib/features/repositories/chats';
import { getUserAndPartnerLotsIds, getLotByUserIdLotId } from '@/lib/features/repositories/lots';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');
  const userId = searchParams.get('userId');

  if (!chatId || !userId) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  try {
    const getChat = await getChatByUserIdChatId(chatId, userId);
    if (getChat) {
      const { myLotId, partnerLotId } = await getUserAndPartnerLotsIds(
        getChat.chat as IChat,
        userId as string,
      );

      if (myLotId && partnerLotId) {
        const myLotData = await getLotById(myLotId);
        const partnerLotData = await getLotById(partnerLotId);
        const partnerUserObj = await getPartnerUserObj(partnerLotData?.userId as string);
        const ownerLot = await getLotByUserIdLotId(userId as string, myLotId);

        const chatData = {
          myLot: myLotData as ILot,
          partnerLot: partnerLotData as ILot,
          partnerUser: partnerUserObj as CurrentUser,
          messages: getChat.messages as IChatMessage[],
          owner: ownerLot,
        };

        return NextResponse.json(chatData);
      }
    }

    return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching chat data:', error);
    return NextResponse.json({ error: 'Error fetching chat data' }, { status: 500 });
  }
}
