'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { initAuthState } from '@/lib/firebase/auth/authInitialState'
import { socket } from '@/socket'

import { getLotIds } from '../functions'
import { getChatbyUserIdChatId, getParnerUserObj } from '../chatActions'
import { getLotById } from '@/lib/features/myStuff'

import LotSection from '@/app/components/lotComponents/LotSection'
import ChatSection from '@/app/components/chatComponents/ChatSection'

import { User as CurrentUser, IChat, IChatMessage, ILot } from '@/lib/interfaces'

const ChatIdRoute = ({ params }: { params: { id: string } }) => {

    const router = useRouter()

    const [user, setUser] = useState<CurrentUser | null>(null);
    const [partnerUser, setPartnerUser] = useState<CurrentUser | null>(null);

    const [myLot, setMyLot] = useState<ILot | null>(null);
    const [partnerLot, setPartnerLot] = useState<ILot | null>(null);

    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');

    useEffect(() => {
        const unsubscribe = initAuthState(setUser);
        return () => unsubscribe();
    }, []);

    const memoizedUser = useMemo(() => user, [user]);

    useEffect(() => {
        const fetchChatData = async () => {
            const chat = await getChatbyUserIdChatId(params.id as string)
            if (chat) {
                const { myLotId, partnerLotId } = await getLotIds(chat as IChat, memoizedUser?.uid as string)

                if (myLotId && partnerLotId) {
                    // get data
                    const myLotData = await getLotById(myLotId)
                    const partnerLotData = await getLotById(partnerLotId)
                    const partnerUserObj = await getParnerUserObj(partnerLotData?.userId as string)

                    setMyLot(myLotData as ILot)
                    setPartnerLot(partnerLotData as ILot)

                    setPartnerUser(partnerUserObj as CurrentUser)

                    setMessages(chat.messages as IChatMessage[])
                }
            }
        }

        fetchChatData()
    }, [params.id, memoizedUser?.uid])

    useEffect(() => {
        socket.emit("joinChat", params.id);

        socket.on("message", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off("message");
        }

    }, [params.id])

    const sendMessage = () => {
        if (inputMessage.trim()) {
            socket.emit("sendMessage", { chatId: params.id, content: inputMessage, senderId: memoizedUser?.uid as string });
            setInputMessage('');
        }
    }

    const handleClickLot = (id: string) => {
        router.push(`/lot/${id}`)
    }

    return (
        <>
            <section className='w-full flex flex-col justify-around items-center md:flex-row p-2'>
                <section className='md:w-1/2 sm:w-full h-full mx-auto rounded-lg flex flex-col justify-around space-y-10 mr-0 md:mr-5'>
                    <LotSection title='My Lot' lot={myLot} onClick={handleClickLot} />
                    <LotSection title='Partner Lot' lot={partnerLot} onClick={handleClickLot} />
                </section>
                <ChatSection
                    messages={messages}
                    companion={partnerUser}
                    onMessageSend={sendMessage}
                    inputMessage={inputMessage}
                    onInputChange={(e) => setInputMessage(e.target.value)}
                />
            </section>
            <section className='w-full text-center m-5'>
                Cofirm Trade
            </section>
        </>
    )
}

export default ChatIdRoute