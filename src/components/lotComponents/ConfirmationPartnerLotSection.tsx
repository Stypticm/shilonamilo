import { updateUserConfirmedStatus } from '@/lib/features/repositories/proposals';
import { Button } from '@/components/ui/button';
import React from 'react';

const ConfirmationPartnerLotSection = ({
  lotId,
  onStatusUpdate,
}: {
  lotId: string;
  onStatusUpdate: () => void;
}) => {
  const handleConfirmExchange = async () => {
    try {
      await updateUserConfirmedStatus(lotId, true);
      onStatusUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="flex justify-around items-center text-center m-5">
      <div className="items-top flex space-x-2 justify-center items-center">
        <Button
          variant="outline"
          size="lg"
          className="bg-[#b5ad0e]"
          onClick={handleConfirmExchange}
        >
          Confirm Exchange
        </Button>
        {/* <Button variant='outline' size='lg' className='bg-[#aa4b44]'>Decline Exchange</Button> */}
      </div>
    </section>
  );
};

export default ConfirmationPartnerLotSection;
