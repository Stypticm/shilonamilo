'use client'

import OffersComponent from '@/app/components/OffersComponent'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay } from '@/components/ui/dialog'
import { Lot } from '@/lib/interfaces'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const DialogForOffers = ({ params }: { params: { id: string } }) => {
    const router = useRouter()

    const [modalOpen, setModalOpen] = useState(true)

    const closeModal = () => {
        setModalOpen(false)
        router.back()
    }

    const handleOnOpenChange = (open: boolean) => {
        if (!open) {
            closeModal()
            router.push(`/offers/${params.id}`)
        }
    }

    return (
        <Dialog open={modalOpen} onOpenChange={handleOnOpenChange}>
            <DialogOverlay className="bg-[#4E9A8D]">
                {/* <DialogContent className="sm:max-w-[425px]" style={{ background: '#605056' }}> */}
                <DialogContent className="sm:max-w-[425px] bg-[#4E9A8D]">
                    <OffersComponent />
                </DialogContent>
            </DialogOverlay>
        </Dialog>
    )
}

export default DialogForOffers