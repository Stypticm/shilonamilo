'use client'

import { createCategoryPage } from '@/app/actions'
import CreateCategory from '@/app/components/CreateCategory'
import CreationButtonBar from '@/app/components/CreationButtonBar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { allCategories } from '@/lib/allCategories'

import React, { useEffect } from 'react'

const StructureRoute = ({ params }: { params: { id: string } }) => {

    const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>('')
    const [categories, setCategories] = React.useState<{ id: string, name: string }[]>([])

    const fetchCategories = async () => {
        const data = await allCategories()
        setCategories(data)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <>
            <div className='w-3/5 mx-auto'>
                <h2>Choose a category or create a new one</h2>
            </div>

            <form action={createCategoryPage}>
                <input type="hidden" name="thingId" value={params.id} />
                <input type="hidden" name="categoryName" value={selectedCategory} />

                <div className='w-3/5 mx-auto mt-2'>
                    <Select onValueChange={setSelectedCategory}>
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
            <CreateCategory onCategoryCreated={fetchCategories} thingId={params.id}/>
        </>
    )
}

export default StructureRoute