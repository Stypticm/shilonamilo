'use client'

import { acceptProposal, declineProposal, getReceivedProposals } from '@/lib/features/myStuff';
import { ILot, Proposal } from '@/lib/interfaces';
import React, { Suspense, useEffect, useState } from 'react'
import { User as CurrentUser } from '@/lib/interfaces'
import { initAuthState } from '@/lib/firebase/auth/authInitialState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const ReceivedProposals = ({ lotId }: { lotId: string }) => {

    const router = useRouter()
    const [receivedProposals, setReceivedProposals] = useState<Proposal[]>([]);

    const [user, setUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
        const unsubscribe = initAuthState(setUser);
        return () => unsubscribe();
    }, []);

    const fetchReceivedProposals = async () => {
        if (user?.uid) {
            const data = await getReceivedProposals(lotId);
            console.log(data)
            setReceivedProposals(data as Proposal[]);
        }
    };


    useEffect(() => {
        if (user) {
            fetchReceivedProposals();
        }
    }, [user]);

    const handleLotClick = (id: string) => {
        router.push(`/lot/${id}`)
    }

    const handleClickAccept = (myLotId: string) => {
        acceptProposal(myLotId)
        fetchReceivedProposals();
    }

    const handleClickDecline = (myLotId: string) => {
        declineProposal(myLotId)
        fetchReceivedProposals();
    }

    const linkToOffers = () => {
        router.push(`/offers/${user?.uid}`)
    }

    return (
        receivedProposals.length > 0 ?
            <div className='border-t border-slate-800 w-full'>
                <span className='flex justify-center items-center mb-5'>Received Proposals</span>
                <div className='w-full h-10 bg-slate-500'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='text-center text-slate-900 font-bold'>Item for exchange</TableHead>
                                <TableHead className='text-center text-slate-900 font-bold'>Status</TableHead>
                                <TableHead className='text-center text-slate-900 font-bold'>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <Suspense fallback={<div>Loading...</div>}>

                            <TableBody className='w-full'>
                                {
                                    receivedProposals.map((receivedProposal: Proposal) => (
                                        <TableRow key={receivedProposal.id} className='cursor-pointer' onClick={() => handleLotClick(receivedProposal.offeredLotId as string)}>
                                            <TableCell className='text-center capitalize'>{receivedProposal.offeredLot?.name}</TableCell>
                                            <TableCell className='text-center capitalize'>{receivedProposal.status}</TableCell>

                                            <TableCell className='text-center'>
                                                {
                                                    receivedProposal.status === 'pending' && (
                                                        <section className='flex justify-around items-center gap-2'>
                                                            <Button
                                                                variant='secondary'
                                                                className='hover:bg-slate-900 hover:text-slate-200 w-24'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleClickAccept(receivedProposal.id);
                                                                }}>
                                                                Accept
                                                            </Button>
                                                            <Button
                                                                variant='secondary'
                                                                className='hover:bg-slate-900 hover:text-slate-200 w-24'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleClickDecline(receivedProposal.id);
                                                                }}>
                                                                Reject
                                                            </Button>
                                                        </section>
                                                    )
                                                }
                                                {
                                                    receivedProposal.status === 'accepted' && (
                                                        <Button
                                                            variant='secondary'
                                                            className='hover:bg-slate-900 hover:text-slate-200 w-24'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                linkToOffers();
                                                            }}>
                                                            Check offers
                                                        </Button>
                                                    )
                                                }
                                                {
                                                    receivedProposal.status === 'declined' && (
                                                        <Button
                                                            disabled
                                                            variant='secondary'
                                                            className='hover:bg-slate-900 hover:text-slate-200 w-24'
                                                        >
                                                            Declined
                                                        </Button>
                                                    )
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>

                        </Suspense>
                    </Table>
                </div>
            </div> : null
    )
}

export default ReceivedProposals