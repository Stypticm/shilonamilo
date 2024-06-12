'use client'

import { allCountries, getAllThings } from '@/lib/currentData'
import { Thing } from '@/lib/interfaces'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import countryList from 'react-select-country-list'

const MainContent = () => {
  const router = useRouter()

  const [allThings, setAllThings] = useState<Thing[]>([])


  useEffect(() => {
    const fetchThings = async () => {
      try {
        const things = await getAllThings()
        setAllThings(things.filteredData)
      } catch (error) {
        console.error('Failed to fetch things:', error)
      }
    }

    fetchThings()
  }, [])

  const handleClick = (id: string) => {
    router.push(`/thing/${id}`)
  }

  return (
    <div className='w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center align-items-center'>
      {
        allThings.map(thing => (
          <section className=' rounded-lg releative h-80 w-72 flex flex-col cursor-pointer' key={thing.id} onClick={() => handleClick(thing.id)}>
            <p className='relative h-72'>
              {
                thing.photothing ? (
                  <Image src={thing.photothing as string} alt={thing.name as string} width={250} height={250} className='rounded-lg h-full w-full object-cover' />
                ) : null
              }
            </p>
            <p className='text-xl font-bold'>{thing.name}</p>
            <p className='text-lg'>{thing.country}, {thing.city}</p>
          </section>
        ))
      }
    </div>
  )
}

export default MainContent