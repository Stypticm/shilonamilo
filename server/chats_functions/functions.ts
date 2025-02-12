import { getLotById } from '../../client/src/lib/features/server_requests/lots'
import { IChat } from '../../client/src/lib/interfaces'

export const addRating = async (
  role: 'owner' | 'participant',
  lotId: string,
  userId: string,
  rating: number,
  comment: string
) => {
  try {
    const existingFeedback = await prisma.feedback.findMany(
      {
        where: {
          lotId,
          userId,
          role: role,
        },
      }
    )

    if (existingFeedback.length > 0) {
      return { error: 'Feedback already exists' }
    }

    await prisma.feedback.create({
      data: {
        role,
        lotId,
        userId,
        rating,
        comment,
      },
    })

    return {
      succes: true,
      message: 'Thank you for your feedback',
    }
  } catch (error) {
    console.error('Error setting owner rating:', error)
    return { error: 'Failed to send feedback' }
  }
}

export type FeedbackCheckResult =
  | { success: true; message: string }
  | { success: false; message: string }

export const isFeedBackAdded = async (
  lotId: string,
  userId: string,
  role: 'owner' | 'participant'
) => {
  try {
    const feedback = await prisma.feedback.findMany({
      where: {
        lotId,
        userId,
        role,
      },
    })

    const result = {
      success: feedback.length > 0,
      message:
        feedback.length > 0
          ? 'Feedback already exists'
          : 'Thank you for your feedback',
    }

    return result
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return {
      success: false,
      message: 'Failed to fetch feedback',
    }
  }
}
