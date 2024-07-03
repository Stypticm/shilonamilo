'use client'

import { createWhatYouNeed } from '@/app/actions'
import CreationButtonBar from '@/app/components/CreationButtonBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { choosedIneed } from '@/lib/currentData'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const INeedRoute = ({ params }: { params: { id: string } }) => {

    const router = useRouter()

    const [name, setName] = useState<string>('')
    const [photoYouNeedURL, setPhotoYouNeedURL] = useState<string | null>(null)
    const [photoYouNeedFile, setPhotoYouNeedFile] = useState<string | null>(null)

    const [toggleButton, setToggleButton] = useState<boolean>(false)

    const clientAction = async (formData: FormData) => {
        formData.append('thingId', params.id)
        formData.append('name', name)

        const photoYouNeedFile = formData.get('photoYouNeed') as File
        if (photoYouNeedFile) {
            formData.append('photoYouNeed', photoYouNeedFile)
        }
        const photoYouNeedURL = formData.get('photoYouNeedURL') as string
        if (photoYouNeedURL) {
            formData.append('photoYouNeedURL', photoYouNeedURL)
        }

        const result = await createWhatYouNeed(formData);

        if (result?.error) {
            toast({
                description: result.error,
                title: 'Error',
                variant: 'destructive',
            })
        } else if (result?.text === 'Nothing changed') {
            router.push(`/create/${params.id}/location`)
        } else if (result?.redirect) {
            router.push(`/create/${params.id}/location`)
        }
    }

    const fetchFilledFields = async () => {
        const data = await choosedIneed(params.id)
        setName(data?.youneed || '')
        setPhotoYouNeedURL(data?.photoyouneed || null)
        setPhotoYouNeedFile(data?.photoyouneed || null)
    }

    React.useEffect(() => {
        fetchFilledFields()
    }, [])

    return (
        <>
            <div className='w-3/5 mx-auto'>
                <h2>Here will be what I want to get for my thing</h2>
            </div>

            <form action={clientAction}>
                <input type="hidden" name="thingId" value={params.id} />

                <div className='w-3/5 mx-auto flex flex-col gap-4 mt-2'>

                    <Input name="name" type="text" placeholder="Enter what you need" value={name} onChange={(e) => setName(e.target.value)} />

                    {
                        !toggleButton ?
                            <>
                                {
                                    photoYouNeedFile ?
                                        <Input name="photoYouNeedFile" type="file" disabled /> :
                                        <Input name="photoYouNeedFile" type="file" />
                                }
                            </> :
                            <>
                                {
                                    photoYouNeedURL ?
                                        <Input name="photoYouNeedURL" type="text" placeholder='Insert photo url' disabled /> :
                                        <Input name="photoYouNeedURL" type="text" placeholder='Insert photo url' />
                                }

                            </>
                    }
                    {
                        photoYouNeedURL &&
                        <section className='flex gap-4 items-center'>
                            <span>Current photo:</span>
                            <img src={photoYouNeedURL} alt="Photo you need" className='w-1/5 mx-auto' />
                        </section>
                    }
                </div>

                <CreationButtonBar />
            </form>

            <div className='w-full text-center mt-5'>
                <Button variant="secondary" onClick={() => setToggleButton(!toggleButton)}>{
                    toggleButton ? 'Choose File' : 'Insert URL'
                }</Button>
            </div>
        </>
    )
}

export default INeedRoute