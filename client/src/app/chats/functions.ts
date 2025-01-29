'use server';

import prisma from '@/lib/prisma/db';
import { getLotById } from '@/lib/features/server_requests/lots';
import { IChat } from '@/lib/interfaces';

export const getLotIds = async (chat: IChat, userId: string) => {
  const getLotOwner = async (lotId: string) => {
    try {
      const lot = await getLotById(lotId);
      return lot?.userId === userId;
    } catch (error) {
      console.error('Error fetching lot owner:', error);
      return false;
    }
  };

  const isLot1User = await getLotOwner(chat.lot1Id);
  const isLot2User = await getLotOwner(chat.lot2Id);

  let myLotId: string;
  let partnerLotId: string;

  if (isLot1User) {
    myLotId = chat.lot1Id;
    partnerLotId = chat.lot2Id;
  } else if (isLot2User) {
    myLotId = chat.lot2Id;
    partnerLotId = chat.lot1Id;
  } else {
    return { myLotId: null, partnerLotId: null };
  }

  return { myLotId, partnerLotId };
};

export const getLotOwner = async (lotId: string, userId: string): Promise<string | null> => {
  try {
    const proposal = await prisma.proposal.findFirst({
      where: {
        lotId,
        ownerIdOfTheLot: userId,
      },
    });

    if (!proposal) return null;

    return proposal.ownerIdOfTheLot;
  } catch (error) {
    console.error('Error fetching lot owner:', error);
    return null;
  }
};

export const addRating = async (
  role: 'owner' | 'participant',
  lotId: string,
  userId: string,
  rating: number,
  comment: string,
) => {
  try {
    const existingFeedback = await prisma.feedback.findMany({
      where: {
        lotId,
        userId,
        role: role,
      },
    });

    if (existingFeedback.length > 0) {
      return { error: 'Feedback already exists' };
    }

    await prisma.feedback.create({
      data: {
        role,
        lotId,
        userId,
        rating,
        comment,
      },
    });

    return {
      succes: true,
      message: 'Thank you for your feedback',
    };
  } catch (error) {
    console.error('Error setting owner rating:', error);
    return { error: 'Failed to send feedback' };
  }
};

export type FeedbackCheckResult =
  | { success: true; message: string }
  | { success: false; message: string };

export const isFeedBackAdded = async (
  lotId: string,
  userId: string,
  role: 'owner' | 'participant',
) => {
  try {
    const feedback = await prisma.feedback.findMany({
      where: {
        lotId,
        userId,
        role,
      },
    });

    const result = {
      success: feedback.length > 0,
      message: feedback.length > 0 ? 'Feedback already exists' : 'Thank you for your feedback',
    };

    return result;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return {
      success: false,
      message: 'Failed to fetch feedback',
    };
  }
};
