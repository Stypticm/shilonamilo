'use client'

import React from 'react'
import { createNewCategory } from '../actions'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const CreateCategory = ({ thingId, onCategoryCreated }: { thingId: string, onCategoryCreated: () => void }) => {
    const { pending } = useFormStatus()
    const [categoryName, setCategoryName] = React.useState<string | undefined>('')

    const createCategory = () => {
        const formData = new FormData()
        formData.append('thingId', thingId)
        formData.append('categoryName', categoryName as string)

        setCategoryName('')
        return createNewCategory(formData).then(() => {
            onCategoryCreated()
        })
    }

    return (
        <>
            <form action={createCategory} className='mt-5 w-3/5 mx-auto flex items-center gap-2'>
                <input
                    type="text"
                    name="categoryName"
                    placeholder="Create a new category"
                    value={categoryName as string}
                    className='w-full border border-slate-500 rounded-md p-2'
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                <input type="hidden" name="thingId" value={thingId} />
                {
                    pending ? (
                        <Button disabled size='lg'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        categoryName && <Button type='submit' size='lg' variant='secondary'>Create</Button>
                    )
                }
            </form>
        </>
    )
}

export default CreateCategory