import { Server, Socket } from 'socket.io';
import { addProposal } from '@/lib/features/repositories/proposals';

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
