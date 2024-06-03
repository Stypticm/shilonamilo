'use server'

import { allCategories } from '@/lib/allCategories';
import { pool } from '@/lib/db'
import { Thing } from '@/lib/interfaces';
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';

export async function createNewThing({ userId }: { userId: string }) {
    const data = await pool.query('SELECT * FROM "Thing" WHERE userid = $1', [userId])

    if (data.rows[0] === undefined) {
        const newId = uuidv4();
        const data = await pool.query('INSERT INTO "Thing" (id, userid) VALUES ($1, $2) RETURNING *', [newId, userId])

        return redirect(`/create/${data.rows[0].id}/structure`)
    } else if (!data.rows[0].addedCategory && !data.rows[0].addedDescription && !data.rows[0].addedLocation) {
        return redirect(`/create/${data.rows[0].id}/structure`)
    } else if (data.rows[0].addedCategory && !data.rows[0].addedDescription) {
        return redirect(`/create/${data.rows[0].id}/description`)
    }
}

export async function createCategoryPage(formData: FormData) {
    const thingId = formData.get('thingId')
    const categoryName = formData.get('categoryName')

    console.log(thingId, categoryName)
}

export async function createNewCategory(formData: FormData) {
    const categoryName = formData.get('categoryName')
    const thingId = formData.get('thingId')
    await pool.query('INSERT INTO "Categories" (name) VALUES ($1)', [categoryName])
    
    
    return { success: true }
    // return redirect(`/create/${thingId}/structure`)
}