'use server'

import { storage } from '@/lib/firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma/db'

export async function createNewThing({ userId }: { userId: string }) {
    const data = await prisma.thing.findFirst({
        where: {
            userid: userId
        },
        orderBy: {
            createdat: 'desc'
        }
    })

    console.log(data)

    if (data === null) {
        const data = await prisma.thing.create({
            data: {
                userid: userId,
            }
        })

        return redirect(`/create/${data.id}/structure`)
    } else if (!data.addedcategory && !data.addeddescription && !data.addedyouneed && !data.addedlocation) {
        return redirect(`/create/${data.id}/structure`)
    } else if (data.addedcategory && !data.addeddescription && !data.addedyouneed && !data.addedlocation) {
        return redirect(`/create/${data.id}/description`)
    } else if (data.addedcategory && data.addeddescription && !data.addedyouneed && !data.addedlocation) {
        return redirect(`/create/${data.id}/ineed`)
    } else if (data.addedcategory && data.addeddescription && data.addedyouneed && !data.addedlocation) {
        return redirect(`/create/${data.id}/location`)
    } else if (data.addedcategory && data.addeddescription && data.addedyouneed && data.addedlocation) {
        const data = await prisma.thing.create({
            data: {
                userid: userId
            }
        })
        return redirect(`/create/${data.id}/structure`)
    }
}

export async function createNewCategory(formData: FormData) {
    const categoryName = formData.get('categoryName')
    await prisma.categories.create(
        {
            data: {
                name: categoryName as string
            }
        }
    )
}

export async function createCategoryPage(formData: FormData) {
    const thingId = formData.get('thingId') as string
    const categoryName = formData.get('categoryName') as string

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

    return { success: true, redirect: true };
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
        } else if (currentName !== name || currentDescription !== description || currentPhotoURL) {
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
        }
    } catch (error) {
        console.log(error)
        return { error: "Error uploading photo" };
    }
}

export async function createWhatYouNeed(formData: FormData) {
    const thingId = formData.get('thingId') as string;
    const name = formData.get('name') as string;
    const photoYouNeed = formData.get('photoYouNeed') as File;

    if (!name) {
        return { error: "Name field must be filled" };
    }

    try {
        const currentData = await prisma.thing.findUnique({ where: { id: thingId } });

        const currentName = currentData?.youneed;
        const currentPhotoYouNeed = currentData?.photoyouneed;

        if (currentName === name && currentPhotoYouNeed) {
            return { success: true, text: "Nothing changed" };
        } else if (currentName !== name || currentPhotoYouNeed) {
            let photoURL = currentPhotoYouNeed;

            if (photoYouNeed && !currentPhotoYouNeed) {
                const mountainsRef = ref(storage, `${thingId}/${photoYouNeed.name}`);
                await uploadBytes(mountainsRef, photoYouNeed);
                photoURL = await getDownloadURL(mountainsRef);
            }

            await prisma.thing.update({
                where: {
                    id: thingId
                },
                data: {
                    youneed: name,
                    photoyouneed: photoURL,
                    addedyouneed: true
                }
            })
            return { success: true, redirect: true };
        }
    } catch (error) {
        console.log(error)
        return { error: "Error uploading photo" };
    }
}

export async function createLocation(formData: FormData) {
    const thingId = formData.get('thingId') as string;
    const country = formData.get('country') as string;
    const city = formData.get('city') as string;

    if (!country || !city) {
        return { error: "Country and city fields must be filled" };
    }

    try {
        const currentData = await prisma.thing.findUnique({ where: { id: thingId } });

        const currentCountry = currentData?.country;
        const currentCity = currentData?.city;

        if (currentCountry === country && currentCity === city) {
            return { success: true, text: "Nothing changed" };
        } else if (currentCountry !== country || currentCity !== city) {
            await prisma.thing.update({
                where: {
                    id: thingId
                },
                data: {
                    country: country,
                    city: city,
                    addedlocation: true
                }
            })
            return { success: true, redirect: true };
        }
    } catch (error) {
        console.log(error)
        return { error: "Wrong country or city" };
    }
}