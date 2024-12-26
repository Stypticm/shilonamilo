'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initAuthState } from '@/lib/firebase/auth/authInitialState';

import LotSection from '@/app/components/lotComponents/LotSection';
import ChatSection from '@/app/components/chatComponents/ChatSection';

import { User as CurrentUser, IChatMessage, ILot } from '@/lib/interfaces';
import ExchangeStatusSection from '@/app/components/lotComponents/ExchangeStatusSection';
import FeedbackSection from '@/app/components/feedbackComponents/FeedbackSection';
import { isFeedBackAdded } from '../functions';
import { toast } from '@/lib/hooks/useToast';
import {
  onJoinChat,
  offMessage,
  onMessageRecieved,
  onSendMessage,
} from '@/lib/features/websockets/chatHandler';

const ChatIdRoute = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

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
          `/api/fetchChatData?chatId=${params.id}&userId=${memoizedUser?.uid}`,
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
  }, [params.id, memoizedUser?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    onJoinChat(params.id);

    onMessageRecieved((data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      offMessage();
    };
  }, [params.id]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(params.id, inputMessage, memoizedUser?.uid as string);
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
    <>
      <section className="w-full flex flex-col justify-around items-center md:flex-row p-2">
        <section className="md:w-1/2 sm:w-full h-full mx-auto rounded-lg flex flex-col justify-around space-y-10 mr-0 md:mr-5">
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
            chatId={params.id}
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
          messages={messages ?? []}
          companion={partnerUser}
          onMessageSend={handleSendMessage}
          inputMessage={inputMessage}
          onInputChange={(e) => setInputMessage(e.target.value)}
        />
      </section>
    </>
  );
};

export default ChatIdRoute;
