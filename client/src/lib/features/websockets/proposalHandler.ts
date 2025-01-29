import { Server, Socket } from 'socket.io';
import { proposalSocket } from '../../../socket';
import { addProposal } from '../server_requests/lots';

export const initializeProposalNamespace = (io: Server) => {
  const proposalNamespace = io.of('/proposal');

  proposalNamespace.on('connection', (socket: Socket) => {
    console.log(`${socket.id} connected to proposal namespace`);

    socket.on('joinRoom', ({ userId }) => {
      console.log(`User joined proposal room: ${userId}`);
      socket.join(userId);
    });

    socket.on('addProposal', async ({ lotId, myLotId }) => {
      try {
        const proposal = await addProposal(lotId, myLotId);

        // console.log(`Owner: ${proposal?.ownerIdOfTheLot}`);
        // console.log(`User: ${proposal?.userIdOfferedLot}`);
        // console.log(`Proposal: ${JSON.stringify(proposal)}`);

        // // Notificate the owner of the lot
        proposalNamespace
          .to(proposal?.ownerIdOfTheLot as string)
          .emit('proposalReceived', proposal);

        // // Notificate the other user
        proposalNamespace
          .to(proposal?.userIdOfferedLot as string)
          .emit('proposalReceived', proposal);

        proposalNamespace.to(proposal?.ownerIdOfTheLot as string).emit('newNotification', {
          type: 'proposal',
          data: proposal,
        });
      } catch (error) {
        console.error('Error adding proposal:', error);
      }
    });

    socket.on('subscribeToNotifications', (userId) => {
      console.log(`User subscribed to notifications: ${userId}`);
      socket.join(userId);
    });

    socket.on('disconect', ({ userId }) => {
      console.log('Client disconnected from notifications namespace');
      socket.leave(userId);
    });
  });
};

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
