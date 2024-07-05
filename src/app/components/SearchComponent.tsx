'use client'

import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Search } from 'lucide-react'
import React, { useState } from 'react'

const SearchComponent = () => {
  return (
    <>
      <div className='w-2/4 mx-auto  flex justify-center items-center mb-5'>
        <Input type="text" name="thing" placeholder="Search" className='rounded-full' startIcon={Search} />
      </div>
    </>
  )
}

export default SearchComponent