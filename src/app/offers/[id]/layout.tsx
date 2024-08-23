import React from 'react';

const IdLayout = ({
  children,
  // offersModal,
}: {
  children: React.ReactNode,
  // offersModal: React.ReactNode,
}) => {
  return (
    <div>
      {/* {offersModal} */}
      {children}
    </div>
  );
};

export default IdLayout;