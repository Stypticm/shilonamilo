'use client'

import { Button } from '@/components/ui/button'
import { Heart, Loader2 } from 'lucide-react'
import React from 'react'
import { useFormStatus } from 'react-dom'

export const CreationSubmit = () => {
    const { pending } = useFormStatus()

    return (
        <>
            {pending ? (
                <Button disabled size='lg'>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please wait
                </Button>
            ) : (
                <Button type='submit' variant='secondary' size='lg'>Next</Button>
            )}
        </>
    )
}


export const AddToFavoriteButton = () => {
    const { pending } = useFormStatus()

    return (
        <>
            {pending ? (
                <Button variant='outline' size='icon' className='bg-primary-foreground' disabled>
                    <Loader2 className='h-4 w-4 animate-spin text-primary' />
                </Button>
            ) : (
                <Button variant='outline' size='icon' className='bg-primary-foreground' type='submit'>
                    <Heart className='w-4 h-4' />
                </Button >
            )}
        </>
    )
}

export const DeleteFromFavoriteButton = () => {
    const { pending } = useFormStatus()

    return (
        <>
            {pending ? (
                <Button variant='outline' size='icon' className='bg-primary-foreground' disabled>
                    <Loader2 className='h-4 w-4 animate-spin text-primary' />
                </Button>
            ) : (
                <Button variant='outline' size='icon' className='bg-primary-foreground' type='submit'>
                    <Heart className='w-4 h-4 text-primary' fill='#1ce229' />
                </Button >
            )}
        </>
    )
}

export const ReservationSubmitButton = () => {
    const { pending } = useFormStatus()

    return (
        <>
            {pending ? (
                <Button className='w-full'>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait...
                </Button>
            ) : (
                <Button type='submit' size='lg' className='w-full'>
                    Make a reservation
                </Button>
            )}
        </>
    )
}   