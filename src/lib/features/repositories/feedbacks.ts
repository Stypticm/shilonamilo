'use server';

import prisma from '@/lib/prisma/client';

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
