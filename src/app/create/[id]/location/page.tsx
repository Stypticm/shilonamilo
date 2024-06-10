'use client'

import { createLocation } from '@/app/actions'
import CreationButtonBar from '@/app/components/CreationButtonBar'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { allCountries, citiesOfCountry } from '@/lib/currentData'
import useDebounceValue from '@/lib/hooks/useDebounce'
import { City } from 'country-state-city'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const LocationRoute = ({ params }: { params: { id: string } }) => {
  const router = useRouter()

  const [countries, setCountries] = React.useState<{ value?: string, label: string }[]>([])

  const [country, setCountry] = React.useState<string | null>('')
  const [isCountryValid, setIsCountryValid] = React.useState<boolean>(false)

  const [city, setCity] = React.useState<string | null>('')
  const [isCityValid, setIsCityValid] = React.useState<boolean>(false)

  useEffect(() => {
    const fetchCountries = async () => {
      const data = await allCountries()
      setCountries(data)
    }
    fetchCountries()
  }, [])

  const validateCountry = (value: string) => {
    const countryExists = countries.some(country => country.label.toLowerCase() === value.toLowerCase())
    setIsCountryValid(countryExists)
    return countryExists
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCountry(value)
    if (value) {
      validateCountry(value)
    } else {
      setIsCountryValid(true)
    }
  }


  const validateCity = async (country: string, city: string) => {
    const countryData = countries.find(c => c.label.toLowerCase() === country.toLowerCase())

    if (countryData && countryData.value) {
      const cities = await citiesOfCountry(countryData.value!)
      const cityExists = cities?.some(c => c.value.toLowerCase() === city.toLowerCase())
      setIsCityValid(cityExists!)
      return cityExists
    }
    return false
  }

  const debouncedCity = useDebounceValue(city, 500)

  useEffect(() => {
    const validate = async () => {
      if (debouncedCity && country) {
        await validateCity(country, debouncedCity)
      }
    }
    validate()
  }, [debouncedCity, country])

  const handleCityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setCity(value)
    if (!value) {
      setIsCityValid(true)
    }
  }

  const clientAction = async (formData: FormData) => {
    formData.append('thingId', params.id)
    formData.append('country', formData.get('country') as string)
    formData.append('city', formData.get('city') as string)

    const result = await createLocation(formData);


    if (result?.error) {
      toast({
        description: result.error,
        title: 'Error',
        variant: 'destructive',
      })  
    } else if (result?.text === 'Nothing changed') {
      router.push(`/`)
    } else if (result?.redirect) {
      router.push(`/`)
    }
  }


  return (
    <>
      <div className='w-3/5 mx-auto'>
        <h2>Where are you located?</h2>
      </div>

      <form action={clientAction}>
        <input type="hidden" name="thingId" value={params.id} />
        <div className='w-3/5 mx-auto mt-2 flex flex-col gap-4'>
          <Input name="country" value={country as string} placeholder="Enter name of your country" onChange={handleCountryChange} />
          {!isCountryValid ? <p className='text-sm text-red-500'>Country not found</p> : null}
          {isCountryValid && country ? <p className='text-sm text-green-500'>Country found</p> : null}
          {
            country && (
              <>
                <Input name="city" value={city as string} placeholder="Enter name of your city" onChange={handleCityChange} />
                {!isCityValid ? <p className='text-sm text-red-500'>City not found</p> : null}
                {isCityValid && city ? <p className='text-sm text-green-500'>City found</p> : null}
              </>
            )
          }
        </div>

        <CreationButtonBar />
      </form>
    </>
  )
}

export default LocationRoute