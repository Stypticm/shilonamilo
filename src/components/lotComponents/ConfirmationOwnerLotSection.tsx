import React from 'react';
import { declineTheOffer, updateOwnerConfirmedStatus } from '@/lib/features/repositories/proposals';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const ConfirmationOwnerLotSection = ({
  proposalId,
  onStatusUpdate,
  chatId,
  lotId,
}: {
  proposalId: string;
  onStatusUpdate: () => void;
  chatId?: string;
  lotId: string;
}) => {
  const router = useRouter();

  const handleConfirmExchange = async () => {
    try {
      await updateOwnerConfirmedStatus(proposalId, true);
      onStatusUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeclineExchange = async () => {
    try {
      const result = await declineTheOffer(lotId, chatId as string);
      if (result?.redirect) {
        router.push(`/`);
      }
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
        <Button
          variant="outline"
          size="lg"
          className="bg-[#aa4b44]"
          onClick={handleDeclineExchange}
        >
          Decline Exchange
        </Button>
      </div>
    </section>
  );
};

export default ConfirmationOwnerLotSection;
