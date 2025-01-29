'use server';

import prisma from '../../prisma/db';

export async function updateOwnerConfirmedStatus(proposalId: string, confirmed: boolean) {
  try {
    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        isOwnerConfirmedExchange: confirmed,
      },
    });

    return updatedProposal;
  } catch (error) {
    console.error('Error updating proposal status:', error);
    throw new Error('Could not update proposal status');
  }
}

export async function updateUserConfirmedStatus(proposalId: string, confirmed: boolean) {
  try {
    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        isUserConfirmedExchange: confirmed,
      },
    });
    return updatedProposal;
  } catch (error) {
    console.error('Error updating proposal status:', error);
    throw new Error('Could not update proposal status');
  }
}

export async function declineTheOffer(lotId: string, chatId: string) {
  try {
    await prisma.proposal.updateMany({
      where: { lotId },
      data: {
        status: 'pending',
      },
    });

    await prisma.message.deleteMany({
      where: { chatId },
    });

    await prisma.chat.delete({
      where: { id: chatId },
    });

    return { success: true, redirect: true };
  } catch (error) {
    console.error('Error updating proposal status:', error);
    throw new Error(`Could not update proposal status: ${error}`);
  }
}

export const getReceivedProposals = async (lotId: string) => {
  try {
    const proposals = await prisma.proposal.findMany({
      where: {
        lotId,
      },
      include: {
        offeredLot: true,
      },
    });

    return proposals;
  } catch (error) {
    console.error('Error fetching proposals for lot:', error);
    throw error;
  }
};

export const acceptProposal = async (proposalId: string) => {
  try {
    await prisma.proposal.update({
      where: {
        id: proposalId,
      },
      data: {
        status: 'accepted',
      },
    });

    await prisma.proposal.updateMany({
      where: {
        id: {
          not: proposalId,
        },
      },
      data: {
        status: 'declined',
      },
    });
  } catch (error) {
    console.error('Error accepting proposal:', error);
  }
};

export const declineProposal = async (proposalId: string) => {
  try {
    await prisma.proposal.update({
      where: {
        id: proposalId,
      },
      data: {
        status: 'declined',
      },
    });
  } catch (error) {
    console.error('Error declining proposal:', error);
  }
};
