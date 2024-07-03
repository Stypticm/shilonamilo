import { File, FileQuestion } from 'lucide-react'
import React from 'react'

interface IAppProps {
    name: string;
    description: string;
}

const NoItems = ({ name, description }: IAppProps) => {
    return (
        <div className='flex min-h-[400px] flex-col justify-center items-center rounded-md p-8 text-center animate-in fade-in-50 mt-10'>
            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-slate-300'>
                <FileQuestion className='h-10 w-10 text-primary' />
            </div>
            <h2 className='mt-6 text-xl font-semibold'>
                {name}
            </h2>
            <p className='mt-2 text-center text-sm leading-6 text-muted-foreground'>
                {description}
            </p>
        </div>
    )
}

export default NoItems