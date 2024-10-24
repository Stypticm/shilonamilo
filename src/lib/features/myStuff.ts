'use server';

import prisma from '../prisma/db';
import { ILot } from '../interfaces';

export const getMyStuff = (id: string) => {
  const data = prisma.lot.findMany({
    where: {
      userId: id,
      AND: [
        { name: { not: null } },
        { category: { not: null } },
        { description: { not: null } },
        { exchangeOffer: { not: null } },
        { photolot: { not: null } },
        { country: { not: null } },
        { city: { not: null } },
      ],
    },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      exchangeOffer: true,
      photolot: true,
      country: true,
      city: true,
      createdAt: true,
      Proposal: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  return data;
};

export const findLotByUserIdAndLotId = async (userId: string, lotId: string) => {
  try {
    const data = await prisma.lot.findFirst({
      where: {
        id: lotId,
        userId: userId,
      },
    });

    return data !== null;
  } catch (error) {
    console.error('Error finding lot:', error);
    return false;
  }
};

export const deleteLot = async (id: string) => {
  try {
    await prisma.lot.delete({
      where: {
        id: id,
      },
    });

    return true;
  } catch (error) {
    console.error('Error deleting thing:', error);
  }
};

export const getLotById = async (lotId: string): Promise<ILot | null> => {
  try {
    const lot = await prisma.lot.findUnique({
      where: {
        id: lotId,
      },
      include: {
        Proposal: true,
        Offers: true,
      },
    });

    return lot as ILot;
  } catch (error) {
    console.error('Error fetching thing:', error);
    return null;
  }
};

export const addProposal = async (lotId: string, myLotId: string) => {
  let logginedUserId;
  let itemUserId;

  try {
    logginedUserId = await prisma.lot.findUnique({
      where: {
        id: myLotId,
      },
    });
    itemUserId = await prisma.lot.findUnique({
      where: {
        id: lotId,
      },
    });
  } catch (error) {
    console.error('Error finding user:', error);
  }

  try {
    const data = await prisma.proposal.create({
      data: {
        lotId,
        offeredLotId: myLotId,
        status: 'pending',
        ownerIdOfTheLot: itemUserId?.userId,
        userIdOfferedLot: logginedUserId?.userId,
      },
    });

    await prisma.lot.update({
      where: {
        id: lotId,
      },
      data: {
        Proposal: {
          connect: {
            id: data.id,
          },
        },
      },
    });

    return data;
  } catch (error) {
    console.error('Error adding proposal:', error);
  }
};

export const getLotsById = async (userId: string) => {
  try {
    const lots = await prisma.lot.findMany({
      where: {
        userId: userId,
        AND: [
          { name: { not: null } },
          { category: { not: null } },
          { description: { not: null } },
          { exchangeOffer: { not: null } },
          { photolot: { not: null } },
          { country: { not: null } },
          { city: { not: null } },
        ],
      },
      include: {
        Proposal: true,
        Offers: true,
      },
    });

    const lotsWithoutProposals = lots.filter((lot) => {
      return lot.Offers.length === 0;
    });

    return lotsWithoutProposals;
  } catch (error) {
    console.error('Error fetching lots by userId', error);
  }
};

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
