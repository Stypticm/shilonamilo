'use client';

import React, { useEffect, useRef } from 'react';
import ChatMessages from './ChatMessages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IChatMessage, User as CurrentUser } from '@/lib/interfaces';

const ChatSection = ({
  messages,
  companion,
  onMessageSend,
  inputMessage,
  onInputChange,
}: {
  messages: IChatMessage[];
  companion: CurrentUser | null;
  onMessageSend: () => void;
  inputMessage: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <section className="md:w-1/2 w-full h-full mx-auto bg-slate-300 rounded-lg md:ml-5 ml-0 mt-5 md:mt-0 ">
      <section className="w-full h-full rounded-lg p-2 max-h-[550px] overflow-y-auto">
        <main className="mt-5">
          <ChatMessages companion={companion as CurrentUser} messages={messages} />
          <div ref={endOfMessagesRef} className="sticky" />
        </main>
      </section>
      <section className="w-full h-full rounded-lg p-2 mt-10">
        <form
          className="w-full flex justify-center items-center space-x-5"
          onSubmit={(e) => {
            e.preventDefault();
            onMessageSend();
          }}
        >
          <Input placeholder="Enter message" value={inputMessage} onChange={onInputChange} />
          <Button variant="outline" className="bg-slate-400" type="submit">
            Send
          </Button>
        </form>
      </section>
    </section>
  );
};
export default ChatSection;
