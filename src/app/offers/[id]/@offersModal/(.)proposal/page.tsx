'use client';

import OffersComponent from '@/components/OffersComponent';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const DialogForOffers = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const { id } = React.use(params);

  const [modalOpen, setModalOpen] = useState(true);

  const closeModal = () => {
    setModalOpen(false);
    router.back();
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
      router.push(`/offers/${id}`);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleOnOpenChange}>
      <DialogOverlay className="bg-[#4E9A8D]">
        {/* <DialogContent className="sm:max-w-[425px]" style={{ background: '#605056' }}> */}
        <DialogContent className="sm:max-w-[425px] bg-[#4E9A8D]">
          <OffersComponent />
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default DialogForOffers;
