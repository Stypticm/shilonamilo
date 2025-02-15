import React from 'react'
import { Icons } from './Icons'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from './ui/dropdown-menu'
import { ILot } from '@/lib/interfaces'

interface FilterMenuProps {
    lots: ILot[] | undefined,
    setChoosedCategory: React.Dispatch<React.SetStateAction<string>>
    choosedCategory: string
}

const FilterMenu: React.FC<FilterMenuProps> = ({ lots, setChoosedCategory, choosedCategory }) => {

    const handleCategory = (category: string) => {
        setChoosedCategory(category)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center hover:bg-slate-300">
                    <Icons.filterIcon className='w-4 h-4' />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="box-content bg-slate-500 flex flex-col justify-center items-center">
                <DropdownMenuItem key={'all'} className='w-full flex justify-center items-center' onClick={() => handleCategory('All')}>
                    <span className='text-center'>All</span>
                </DropdownMenuItem>
                {
                    lots?.map((item: ILot) => (
                        <DropdownMenuItem key={item.id} className='w-full flex justify-center items-center' onClick={() => handleCategory(item.category as string)}>
                            {item.category}
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default FilterMenu