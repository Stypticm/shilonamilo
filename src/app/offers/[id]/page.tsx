'use client'

import NoItems from '@/app/components/NoItems'
import { Lot, Proposal } from '@/lib/interfaces'
import { FormEvent, Suspense, useEffect, useState } from 'react'
import { getLotsWithOffers } from '../dataForOffers'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { acceptProposal, declineProposal } from '@/lib/features/myStuff'
import { createChat } from '@/app/chats/chatActions'

const OffersRoute = ({ params }: { params: { id: string } }) => {

    const router = useRouter()

    const [acceptedLots, setAcceptedLots] = useState<Lot[]>([])
    const [isAccetped, setIsAccepted] = useState(false)

    const fetchAcceptedLots = async () => {
        try {
            const data = await getLotsWithOffers(params.id as string)
            console.log(data)
            setAcceptedLots(data as Lot[])
        } catch (error) {
            console.error('Failed to fetch accepted lots:', error)
        }
    }

    useEffect(() => {
        fetchAcceptedLots()
    }, [acceptedLots.length])

    const handleClick = (id: string) => {
        //router.push(`/offers/${id}/proposal`) - this is for the proposal modal
        router.push(`/lot/${id}`)
    }

    const handleChat = async (e: React.FormEvent<HTMLFormElement>, myLotId: string, partnerLotId: string) => {
        e.stopPropagation()
        console.log(myLotId, partnerLotId, params.id)

        try {
            const chat = await createChat(myLotId, partnerLotId, params.id)
            if (chat?.id) {
                router.push(`/chats/${chat.id}`)
            } else {
                console.error('Chat Id not found')
            }
        } catch (error) {
            console.error('Error creating chat:', error)
        }
    }

    const handleClickAccept = async (myLotId: string) => {
        // myLotId is the id of the offered lot
        await acceptProposal(myLotId)
        fetchAcceptedLots()
    }

    const handleClickDecline = (myLotId: string) => {
        // myLotId is the id of the offered lot
        declineProposal(myLotId)
        fetchAcceptedLots()
    }

    return (
        acceptedLots.length > 0 ?
            <div className='w-[75%] mx-auto'>
                <span className='flex justify-center items-center mb-5'>Offered Lots</span>
                <Table className='w-[95%] h-full mx-auto'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-center text-slate-900 font-bold bg-[#4A5C6A]'>My Lot</TableHead>
                            <TableHead className='text-center text-slate-900 font-bold bg-[#4A5C6A]'>Offered lot</TableHead>
                            <TableHead className='text-center text-slate-900 font-bold bg-[#4A5C6A]'>Offer status</TableHead>
                            <TableHead className='text-center text-slate-900 font-bold bg-[#4A5C6A]'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <Suspense fallback={<div>Loading...</div>}></Suspense>


                    <TableBody>
                        {
                            acceptedLots.map((lot: Lot) => (
                                lot.Proposal?.map((proposal: Proposal, index: number) => (
                                    <TableRow key={proposal.id} onClick={() => handleClick(proposal?.offeredLot?.id as string)} className='cursor-pointer'>
                                        {index === 0 && (
                                            <TableCell rowSpan={lot?.Proposal?.length} className='text-center capitalize font-bold bg-[#4A5C6A] border-b border-r cursor-default'>
                                                {lot.name}
                                            </TableCell>
                                        )}
                                        <TableCell className='text-center capitalize border-b'>{proposal?.offeredLot?.name}</TableCell>
                                        <TableCell className='text-center capitalize border-b'>{proposal?.status}</TableCell>
                                        <TableCell className='text-center capitalize border-b'>
                                            {
                                                proposal?.status === 'pending' && (
                                                    <section className='flex justify-around items-center gap-2'>
                                                        <Button
                                                            variant='secondary'
                                                            className='hover:bg-slate-900 hover:text-slate-200 w-24'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleClickAccept(proposal?.id as string);
                                                            }}>
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            variant='secondary'
                                                            className='hover:bg-slate-900 hover:text-slate-200 w-24'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleClickDecline(proposal?.id as string);
                                                            }}>
                                                            Reject
                                                        </Button>
                                                    </section>
                                                )
                                            }
                                            {
                                                proposal?.status === 'accepted' && (
                                                    <Button
                                                        variant='secondary'
                                                        className='hover:bg-slate-900 hover:text-slate-200 w-24'
                                                        onClick={(e: any) => handleChat(e as React.FormEvent<HTMLFormElement>, proposal?.lotId as string, proposal?.offeredLot?.id as string)}>
                                                        Chat
                                                    </Button>
                                                )
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            ))
                        }
                    </TableBody>

                </Table>
            </div>
            :
            <>
                <section className='w-[95%] h-full'>
                    {acceptedLots.length === 0 && (
                        <>
                            <NoItems
                                name='Hey you dont have any accepted lots in your list'
                                description='Please accept a lot to see them here...'
                            />
                        </>
                    )}
                </section>
            </>
    )
}

export default OffersRoute