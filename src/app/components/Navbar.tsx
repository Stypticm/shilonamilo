import Link from 'next/link'
import React from 'react'
import Title from './Title'
import Menu from './Menu'
import SearchComponent from './SearchComponent'

const Navbar = () => {
    return (
        <>
            <section className='flex justify-between font-medium w-full h-24 mb-5'>
                <Link href='/' className='text-3xl font-bold flex items-center justify-center ml-5'>
                    <span>ShiloNaMilo</span>
                </Link>

                <Title />

                <main className='mr-5 lg:mr-10 flex'>
                    <Menu />
                </main>

            </section>
            <SearchComponent />
        </>
    )
}

export default Navbar