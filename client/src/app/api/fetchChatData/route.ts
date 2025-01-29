import { NextRequest, NextResponse } from 'next/server';

import { getLotById } from '@/lib/features/server_requests/lots';
import { IChat, IChatMessage, ILot, User as CurrentUser } from '@/lib/interfaces';
import { getChatbyUserIdChatId, getParnerUserObj } from '@/app/chats/chatActions';
import { getLotIds, getLotOwner } from '@/app/chats/functions';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');
  const userId = searchParams.get('userId');

  if (!chatId || !userId) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  try {
    const chat = await getChatbyUserIdChatId(chatId);
    if (chat) {
      const { myLotId, partnerLotId } = await getLotIds(chat as IChat, userId as string);

      if (myLotId && partnerLotId) {
        const myLotData = await getLotById(myLotId);
        const partnerLotData = await getLotById(partnerLotId);
        const partnerUserObj = await getParnerUserObj(partnerLotData?.userId as string);
        const ownerLot = await getLotOwner(myLotId, userId as string);

        const chatData = {
          myLot: myLotData as ILot,
          partnerLot: partnerLotData as ILot,
          partnerUser: partnerUserObj as CurrentUser,
          messages: chat.messages as IChatMessage[],
          owner: ownerLot as string,
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
