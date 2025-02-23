'use client';

import { createDescription } from '@/lib/features/repositories/description';
import TogglePhotoUrlFile from '@/components/TogglePhotoUrlFile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/lib/hooks/use-toast';
import { getDescriptionByLotId} from '@/lib/features/repositories/description';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DescriptionRoute = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const { id } = React.use(params);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [exchangeOffer, setExchangeOffer] = useState<string>('');
  const [photoLotFile, setPhotoLotFile] = useState<string | null>(null);
  const [photoLotURL, setPhotoLotURL] = useState<string | null>(null);

  const clientAction = async (formData: FormData) => {
    formData.append('lotId', id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('exchange', exchangeOffer);

    const photoLotFile = formData.get('photoLotFile') as File;
    if (photoLotFile) {
      formData.append('photoLotFile', photoLotFile);
    }

    const photoLotURL = formData.get('photoLotURL') as string;
    if (photoLotURL) {
      formData.append('photoLotURL', photoLotURL);
    }

    const result = await createDescription(formData);

    if (result?.error) {
      toast({
        description: result.error,
        title: 'Error',
        variant: 'destructive',
      });
    } else if (result?.text === 'Nothing changed') {
      router.push(`/create/${id}/location`);
    } else if (result?.redirect) {
      router.push(`/create/${id}/location`);
    }
  };

  const fetchFilledFields = async () => {
    const data = await getDescriptionByLotId(id);
    setName(data?.name || '');
    setDescription(data?.description || '');
    setPhotoLotURL(data?.photolot || null);
    setPhotoLotFile(data?.photolot || null);
  };

  useEffect(() => {
    fetchFilledFields();
  }, []);

  return (
    <>
      <div className="w-3/5 mx-auto">
        <h2>Add description about the lot</h2>
      </div>

      <form action={clientAction} className="w-full">
        <input type="hidden" name="lotId" value={id} />

        <div className="w-3/5 flex flex-col mx-auto gap-4 mt-2">
          <div className="flex justify-around gap-4 w-full">
            <Label className="flex items-center justify-start w-2/12">Name</Label>
            <Input
              name="name"
              type="text"
              placeholder="Name of your lot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex ml-auto"
            />
          </div>

          <div className="flex gap-4 w-full">
            <Label className="flex items-center justify-start w-2/12">Description</Label>
            <Textarea
              placeholder="Try to describe your lot, and quality"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex ml-auto"
            />
          </div>
          <TogglePhotoUrlFile
            photoLotFile={photoLotFile}
            photoLotURL={photoLotURL}
            setPhotoLotFile={setPhotoLotFile}
            setPhotoLotURL={setPhotoLotURL}
          />
          <div className="flex w-full gap-4">
            <Label className="flex items-center justify-start w-2/12">Exchange</Label>
            <Input
              name="exchangeOffer"
              type="text"
              placeholder="Possible exchange offer, enter short name"
              value={exchangeOffer}
              onChange={(e) => setExchangeOffer(e.target.value)}
              className="flex ml-auto"
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default DescriptionRoute;
