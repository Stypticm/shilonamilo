import React from 'react';
import Image from 'next/image';
import { ILot } from '@/lib/interfaces';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const Lot = ({ data }: { data: ILot }) => {
  if (!data) {
    return (
      <div className="w-[75%] mx-auto flex flex-wrap sm:w-[50%] sm:justify-center gap-4">
        <section className="flex flex-row gap-2 p-2">
          <Skeleton className="h-[250px] w-[250px] rounded-lg bg-slate-400" />
          <div className="flex flex-col ml-10 space-y-2">
            <Skeleton className="h-4 w-[200px] bg-slate-400" />
            <Skeleton className="h-4 w-[300px] bg-slate-400" />
            <Skeleton className="h-4 w-[300px] bg-slate-400" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <section className="flex flex-row gap-2 w-full p-2">
      <div className="relative h-[250px] w-[250px] flex justify-center">
        {data.photolot ? (
          <Image
            alt={data.name as string}
            src={data.photolot as string}
            className="rounded-lg h-full object-cover"
            fill
            priority={false}
            sizes="(max-width: 768px) 100vw,
                                        (max-width: 1200px) 50vw,
                                        33vw"
          />
        ) : null}
      </div>
      <div className="flex flex-col ml-10">
        <div className="gap-2 flex items-center justify-start">
          <Label className="font-bold">Lot&apos;s name: </Label>
          <span className="font-sans">{data?.name}</span>
        </div>
        <div className="gap-2 flex items-center justify-start">
          <Label className="font-bold">Description: </Label>
          <p className="font-sans">{data?.description}</p>
        </div>
        <div className="gap-2 flex items-center justify-start">
          <Label className="font-bold">Possible variant for change: </Label>
          <p className="font-sans">{data?.exchangeOffer}</p>
        </div>
      </div>
    </section>
  );
};

export default Lot;
