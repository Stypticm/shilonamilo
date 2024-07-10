'use server'

import { storage } from '@/lib/firebase/firebase';
import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma/db'
import { revalidatePath } from 'next/cache';

export async function createNewLot({ userId }: { userId: string }) {
    const data = await prisma.lot.findFirst({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    if (data === null) {
        const data = await prisma.lot.create({
            data: {
                userId: userId,
            }
        })

        return redirect(`/create/${data.id}/structure`)
    } else if (!data.addedcategory && !data.addeddescription && !data.addedlocation) {
        return redirect(`/create/${data.id}/structure`)
    } else if (data.addedcategory && !data.addeddescription && !data.addedlocation) {
        return redirect(`/create/${data.id}/description`)
    } else if (!data.addedcategory && data.addeddescription && !data.addedlocation) {
        return redirect(`/create/${data.id}/location`)
    } else if (data.addedcategory && data.addeddescription && data.addedlocation) {
        const data = await prisma.lot.create({
            data: {
                userId: userId
            }
        })
        return redirect(`/create/${data.id}/structure`)
    }
}

export async function createNewCategory(formData: FormData) {
    const categoryName = formData.get('categoryName')
    await prisma.category.create(
        {
            data: {
                name: categoryName as string
            }
        }
    )
}

export async function createCategoryPage(formData: FormData) {
    const lotId = formData.get('lotId') as string
    const categoryName = formData.get('categoryName') as string

    await prisma.lot.update(
        {
            where: {
                id: lotId
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
    const lotId = formData.get('lotId') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const photoLotFile = formData.get('photoLotFile') as File;
    const photoLotURL = formData.get('photoLotURL') as string;
    const exchange = formData.get('exchange') as string;

    if (!name || !description) {
        return { error: "Name and description fields must be filled" };
    }

    try {
        const currentData = await prisma.lot.findUnique({ where: { id: lotId } });

        const currentName = currentData?.name;
        const currentDescription = currentData?.description;
        const currentPhotoURL = currentData?.photolot;
        const currentExchangeOffer = currentData?.exchangeOffer;

        if (currentName === name && currentDescription === description && currentPhotoURL === currentPhotoURL && currentExchangeOffer === exchange) {
            return { success: true, text: "Nothing changed" };
        } else if (currentName !== name || currentDescription !== description || currentPhotoURL !== currentPhotoURL || currentExchangeOffer !== exchange) {
            let photoURL = currentPhotoURL;

            if (photoLotFile) {
                if (photoLotFile && !currentPhotoURL) {
                    const mountainsRef = ref(storage, `${lotId}/${photoLotFile.name}`);
                    await uploadBytes(mountainsRef, photoLotFile);
                    photoURL = await getDownloadURL(mountainsRef);
                }
            } else if (photoLotURL) {
                try {
                    const response = await fetch(photoLotURL);
                    const blob = await response.blob();
                    const fileName = `externam-photo.${blob.type.split('/')[1]}`;
                    const urlRef = ref(storage, `${lotId}/${fileName}`);
                    await uploadBytes(urlRef, blob);
                    photoURL = await getDownloadURL(urlRef);
                } catch (error) {
                    console.log(error)
                    return { error: "Error uploading photo" };
                }
            }

            await prisma.lot.update({
                where: {
                    id: lotId
                },
                data: {
                    name: name,
                    description: description,
                    photolot: photoURL,
                    exchangeOffer: exchange,
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

// export async function createWhatYouNeed(formData: FormData) {
//     const thingId = formData.get('thingId') as string;
//     const name = formData.get('name') as string;
//     const photoYouNeedURL = formData.get('photoYouNeedURL') as string;
//     const photoYouNeedFile = formData.get('photoYouNeedFile') as File;

//     if (!name) {
//         return { error: "Name field must be filled" };
//     }

//     try {
//         const currentData = await prisma.thing.findUnique({ where: { id: thingId } });

//         const currentName = currentData?.youneed;
//         const currentPhotoYouNeed = currentData?.photoyouneed;

//         if (currentName === name && currentPhotoYouNeed) {
//             return { success: true, text: "Nothing changed" };
//         } else if (currentName !== name || currentPhotoYouNeed) {
//             let photoURL = currentPhotoYouNeed;

//             if (photoYouNeedFile) {
//                 if (photoYouNeedFile && !currentPhotoYouNeed) {
//                     const mountainsRef = ref(storage, `${thingId}/${photoYouNeedFile.name}`);
//                     await uploadBytes(mountainsRef, photoYouNeedFile);
//                     photoURL = await getDownloadURL(mountainsRef);
//                 }
//             } else if (photoYouNeedURL) {
//                 try {
//                     const response = await fetch(photoYouNeedURL);
//                     const blob = await response.blob();
//                     const fileExptension = photoYouNeedURL.split('.').pop();
//                     const fileName = `externam-photo.${fileExptension}`;
//                     const urlRef = ref(storage, `${thingId}/${fileName}`);
//                     await uploadBytes(urlRef, blob as Blob);
//                     photoURL = await getDownloadURL(urlRef);
//                 } catch (error) {
//                     console.log(error)
//                     return { error: "Error uploading photo" };
//                 }
//             }

//             await prisma.thing.update({
//                 where: {
//                     id: thingId
//                 },
//                 data: {
//                     youneed: name,
//                     photoyouneed: photoURL,
//                     addedyouneed: true
//                 }
//             })
//             return { success: true, redirect: true };
//         }
//     } catch (error) {
//         console.log(error)
//         return { error: "Error uploading photo" };
//     }
// }

export async function createLocation(formData: FormData) {
    const lotId = formData.get('lotId') as string;
    const country = formData.get('country') as string;
    const city = formData.get('city') as string;

    if (!country && !city) {
        return { error: "Country and city fields must be filled" };
    }

    try {
        const currentData = await prisma.lot.findUnique({ where: { id: lotId } });

        const currentCountry = currentData?.country;
        const currentCity = currentData?.city;

        if (currentCountry === country && currentCity === city) {
            return { success: true, text: "Nothing changed" };
        } else if (currentCountry !== country || currentCity !== city) {
            await prisma.lot.update({
                where: {
                    id: lotId
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
    const lotId = formData.get('lotId') as string;
    const userId = formData.get('userId') as string;
    const pathName = formData.get('pathName') as string;

    try {
        await prisma.favorite.create({
            data: {
                lotId: lotId,
                userId: userId
            }
        })

    } catch (error) {
        console.log(error)
        return { error: "Error adding to favorite" };
    }
    revalidatePath(pathName);
}

export async function removeFromFavorite(formData: FormData) {
    const lotId = formData.get('lotId') as string;
    const userId = formData.get('userId') as string;
    const pathName = formData.get('pathName') as string;

    try {
        await prisma.favorite.deleteMany({
            where: {
                lotId: lotId,
                userId: userId
            }
        })

    } catch (error) {
        console.log(error)
        return { error: "Error removing from favorite" };
    }
    revalidatePath(pathName);
}

export async function updateLot(formData: FormData, lotId: string) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const photoLotFile = formData.get('photoLotFile') as File;
    const photoLotURL = formData.get('photoLotURL') as string;
    const exchangeOffer = formData.get('exchangeOffer') as string;

    try {
        const currentData = await prisma.lot.findUnique({ where: { id: lotId } });

        const currentName = currentData?.name;
        const currentDescription = currentData?.description;
        const currentPhotoURL = currentData?.photolot;
        const currentExchangeOffer = currentData?.exchangeOffer

        if (currentName === name && currentDescription === description && currentPhotoURL === currentPhotoURL && currentExchangeOffer === exchangeOffer) {
            return { success: true, text: "Nothing changed" };
        } else if (currentName !== name || currentDescription !== description || currentPhotoURL !== currentPhotoURL || currentExchangeOffer !== exchangeOffer) {
            let photoURL = currentPhotoURL;

            if (photoLotFile) {
                if (photoLotFile && !currentPhotoURL) {
                    const mountainsRef = ref(storage, `${lotId}/${photoLotFile.name}`);
                    await uploadBytes(mountainsRef, photoLotFile);
                    photoURL = await getDownloadURL(mountainsRef);
                }
            } else if (photoLotURL) {
                try {
                    const response = await fetch(photoLotURL);
                    const blob = await response.blob();
                    const fileName = `externam-photo.${blob.type.split('/')[1]}`;
                    const urlRef = ref(storage, `${lotId}/${fileName}`);
                    await uploadBytes(urlRef, blob);
                    photoURL = await getDownloadURL(urlRef);
                } catch (error) {
                    console.log(error)
                    return { error: "Error uploading photo" };
                }
            }


            await prisma.lot.update({
                where: {
                    id: lotId
                },
                data: {
                    name: name,
                    description: description,
                    photolot: photoURL,
                    exchangeOffer: exchangeOffer,
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