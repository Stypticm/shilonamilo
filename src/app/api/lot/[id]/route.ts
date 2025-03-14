import prisma from '@/lib/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();

  try {
    const data = await prisma.lot.findUnique({
      where: {
        id: id as string,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        category: true,
        country: true,
        city: true,
        photolot: true,
        exchangeOffer: true,
        Favorite: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json({ message: 'Lot not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching lot:', error);
    return NextResponse.json({ message: 'Error fetching lot' }, { status: 500 });
  }
}
