'use client'

import { createCategoryPage } from '@/app/actions'
import CreateCategory from '@/app/components/CreateCategory'
import CreationButtonBar from '@/app/components/CreationButtonBar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { allCategories, choosedCategory } from '@/lib/currentData'
import { useRouter } from 'next/navigation'

import React, { useEffect } from 'react'

const StructureRoute = ({ params }: { params: { id: string } }) => {

    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>('')
    const [categories, setCategories] = React.useState<{ id: string, name: string }[]>([])

    const fetchCategories = async () => {
        const data = await allCategories()
        setCategories(data)
    }

    const currentCategoryName = async () => {
        const data = await choosedCategory(params.id)
        setSelectedCategory(data)
    }

    useEffect(() => {
        fetchCategories()
        currentCategoryName()
    }, [])

    const handleChooseCategory = async () => {
        const formData = new FormData();
        formData.append('thingId', params.id);
        formData.append('categoryName', selectedCategory as string);

        try {
            const result = await createCategoryPage(formData);

            if (result?.error === 'Category already added') {
                router.push(`/create/${params.id}/description`);
            } else if (result?.error) {
                toast({
                    description: result.error,
                    title: 'Error',
                    variant: 'destructive',
                })
            } else {
                router.push(`/create/${params.id}/description`);
            }
        } catch (error) {
            toast({
                description: 'An error occurred while adding the category',
                title: 'Error',
                variant: 'destructive',
            })
        }
    }

    return (
        <>
            <div className='w-3/5 mx-auto'>
                <h2>Choose a category or create a new one</h2>
            </div>

            <form action={handleChooseCategory}>
                <input type="hidden" name="thingId" value={params.id} />
                <input type="hidden" name="categoryName" value={selectedCategory} />

                <div className='w-3/5 mx-auto mt-2'>
                    <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder='Choose a category' />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                categories.map((category: { id: string, name: string }) => (
                                    <SelectItem key={category.id} value={category.name}>
                                        {[category.name.split("")[0].toUpperCase(), category.name.slice(1)].join("")}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>

                <CreationButtonBar />
            </form>
            <CreateCategory onCategoryCreated={fetchCategories} thingId={params.id} />
        </>
    )
}

export default StructureRoute