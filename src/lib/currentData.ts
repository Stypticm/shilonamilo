'use server'

import { pool } from './db'

export const allCategories = async () => {
    const data = await pool.query('SELECT * FROM "Categories"')
    return data.rows
}

export const choosedCategory = async (id: string) => {
    const data = await pool.query('SELECT category FROM "Thing" WHERE id = $1', [id]);
    return data.rows[0].category
}

export const choosedDescription = async (id: string) => {
    const data = await pool.query('SELECT photothing, name, description FROM "Thing" WHERE id = $1', [id]);
    return data.rows[0]
}