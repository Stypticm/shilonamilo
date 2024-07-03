'use server'

import { storage } from '@/lib/firebase/firebase';
import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma/db'
import { revalidatePath } from 'next/cache';

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
    const photoThingFile = formData.get('photoThingFile') as File;
    const photoThingURL = formData.get('photoThingURL') as string;

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

            if (photoThingFile) {
                if (photoThingFile && !currentPhotoURL) {
                    const mountainsRef = ref(storage, `${thingId}/${photoThingFile.name}`);
                    await uploadBytes(mountainsRef, photoThingFile);
                    photoURL = await getDownloadURL(mountainsRef);
                }
            } else if (photoThingURL) {
                try {
                    const response = await fetch(photoThingURL);
                    const blob = await response.blob();
                    const fileName = `externam-photo.${blob.type.split('/')[1]}`;
                    const urlRef = ref(storage, `${thingId}/${fileName}`);
                    await uploadBytes(urlRef, blob);
                    photoURL = await getDownloadURL(urlRef);
                } catch (error) {
                    console.log(error)
                    return { error: "Error uploading photo" };
                }
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
    const photoYouNeedURL = formData.get('photoYouNeedURL') as string;
    const photoYouNeedFile = formData.get('photoYouNeedFile') as File;

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

            if (photoYouNeedFile) {
                if (photoYouNeedFile && !currentPhotoYouNeed) {
                    const mountainsRef = ref(storage, `${thingId}/${photoYouNeedFile.name}`);
                    await uploadBytes(mountainsRef, photoYouNeedFile);
                    photoURL = await getDownloadURL(mountainsRef);
                }
            } else if (photoYouNeedURL) {
                try {
                    const response = await fetch(photoYouNeedURL);
                    const blob = await response.blob();
                    const fileExptension = photoYouNeedURL.split('.').pop();
                    const fileName = `externam-photo.${fileExptension}`;
                    const urlRef = ref(storage, `${thingId}/${fileName}`);
                    await uploadBytes(urlRef, blob as Blob);
                    photoURL = await getDownloadURL(urlRef);
                } catch (error) {
                    console.log(error)
                    return { error: "Error uploading photo" };
                }
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

    if (!country && !city) {
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

export async function addToFavorite(formData: FormData) {
    const thingId = formData.get('thingId') as string;
    const userId = formData.get('userId') as string;
    const pathName = formData.get('pathName') as string;

    try {
        await prisma.favorite.create({
            data: {
                thingid: thingId,
                userid: userId
            }
        })

    } catch (error) {
        console.log(error)
        return { error: "Error adding to favorite" };
    }
    revalidatePath(pathName);
}

export async function removeFromFavorite(formData: FormData) {
    const favoriteId = formData.get('favoriteId') as string;
    const userId = formData.get('userId') as string;
    const pathName = formData.get('pathName') as string;

    try {
        await prisma.favorite.delete({
            where: {
                id: favoriteId,
                userid: userId
            }
        })

    } catch (error) {
        console.log(error)
        return { error: "Error removing from favorite" };
    }
    revalidatePath(pathName);
}