'use client';

import NoItems from '@/app/components/NoItems';
import { ILot, Proposal } from '@/lib/interfaces';
import { Suspense, useEffect, useState } from 'react';
import { getLotsWithOffers } from '../dataForOffers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { acceptProposal, declineProposal } from '@/lib/features/myStuff';
import { chatSocket } from '@/socket';
import { offChatCreated, onChatCreated } from '@/lib/features/websockets/chatHandler';

const OffersRoute = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const [acceptedLots, setAcceptedLots] = useState<ILot[]>([]);
  // const [isAccetped, setIsAccepted] = useState(false);

  const fetchAcceptedLots = async () => {
    try {
      const data = await getLotsWithOffers(params.id as string);
      setAcceptedLots(data as ILot[]);
    } catch (error) {
      console.error('Failed to fetch accepted lots:', error);
    }
  };

  useEffect(() => {
    fetchAcceptedLots();
  }, [acceptedLots.length]);

  useEffect(() => {
    onChatCreated((chatId: string) => {
      router.push(`/chats/${chatId}`);
    });

    return () => {
      offChatCreated();
    };
  }, []);

  const handleClick = (id: string) => {
    //router.push(`/offers/${id}/proposal`) - this is for the proposal modal
    router.push(`/lot/${id}`);
  };

  const handleChat = (
    e: React.FormEvent<HTMLFormElement>,
    myLotId: string,
    partnerLotId: string,
    user1Id: string,
    user2Id: string,
  ) => {
    e.stopPropagation();

    try {
      chatSocket.emit('createChat', {
        user1Id,
        user2Id,
        lot1Id: myLotId,
        lot2Id: partnerLotId,
      });
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleClickAccept = async (myLotId: string) => {
    // myLotId is the id of the offered lot
    await acceptProposal(myLotId);
    fetchAcceptedLots();
  };

  const handleClickDecline = (myLotId: string) => {
    // myLotId is the id of the offered lot
    declineProposal(myLotId);
    fetchAcceptedLots();
  };

  return acceptedLots.length > 0 ? (
    <div className="w-[75%] mx-auto">
      <span className="flex justify-center items-center mb-5">Offered Lots</span>
      <Table className="w-[95%] h-full mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center text-slate-900 font-bold bg-[#4A5C6A]">
              My Lot
            </TableHead>
            <TableHead className="text-center text-slate-900 font-bold bg-[#4A5C6A]">
              Offered lot
            </TableHead>
            <TableHead className="text-center text-slate-900 font-bold bg-[#4A5C6A]">
              Offer status
            </TableHead>
            <TableHead className="text-center text-slate-900 font-bold bg-[#4A5C6A]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <Suspense fallback={<div>Loading...</div>}></Suspense>

        <TableBody>
          {acceptedLots.map((lot: ILot) =>
            lot.Proposal?.map((proposal: Proposal, index: number) => (
              <TableRow
                key={proposal.id}
                onClick={() => handleClick(proposal?.offeredLot?.id as string)}
                className="cursor-pointer"
              >
                {index === 0 && (
                  <TableCell
                    rowSpan={lot?.Proposal?.length}
                    className="text-center capitalize font-bold bg-[#4A5C6A] border-b border-r cursor-default"
                  >
                    {lot.name}
                  </TableCell>
                )}
                <TableCell className="text-center capitalize border-b">
                  {proposal?.offeredLot?.name}
                </TableCell>
                <TableCell className="text-center capitalize border-b">
                  {proposal?.status}
                </TableCell>
                <TableCell className="text-center capitalize border-b">
                  {proposal?.status === 'pending' && (
                    <section className="flex justify-around items-center gap-2">
                      <Button
                        variant="secondary"
                        className="hover:bg-slate-900 hover:text-slate-200 w-24"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClickAccept(proposal?.id as string);
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="secondary"
                        className="hover:bg-slate-900 hover:text-slate-200 w-24"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClickDecline(proposal?.id as string);
                        }}
                      >
                        Reject
                      </Button>
                    </section>
                  )}
                  {proposal?.status === 'accepted' && (
                    <Button
                      variant="secondary"
                      className="hover:bg-slate-900 hover:text-slate-200 w-24"
                      onClick={(e: object) =>
                        handleChat(
                          e as React.FormEvent<HTMLFormElement>,
                          proposal?.lotId as string,
                          proposal?.offeredLot?.id as string,
                          proposal?.ownerIdOfTheLot as string,
                          proposal?.userIdOfferedLot as string,
                        )
                      }
                    >
                      Chat
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )),
          )}
        </TableBody>
      </Table>
    </div>
  ) : (
    <>
      <section className="w-[95%] h-full">
        {acceptedLots.length === 0 && (
          <>
            <NoItems
              name="Hey you dont have any accepted lots in your list"
              description="Please accept a lot to see them here..."
            />
          </>
        )}
      </section>
    </>
  );
};

export default OffersRoute;
