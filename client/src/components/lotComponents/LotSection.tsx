import React from 'react';
import Lot from '@/components/Lot';
import { ILot } from '@/lib/interfaces';

const LotSection = ({
  title,
  lot,
  onClick,
}: {
  title: string;
  lot: ILot | null;
  onClick: (id: string) => void;
}) => (
  <section
    className="flex flex-col shadow-2xl rounded-lg cursor-pointer"
    onClick={() => lot && onClick(lot.id)}
  >
    <span className="text-xl font-serif text-center font-bold">{title}</span>
    <Lot data={lot as ILot} />
  </section>
);

export default LotSection;
