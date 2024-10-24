'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { offMessage, onMessageRecieved, onJoinChat } from '@/lib/features/websockets/chatHandler';
import {
  joinRoom,
  onProposalReceived,
  offProposal,
} from '@/lib/features/websockets/proposalHandler';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/lib/hooks/useToast';

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

interface IhandleChatNotification {
  type: string | null;
  senderId: string | null;
  timestamp: number | null;
  chatId: string | null;
}

export const useChatNotifications = ({
  userId,
  isChatPage,
  lastReadMessage,
  setLastReadMessage,
  setHasChatNotifications,
}: UseChatNotificationProps) => {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      onJoinChat(userId);

      const handleChatNotification = (data: IhandleChatNotification) => {
        const { type, senderId, timestamp, chatId } = data;

        const notificationTimestamp = new Date(timestamp as number).getTime();
        const lastReadMessageTimestamp = new Date(lastReadMessage).getTime();

        if (type === 'message' && (isChatPage || senderId === userId)) {
          setLastReadMessage(timestamp as number);
          return;
        }

        if (notificationTimestamp > lastReadMessageTimestamp && !isChatPage) {
          setHasChatNotifications(true);
          toast({
            title: 'New notification',
            description: 'You got a new message',
            className: 'cursor-pointer',
            action: (
              <ToastAction
                className="bg-slate-400 hover:bg-slate-600"
                altText="Open chat"
                onClick={() => router.push(`/chats/${chatId}`)}
              >
                Open chat
              </ToastAction>
            ),
          });
        }
      };

      onMessageRecieved(handleChatNotification);

      return () => {
        offMessage();
      };
    }
  }, [userId, isChatPage, lastReadMessage]);
};

export const useProposalNotifications = ({
  userId,
  isOffersPage,
  setHasProposalNotifications,
}: UseProposalNotificationProps) => {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      joinRoom(userId);

      const handleProposalNotification = (data: { userIdOfferedLot: string; id: string }) => {
        const type = 'proposal';
        const senderId = data.userIdOfferedLot;

        if (type === 'proposal') {
          if (!isOffersPage && senderId !== userId) {
            setHasProposalNotifications(true);
            toast({
              title: 'New notification',
              description: 'You got a new proposal',
              variant: 'default',
              className: 'cursor-pointer',
              action: (
                <ToastAction
                  altText="View proposal"
                  className="bg-slate-400 hover:bg-slate-600"
                  onClick={() => router.push(`/offers/${data.id}`)}
                >
                  View proposal
                </ToastAction>
              ),
            });
          }
        }
      };

      onProposalReceived(handleProposalNotification);

      return () => {
        offProposal();
      };
    }
  }, [userId, isOffersPage]);
};
