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
    <section>
      <section className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center align-items-center'>
        {
          allThings.map(thing => (
            <div className='rounded-lg releative h-72 flex flex-col cursor-pointer' key={thing.id} onClick={() => handleClick(thing.id)}>
              <p className='relative h-72'>
                {
                  thing.photothing ? (
                    <Image src={thing.photothing as string} alt={thing.name as string} width={250} height={250} className='rounded-lg' />
                  ) : null
                }
              </p>
              <p className='text-xl font-bold'>{thing.name}</p>
              <p className='text-lg'>{thing.country}, {thing.city}</p>
            </div>
          ))
        }
      </section>
    </section>
  )
}

export default MainContent