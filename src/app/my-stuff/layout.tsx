import React from 'react';

const MyStuffLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-10 w-[95%] h-full mx-auto rounded-lg p-2">{children}</div>;
};

export default MyStuffLayout;
