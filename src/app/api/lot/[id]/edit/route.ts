import prisma from '@/lib/prisma/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    const id = req.nextUrl.pathname.split('/').pop();
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await prisma.lot.findUnique({
            where: {
                id: id as string
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
                        id: true
                    }
                }
            }
        });

        if (!data) {
            return NextResponse.json({ message: 'Lot not found' }, { status: 404 });
        }

        if (data.userId !== userId) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching lot:', error);
        return NextResponse.json({ message: 'Error fetching lot' }, { status: 500 });
    }
}
