'use client'

import { createDescription } from '@/app/actions'
import CreationButtonBar from '@/app/components/CreationButtonBar'
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
    const [photoThingURL, setPhotoThingURL] = useState<string | null>(null)

    const clientAction = async (formData: FormData) => {
        formData.append('thingId', params.id)
        formData.append('name', name)
        formData.append('description', description)

        const photoThing = formData.get('photoThing') as File
        if (photoThing) {
            formData.append('photoThing', photoThing)
        }

        const result = await createDescription(formData);

        if (result?.error) {
            toast({
                description: result.error,
                title: 'Error',
                variant: 'destructive',
            });
        } else if (result?.text) {
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
                        photoThingURL ?
                            <Input name="photoThing" type="file" placeholder="Insert photo url your thing" disabled /> :
                            <Input name="photoThing" type="file" placeholder="Insert photo url your thing" />
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
        </>
    )
}

export default DescriptionRoute