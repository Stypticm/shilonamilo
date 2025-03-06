'use client';

import React, { use, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initAuthState } from '@/lib/firebase/auth/authInitialState';

import LotSection from '@/components/lotComponents/LotSection';
import ChatSection from '@/components/chatComponents/ChatSection';

import { User as CurrentUser, IChatMessage, ILot } from '@/lib/interfaces';
import ExchangeStatusSection from '@/components/lotComponents/ExchangeStatusSection';
import FeedbackSection from '@/components/feedbackComponents/FeedbackSection';
import { isFeedBackAdded } from '@/lib/features/repositories/feedbacks';
import { toast } from '@/lib/hooks/use-toast';
import {
  onJoinChat,
  offMessage,
  onMessageReceived,
  onSendMessage,
} from '@/lib/features/websockets/chatHandlerClient';

interface ChatIdRouteProps {
  params: Promise<{ id: string }>;
}

const ChatIdRoute = ({ params }: ChatIdRouteProps) => {
  const router = useRouter();

  const { id } = use(params);

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [partnerUser, setPartnerUser] = useState<CurrentUser | null>(null);

  const [myLot, setMyLot] = useState<ILot | null>(null);
  const [partnerLot, setPartnerLot] = useState<ILot | null>(null);

  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');

  const [owner, setOwner] = useState<string | null>(null);

  const [isShowFeedback, setIsShowFeedback] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const memoizedUser = useMemo(() => user, [user]);

  const fetchData = useCallback(async () => {
    if (memoizedUser?.uid) {
      try {
        const response = await fetch(
          `/api/chat?chatId=${id}&userId=${memoizedUser?.uid}`,
        );
        const data = await response.json();

        setMyLot(data.myLot);
        setPartnerLot(data.partnerLot);
        setPartnerUser(data.partnerUser);
        setMessages(data.messages);
        setOwner(data.owner);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    }
  }, [id, memoizedUser?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!id) return;

    onJoinChat(id);

    onMessageReceived((data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      offMessage();
    };
  }, [id]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(id, inputMessage, memoizedUser?.uid as string);
      setInputMessage('');
    }
  };

  const handleClickLot = (id: string) => {
    router.push(`/lot/${id}`);
  };

  const isOwner = owner === memoizedUser?.uid;
  const role = isOwner ? 'participant' : 'owner';

  const handleShowFeedback = async (shouldShow: boolean) => {
    const existingFeedBack = await isFeedBackAdded(
      partnerLot?.id as string,
      memoizedUser?.uid as string,
      role,
    );

    if (existingFeedBack.success) {
      toast({
        description: existingFeedBack.message,
        variant: 'destructive',
        className: 'bg-green-600',
      });
      setIsShowFeedback(false);
    } else {
      setIsShowFeedback(shouldShow);
    }
  };

  const closeFeedback = () => {
    setIsShowFeedback(false);
  };

  return (
    <section className="w-full h-full flex flex-col justify-around items-center lg:flex-row p-2">
      <section className="h-full w-full rounded-lg flex flex-col justify-around space-y-10 lg:w-1/2">
        <LotSection
          title={isOwner ? 'My Lot' : 'Your offer'}
          lot={myLot}
          onClick={handleClickLot}
        />

        <ExchangeStatusSection
          lot1={myLot}
          lot2={partnerLot}
          isOwner={isOwner}
          fetchData={fetchData}
          handleShowFeedback={(shouldShow) => handleShowFeedback(shouldShow)}
          isShowFeedback={isShowFeedback}
          chatId={id}
        />

        {isShowFeedback ? (
          <FeedbackSection
            closeFeedback={closeFeedback}
            lotId={partnerLot?.id as string}
            userId={memoizedUser?.uid as string}
            role={role}
          />
        ) : (
          <LotSection
            title={isOwner ? 'Partner Lot' : 'Owner of the lot'}
            lot={partnerLot}
            onClick={handleClickLot}
          />
        )}
      </section>
      <ChatSection
        className="h-full w-full mt-4 bg-slate-300 rounded-lg lg:ml-2 lg:w-1/2"
        messages={messages ?? []}
        companion={partnerUser}
        onMessageSend={handleSendMessage}
        inputMessage={inputMessage}
        onInputChange={(e) => setInputMessage(e.target.value)}
      />
    </section>
  );
};

export default ChatIdRoute;
