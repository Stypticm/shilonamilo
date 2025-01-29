import React from 'react';

const Title = () => {
  return (
    <aside className="w-full text-center py-4">
      <blockquote className="font-heading font-semibold tracking-tight mb-2 text-pretty hidden md:block text-zink-800">
        &quot;In trade, barter is a system of exchange in which participants in a transaction <br />
        directly exchange goods or services for other goods or <br />
        services without using a medium of exchange, such as money.&quot;
      </blockquote>
      <blockquote className="font-heading font-semibold tracking-tight mb-2 text-pretty block md:hidden text-zink-800">
        <span className="relative bg-gradient-to-r from-sky-600 to-sky-900 text-transparent bg-clip-text">
          Que Pro Quo
        </span>
      </blockquote>
    </aside>
  );
};

export default Title;
