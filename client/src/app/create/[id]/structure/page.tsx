'use client';

import { createCategoryPage } from '@/app/actions';
import CreateCategory from '@/app/components/CreateCategory';
import CreationButtonBar from '@/app/components/CreationButtonBar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/lib/hooks/useToast';
import { allCategories, choosedCategory } from '@/lib/currentData';
import { useRouter } from 'next/navigation';

import React, { useEffect } from 'react';

const StructureRoute = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const { id } = React.use(params)

  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [categories, setCategories] = React.useState<{ id: string; name: string }[]>([]);

  const fetchCategories = async () => {
    const data = await allCategories();
    setCategories(data);
  };

  const currentCategoryName = async () => {
    const data = await choosedCategory(id);
    setSelectedCategory(data || null);
  };

  useEffect(() => {
    fetchCategories();
    currentCategoryName();
  }, []);

  const handleChooseCategory = async () => {
    if (!selectedCategory) {
      toast({
        description: 'Please select a category',
        title: 'Error',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('lotId', id);
    formData.append('categoryName', selectedCategory as string);

    try {
      const result = await createCategoryPage(formData);

      if (result?.redirect) {
        router.push(`/create/${id}/description`);
      }
    } catch (error) {
      toast({
        description: `An ${error} occurred while adding the category`,
        title: 'Error',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="w-3/5 mx-auto">
        <h2>Choose a category or create a new one</h2>
      </div>

      <form action={handleChooseCategory}>
        <input type="hidden" name="lotId" value={id} />
        <input type="hidden" name="categoryName" value={(selectedCategory as string) ?? ''} />

        <div className="w-3/5 mx-auto mt-2">
          <Select onValueChange={setSelectedCategory} value={selectedCategory as string}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: { id: string; name: string }) => (
                <SelectItem key={category.id} value={category.name}>
                  {[category.name.split('')[0].toUpperCase(), category.name.slice(1)].join('')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>
      <CreateCategory onCategoryCreated={fetchCategories} lotId={id} />
    </>
  );
};

export default StructureRoute;
