'use server';

import prisma from '../../prisma/db';
import { ILot } from '../../interfaces';

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
