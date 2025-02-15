import { proposalSocket } from '@/lib/socket';

export const joinRoom = (userId: string) => {
  proposalSocket.emit('joinRoom', { userId });
};

export const onSendProposal = (lotId: string, myLotId: string) => {
  proposalSocket.emit('addProposal', {
    lotId,
    myLotId,
  });
};

export const onProposalReceived = (callback: (data: any) => void) => {
  proposalSocket.on('proposalReceived', (data: any) => {
    console.log('data onProposalReceived: ', data);
    callback(data);
  });
};

export const offProposal = () => {
  proposalSocket.off('proposalReceived');
};

export const offProposalNotification = (userId: string) => {
  proposalSocket.emit('disconect', { userId });
};
