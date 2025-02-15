import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { getMyLots } from '@/lib/features/repositories/lots';
import { ILot } from '@/lib/interfaces';
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { User as CurrentUser } from '@/lib/interfaces';
import { initAuthState } from '@/lib/firebase/auth/authInitialState';
import { onSendProposal } from '@/lib/features/websockets/proposalHandlerclient';

const MyLots = ({ lotId }: { lotId: string }) => {
  const router = useRouter();
  const [myLots, setMyLots] = useState<ILot[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [proposals, setProposals] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const unsubscribe = initAuthState(setUser);
    return () => unsubscribe();
  }, []);

  const fetchMyLots = async () => {
    if (user?.uid) {
      const data = await getMyLots(user.uid);
      setMyLots(data as ILot[]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyLots();
    }
  }, [user, lotId]);

  const handleLotClick = (id: string) => {
    router.push(`/lot/${id}`);
  };

  const handleExchangeProposal = async (myLotId: string) => {
    if (!proposals[myLotId]) {
      await onSendProposal(lotId, myLotId);
      setProposals((prev) => ({
        ...prev,
        [myLotId]: true,
      }));
      await fetchMyLots();
    }
  };

  if (!myLots) {
    return (
      <TableBody>
        <TableRow>
          <TableCell className="text-center text-slate-900 font-bold">
            <Skeleton className="w-full h-full" />
          </TableCell>
          <TableCell className="text-center text-slate-900 font-bold">
            <Skeleton className="w-full h-full" />
          </TableCell>
          <TableCell className="text-center text-slate-900 font-bold">
            <Skeleton className="w-full h-full" />
          </TableCell>
          <TableCell className="text-center text-slate-900 font-bold">
            <Skeleton className="w-full h-full" />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <div className="border-t border-slate-800 w-full">
      <span className="flex justify-center items-center mb-5">My Lots</span>
      <div className="w-full h-10 bg-slate-500">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-slate-900 font-bold">Lot</TableHead>
              <TableHead className="text-center text-slate-900 font-bold">
                Possible variant
              </TableHead>
              <TableHead className="text-center text-slate-900 font-bold">Status</TableHead>
              <TableHead className="text-center text-slate-900 font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <Suspense fallback={<div>Loading...</div>}>
            <TableBody className="w-full">
              {myLots.map((lot: ILot) => (
                <TableRow
                  key={lot.id as string}
                  className="cursor-pointer"
                  onClick={() => handleLotClick(lot.id as string)}
                >
                  <TableCell className="text-center capitalize">{lot.name}</TableCell>
                  <TableCell className="text-center capitalize">{lot.exchangeOffer}</TableCell>
                  <TableCell className="text-center capitalize">
                    {lot?.Offers?.length === 0
                      ? 'Free to exchange'
                      : lot?.Offers && lot?.Offers[0]?.status}
                  </TableCell>
                  <TableCell className="text-center">
                    {lot.Offers && lot.Offers.length > 0 ? (
                      <Button
                        disabled
                        variant="secondary"
                        className="hover:bg-slate-900 hover:text-slate-200"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {lot.Offers && lot.Offers[0]?.status}
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        className="hover:bg-slate-900 hover:text-slate-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExchangeProposal(lot.id as string);
                        }}
                        disabled={proposals[lot.id as string] || false}
                      >
                        {proposals[lot.id as string] ? 'Proposal sent' : 'Offer for exchange'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Suspense>
        </Table>
      </div>
    </div>
  );
};

export default MyLots;
