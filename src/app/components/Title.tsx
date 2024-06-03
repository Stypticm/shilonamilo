import { Separator } from '@/components/ui/separator'
import React from 'react'

const Title = () => {
    return (
        <>
            <section className='w-full text-center mb-5'>
                <h3 className='text-2xl font-bold text-foreground-secondary mb-2'>
                    Change what you don't need for what you need
                </h3>
                <Separator className='bg-foreground mx-auto w-2/3 lg:w-3/6' />
            </section>
        </>
    )
}

export default Title