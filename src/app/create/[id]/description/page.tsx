'use client'

import { createDescription } from '@/app/actions'
import CreationButtonBar from '@/app/components/CreationButtonBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { choosedDescription } from '@/lib/currentData'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const DescriptionRoute = ({ params }: { params: { id: string } }) => {

    const router = useRouter()

    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [photoThingFile, setPhotoThingFile] = useState<string | null>(null)
    const [photoThingURL, setPhotoThingURL] = useState<string | null>(null)

    const [toggleButton, setToggleButton] = useState<boolean>(false)

    const clientAction = async (formData: FormData) => {
        formData.append('thingId', params.id)
        formData.append('name', name)
        formData.append('description', description)

        const photoThingFile = formData.get('photoThingFile') as File
        if (photoThingFile) {
            formData.append('photoThingphotoThingFile', photoThingFile)
        }

        const photoThingURL = formData.get('photoThingURL') as string
        if (photoThingURL) {
            formData.append('photoThingphotoThingURL', photoThingURL)
        }

        const result = await createDescription(formData);

        if (result?.error) {
            toast({
                description: result.error,
                title: 'Error',
                variant: 'destructive',
            });
        } else if (result?.text === 'Nothing changed') {
            router.push(`/create/${params.id}/ineed`)
        } else if (result?.redirect) {
            router.push(`/create/${params.id}/ineed`)
        }
    }

    const fetchFilledFields = async () => {
        const data = await choosedDescription(params.id)
        setName(data?.name || '')
        setDescription(data?.description || '')
        setPhotoThingURL(data?.photothing || null)
        setPhotoThingFile(data?.photothing || null)
    }

    useEffect(() => {
        fetchFilledFields()
    }, [])

    return (
        <>
            <div className='w-3/5 mx-auto'>
                <h2>Add description about the thing</h2>
            </div>

            <form action={clientAction}>
                <input type="hidden" name="thingId" value={params.id} />

                <div className='w-3/5 mx-auto flex flex-col gap-4 mt-2'>
                    <Input name="name" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <Textarea placeholder="Try to describe your thing, and quality" value={description} onChange={(e) => setDescription(e.target.value)} />

                    {
                        !toggleButton ?
                            <>
                                {
                                    photoThingFile ?
                                        <Input name="photoThing" type="file" disabled /> :
                                        <Input name="photoThingFile" type="file" />
                                }
                            </> :
                            <>
                                {
                                    photoThingURL ?
                                        <Input name="photoThingURL" type="text" placeholder='Insert photo url' disabled /> :
                                        <Input name="photoThingURL" type="text" placeholder='Insert photo url' />
                                }

                            </>
                    }
                    {
                        photoThingURL &&
                        <section className='flex gap-4 items-center'>
                            <span>Current photo:</span>
                            <img src={photoThingURL} alt="Photo thing" className='w-1/5' />
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

export default DescriptionRoute
