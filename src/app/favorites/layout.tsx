import React from 'react';

const FavoriteLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-[95%] h-full mx-auto rounded-lg">{children}</div>;
};

export default FavoriteLayout;
