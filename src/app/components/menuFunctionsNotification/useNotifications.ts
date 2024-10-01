import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { offMessage, onMessageRecieved, joinChat } from '@/lib/features/websockets/chatHandler';
import { joinRoom, onProposalReceived, offProposal } from '@/lib/features/websockets/proposalHandler';

interface UseChatNotificationProps {
    userId: string | null;
    isChatPage: boolean;
    lastReadMessage: number;
    setLastReadMessage: (timestamp: number) => void;
    setHasChatNotifications: (hasChatNotifications: boolean) => void;
}

interface UseProposalNotificationProps {
    userId: string | null;
    isOffersPage: boolean;
    setHasProposalNotifications: (hasProposalNotifications: boolean) => void;
}

export const useChatNotifications = ({
    userId,
    isChatPage,
    lastReadMessage,
    setLastReadMessage,
    setHasChatNotifications
}: UseChatNotificationProps) => {
    const router = useRouter();

    useEffect(() => {
        if (userId) {
            joinChat(userId);

            const handleChatNotification = (data: any) => {
                const { type, senderId, timestamp, chatId } = data

                const notificationTimestamp = new Date(timestamp).getTime();
                const lastReadMessageTimestamp = new Date(lastReadMessage).getTime();

                if (type === 'message' && (isChatPage || senderId === userId)) {
                    setLastReadMessage(timestamp);
                    return;
                }

                if (notificationTimestamp > lastReadMessageTimestamp && !isChatPage) {
                    setHasChatNotifications(true);
                    const notificationId = toast({
                        title: 'New notification',
                        description: 'You got a new message',
                        variant: 'default',
                        onClick: () => {
                            router.push(`/chats/${chatId}`),
                                notificationId.dismiss()
                        },
                        className: 'cursor-pointer'
                    })
                }
            }

            onMessageRecieved(handleChatNotification);

            return () => {
                offMessage();
            }
        }
    }, [userId, isChatPage, lastReadMessage]);
}

export const useProposalNotifications = ({
    userId,
    isOffersPage,
    setHasProposalNotifications
}: UseProposalNotificationProps) => {
    const router = useRouter();

    useEffect(() => {
        if (userId) {
            joinRoom(userId);

            const handleProposalNotification = (data: any) => {

                const type = 'proposal';
                const senderId = data.userIdOfferedLot;

                if (type === 'proposal') {
                    if (!isOffersPage && senderId !== userId) {

                        setHasProposalNotifications(true);
                        const notificationId = toast({
                            title: 'New notification',
                            description: 'You got a new proposal',
                            variant: 'default',
                            onClick: () => {
                                notificationId.dismiss();
                                router.push(`/offers/${userId}`)
                            },
                            className: 'cursor-pointer'
                        });
                    }
                }
            }

            onProposalReceived(handleProposalNotification);

            return () => {
                offProposal();
            }
        }

    }, [userId, isOffersPage]);
}