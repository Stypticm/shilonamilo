import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'

interface TogglePhotoUrlFileProps {
    photoLotFile: string | null
    setPhotoLotFile: React.Dispatch<React.SetStateAction<string | null>>
    photoLotURL: string | null
    setPhotoLotURL: React.Dispatch<React.SetStateAction<string | null>>
}

const TogglePhotoUrlFile = ({  photoLotFile, setPhotoLotFile, photoLotURL, setPhotoLotURL }: TogglePhotoUrlFileProps) => {

    const [toggleButton, setToggleButton] = useState<boolean>(false)

    const handleToggleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); 
        setToggleButton(!toggleButton);
    };
    
    return (
        <>
            <div className='flex w-full gap-4'>
                <Label className='flex items-center justify-start w-2/12'>Photo</Label>
                <div className='flex flex-row w-full gap-2'>
                    {
                        !toggleButton ?
                            <>
                                {
                                    photoLotFile ?
                                        <Input name="photoLotFile" type="file" disabled /> :
                                        <Input name="photoLotFile" type="file" />
                                }
                            </> :
                            <>
                                {
                                    photoLotURL ?
                                        <Input name="photoLotURL" type="text" placeholder='Insert photo url' disabled /> :
                                        <Input name="photoLotURL" type="text" placeholder='Insert photo url' />
                                }

                            </>
                    }
                    {
                        photoLotURL &&
                        <section className='flex gap-4 items-center'>
                            <img src={photoLotURL} alt="Photo lot" className='w-1/5' />
                        </section>
                    }
                    <div className='text-center'>
                        <Button variant="secondary" onClick={handleToggleClick}>{
                            toggleButton ? 'Choose File' : 'Insert URL'
                        }</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TogglePhotoUrlFile