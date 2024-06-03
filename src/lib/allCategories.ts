'use server'

import { pool } from './db'

export const allCategories = async () => {
    const data = await pool.query('SELECT * FROM "Categories"')

    return data.rows
}