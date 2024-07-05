'use client'


import { getThingById } from '@/lib/features/myStuff';
import React, { useEffect, useState } from 'react'
import { Thing } from '@/lib/interfaces';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const formFields = [
  { id: 'category', label: 'Category' },
  { id: 'country', label: 'Country' },
  { id: 'city', label: 'City' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'youneed', label: 'You need' },
];

const EditThing = ({ params }: { params: { id: string } }) => {

  const [formData, setFormData] = useState<Thing>({
    category: '',
    country: '',
    city: '',
    name: '',
    description: '',
    youneed: '',
    photothing: '',
    photoyouneed: '',
  } as Thing);

  const [initialData, setInitialData] = useState({ ...formData });
  const [isModified, setIsModified] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getThingById(params.id);
      if (data) {
        const updatedFormData: Thing = {
          ...formData,
          category: data.category || '',
          country: data.country || '',
          city: data.city || '',
          name: data.name || '',
          description: data.description || '',
          youneed: data.youneed || '',
          photothing: data.photothing || '',
          photoyouneed: data.photoyouneed || '',
        };
        setFormData(updatedFormData);
        setInitialData(updatedFormData);
      }
    }

    fetchData();
  }, [params.id]
  )

  const clientAction = async (formData: FormData) => {
    console.log(formData)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prevFormData) => {
      const updatedData = { ...prevFormData, [id]: value };
      setIsModified(JSON.stringify(updatedData) !== JSON.stringify(initialData));
      return updatedData;
    })
  };


  return (
    <div className='flex items-center justify-center'>
      <Card className='w-1/2'>
        <CardHeader>
          <CardTitle className='text-center'>Edit Thing</CardTitle>
          <CardDescription className='text-center'>If you want to edit your thing, please fill or change the fields.</CardDescription>
        </CardHeader>

        <CardContent className='w-full'>
          <form action={clientAction}>
            <div className='grid w-full items-center gap-4'>
              
            </div>
          </form>
        </CardContent>

        {/* {
          isModified ? <button className='w-full h-10 bg-[#4A5C6A] border border-slate-800 rounded-lg text-white'>Edit</button> : null
        } */}
      </Card>
    </div>
  )
}

export default EditThing