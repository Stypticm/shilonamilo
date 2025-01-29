import React from 'react';

const ChatsLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-10 w-full h-full mx-auto bg-slate-400 rounded-lg p-2">{children}</div>;
};

export default ChatsLayout;
