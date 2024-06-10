'use client'

import { createWhatYouNeed } from '@/app/actions'
import CreationButtonBar from '@/app/components/CreationButtonBar'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { choosedIneed } from '@/lib/currentData'
import { useRouter } from 'next/navigation'
import React from 'react'

const INeedRoute = ({ params }: { params: { id: string } }) => {

    const router = useRouter()
    const [name, setName] = React.useState<string>('')
    const [photoYouNeedURL, setPhotoYouNeedURL] = React.useState<string | null>(null)


    const clientAction = async (formData: FormData) => {
        formData.append('thingId', params.id)
        formData.append('name', name)

        const photoYouNeed = formData.get('photoYouNeed') as File
        if (photoYouNeed) {
            formData.append('photoYouNeed', photoYouNeed)
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
                        photoYouNeedURL ?
                            <Input name="photoYouNeed" type="file" placeholder="Add foto of you need" disabled /> :
                            <Input name="photoYouNeed" type="file" placeholder="Add foto of you need" />
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
        </>
    )
}

export default INeedRoute