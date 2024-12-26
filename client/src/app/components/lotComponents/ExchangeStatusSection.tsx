import React from 'react';
import ConfirmationOwnerLotSection from '@/app/components/lotComponents/ConfirmationOwnerLotSection';
import ConfirmationPartnerLotSection from '@/app/components/lotComponents/ConfirmationPartnerLotSection';
import { ILot } from '@/lib/interfaces';
import { Button } from '@/components/ui/button';

interface ExchangeStatusSectionProps {
  lot1: ILot | null;
  lot2: ILot | null;
  isOwner: boolean;
  fetchData: () => void;
  handleShowFeedback: (shouldShow: boolean) => void;
  isShowFeedback: boolean;
  chatId?: string;
}

const ExchangeStatusSection: React.FC<ExchangeStatusSectionProps> = ({
  lot1,
  lot2,
  isOwner,
  fetchData,
  handleShowFeedback,
  isShowFeedback,
  chatId,
}) => {
  const handleButtonClick = () => {
    handleShowFeedback(!isShowFeedback);
  };

  if (
    (lot1?.Proposal?.[0]?.isOwnerConfirmedExchange && lot2?.Offers?.[0]?.isUserConfirmedExchange) ||
    (lot2?.Proposal?.[0]?.isOwnerConfirmedExchange && lot1?.Offers?.[0]?.isUserConfirmedExchange)
  ) {
    return (
      <section className="flex justify-around items-center text-center">
        <span className="text-[#2f6183] font-serif text-3xl">Exchange confirmed</span>
        <Button variant="outline" size="lg" className="bg-[#b5ad0e]" onClick={handleButtonClick}>
          {' '}
          {isShowFeedback ? 'Show Lot' : 'Feedback'}
        </Button>
      </section>
    );
  } else if (isOwner) {
    return !lot1?.Proposal?.[0]?.isOwnerConfirmedExchange ||
      !lot2?.Offers?.[0]?.isOwnerConfirmedExchange ? (
      <ConfirmationOwnerLotSection
        proposalId={lot1?.Proposal?.[0].id as string}
        onStatusUpdate={fetchData}
        chatId={chatId}
        lotId={lot1?.id as string}
      />
    ) : (
      <section className="flex justify-around items-center text-center">
        <span className="text-[#2f6183] font-serif text-3xl">
          Waiting for confirmation from partner
        </span>
      </section>
    );
  } else {
    return lot1?.Offers?.[0]?.isOwnerConfirmedExchange ||
      lot2?.Proposal?.[0]?.isOwnerConfirmedExchange ? (
      <ConfirmationPartnerLotSection
        lotId={lot2?.Proposal?.[0]?.id as string}
        onStatusUpdate={fetchData}
      />
    ) : (
      <section className="flex justify-around items-center text-center">
        <span className="text-[#2f6183] font-serif text-3xl">
          Waiting for confirmation from lot owner
        </span>
      </section>
    );
  }
};

export default ExchangeStatusSection;
