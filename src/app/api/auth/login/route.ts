import { pool } from '@/lib/db';
import { adminAuth } from '@/lib/firebase/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        const body = await req.json();

        if (!authHeader) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const decodedToken = await adminAuth.verifyIdToken(token);

        const { uid, name, picture } = decodedToken

        const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [uid])

        let dbUser = result.rows[0]

        if (!dbUser) {
            const insertResult = await pool.query(
                'INSERT INTO "User" (id, firstname, email, photourl) VALUES ($1, $2, $3, $4) RETURNING *',
                [uid, name, body.email,
                    picture || 'https://i.pinimg.com/474x/f1/da/a7/f1daa70c9e3343cebd66ac2342d5be3f.jpg'
                ]
            )
        } 

        return NextResponse.redirect('http://localhost:3000');

    } catch (error) {
        console.error('Error in /api/auth/login:', error);
        return NextResponse.json({ error: 'Authentication failed', message: error }, { status: 500 });
    }
}