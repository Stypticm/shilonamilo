'use server'

import { storage } from '@/lib/firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma/db'

export async function createNewThing({ userId }: { userId: string }) {
    const data = await prisma.thing.findFirst({ where: { userid: userId } })
    const newId = uuidv4();

    if (data === null) {
        const data = await prisma.thing.create({ data: { id: newId, userid: userId } })

        return redirect(`/create/${data.id}/structure`)
    } else if (!data.addedcategory && !data.addeddescription && !data.addedlocation) {
        return redirect(`/create/${data.id}/structure`)
    } else if (data.addedcategory && !data.addeddescription) {
        return redirect(`/create/${data.id}/description`)
    }
}

export async function createNewCategory(formData: FormData) {
    const categoryName = formData.get('categoryName')
    await prisma.thing.update(
        {
            where: {
                id: formData.get('thingId') as string
            },
            data: {
                category: categoryName as string
            }
        }
    )
}

export async function createCategoryPage(formData: FormData) {
    const thingId = formData.get('thingId') as string
    const categoryName = formData.get('categoryName') as string

    try {
        const data = await prisma.thing.findUnique(
            {
                where:
                    { id: thingId }
            }
        );
        if (!data) return { success: false, error: "Thing not found" };

        if (data.category === categoryName) return { success: false, error: "Category already added", categoryName: data.category };

        await prisma.thing.update(
            {
                where: {
                    id: thingId
                },
                data: {
                    category: categoryName,
                    addedcategory: true
                }
            }
        )

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
        const currentData = await prisma.thing.findUnique({ where: { id: thingId } });

            
        const currentName = currentData?.name;
        const currentDescription = currentData?.description;
        const currentPhotoURL = currentData?.photothing;

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

        await prisma.thing.update({
            where: {
                id: thingId
            },
            data: {
                name: name,
                description: description,
                photothing: photoURL,
                addeddescription: true
            }
        })

        return { success: true, redirect: true };
    } catch (error) {
        console.log(error)
        return { error: "Error uploading photo" };
    }
}