'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { EditSubmit } from './SubmitButtons'

const SaveButtonBar = ({ id }: { id: string }) => {
    return (
        <div className='flex items-center justify-around mx-auto px-5 lg:px-10 h-full w-full'>
            <Button variant="secondary" size='lg' asChild>
                <Link href={`/lot/${id}`}>
                    Cancel
                </Link>
            </Button>
            <EditSubmit />
        </div>
    )
}

export default SaveButtonBar