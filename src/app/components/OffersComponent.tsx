import { useParams } from 'next/navigation';
import React from 'react';

const OffersComponent = () => {
  // no needed for now

  const { id } = useParams();

  console.log(id);

  return (
    <div className="flex justify-around flex-row">
      <section className="border shadow-md p-5 shadow-cyan-500">
        <div>
          <span>My lot</span>
          <p>{}</p>
        </div>
      </section>

      <section>Offered lot</section>
    </div>
  );
};

export default OffersComponent;
