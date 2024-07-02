import prisma from '@/lib/prisma/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    const id = req.nextUrl.pathname.split('/').pop();

    try {
        const data = await prisma.thing.findUnique({
            where: {
                id: id as string
            },
            select: {
                id: true,
                userid: true,
                name: true,
                description: true,
                category: true,
                country: true,
                city: true,
                photothing: true,
                youneed: true,
                photoyouneed: true
            }
        });

        if (!data) {
            return NextResponse.json({ message: 'Thing not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching thing:', error);
        return NextResponse.json({ message: 'Error fetching thing' }, { status: 500 });
    }
}
