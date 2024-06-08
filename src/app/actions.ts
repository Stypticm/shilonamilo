'use server'

import { toast } from '@/components/ui/use-toast';
import { allCategories } from '@/lib/currentData';
import { pool } from '@/lib/db'
import { storage } from '@/lib/firebase/firebase';
import { Thing } from '@/lib/interfaces';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';

export async function createNewThing({ userId }: { userId: string }) {
    const data = await pool.query('SELECT * FROM "Thing" WHERE userid = $1', [userId])
    const newId = uuidv4();

    if (data.rows[0] === undefined) {
        const data = await pool.query('INSERT INTO "Thing" (id, userid) VALUES ($1, $2) RETURNING *', [newId, userId])

        return redirect(`/create/${data.rows[0].id}/structure`)
    } else if (!data.rows[0].addedCategory && !data.rows[0].addedDescription && !data.rows[0].addedLocation) {
        return redirect(`/create/${data.rows[0].id}/structure`)
    } else if (data.rows[0].addedCategory && !data.rows[0].addedDescription) {
        return redirect(`/create/${data.rows[0].id}/description`)
    }
}

export async function createNewCategory(formData: FormData) {
    const categoryName = formData.get('categoryName')
    await pool.query('INSERT INTO "Categories" (name) VALUES ($1)', [categoryName])
}

export async function createCategoryPage(formData: FormData) {
    const thingId = formData.get('thingId') as string
    const categoryName = formData.get('categoryName') as string

    try {
        const data = await pool.query('SELECT category FROM "Thing" WHERE id = $1', [thingId]);

        if (data.rows.length === 0) return { success: false, error: "Thing not found" };

        if (data.rows[0].category !== null) return { success: false, error: "Category already added", categoryName: data.rows[0].category };

        await pool.query(
            'UPDATE "Thing" SET category = $2, addedcategory = $3 WHERE id = $1 RETURNING *',
            [thingId, categoryName, true]
        );

        return redirect(`/create/${thingId}/description`);
    } catch (error) {
        console.error('Error updating category:', error);
        return {
            success: false,
            error: "An error occurred while adding the category"
        };
    }
}

export async function createDescription(formData: FormData) {
    const thingId = formData.get('thingId') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const photoThing = formData.get('photoThing') as File;

    if (!name || !description) {
        return { error: "Name and description fields must be filled" };
    }

    try {
        const currentData = await pool.query('SELECT name, description, photothing FROM "Thing" WHERE id = $1', [thingId]);

        const currentName = currentData.rows[0]?.name;
        const currentDescription = currentData.rows[0]?.description;
        const currentPhotoURL = currentData.rows[0]?.photothing;

        if (currentName === name && currentDescription === description && currentPhotoURL) {
            return { success: true, text: "Nothing changed" };
        } else if (currentName && currentDescription && currentPhotoURL) {
            return { success: true, text: "All fields already filled" };
        }

        let photoURL = currentPhotoURL;

        if (photoThing && !currentPhotoURL) {
            const mountainsRef = ref(storage, `${thingId}/${photoThing.name}`);
            await uploadBytes(mountainsRef, photoThing);
            photoURL = await getDownloadURL(mountainsRef);
        }
    
        await pool.query(
            'UPDATE "Thing" SET name = $2, description = $3, photothing = $4, addeddescription = $5 WHERE id = $1 RETURNING *',
            [thingId, name, description, photoURL, true]
        );

        return { success: true, redirect: true };
    } catch (error) {
        console.log(error)
        return { error: "Error uploading photo" };
    }
}