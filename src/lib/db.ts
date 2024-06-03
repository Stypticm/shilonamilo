import { Pool } from 'pg';

export const pool = new Pool({
    user: process.env.NEXT_PUBLIC_PG_USER || 'user',
    host: process.env.NEXT_PUBLIC_PG_HOST || 'localhost',
    database: process.env.NEXT_PUBLIC_PG_DATABASE || 'postgres',
    password: process.env.NEXT_PUBLIC_PG_PASSWORD || 'user',
    port: Number(process.env.NEXT_PUBLIC_PG_PORT) || 5432,
})