'use server';

import { IRating } from '@/lib/interfaces';
import prisma from '@/lib/prisma/client';

export const addRating = async (data: IRating) => {
  try {
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        lotId: data.lotId,
        userId: data.userId,
        role: data.role,
      },
    });

    if (existingFeedback) {
      return { error: 'Feedback already exists' };
    }

    const newFeedback = await prisma.feedback.create({
      data: {
        role: data.role,
        lotId: data.lotId,
        userId: data.userId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    return {
      success: true,
      message: 'Thank you for your feedback',
      feedback: newFeedback,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: `Failed to add rating: ${error.message}` };
    }
    return { error: 'An unknown error occurred' };
  }
};
