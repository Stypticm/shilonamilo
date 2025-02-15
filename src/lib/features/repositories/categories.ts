'use server';

import { prisma } from '@/lib/prisma/client';

export const allCategories = async () => {
  const data = await prisma.category.findMany();
  return data;
};

export const getCategoryById = async (id: string) => {
  const data = await prisma.lot.findUnique({
    where: {
      id,
    },
    select: {
      category: true,
    },
  });
  return data?.category;
};

export async function createNewCategory(formData: FormData) {
  const categoryName = formData.get('categoryName');
  await prisma.category.create({
    data: {
      name: categoryName as string,
    },
  });
}

export async function createCategoryPage(formData: FormData) {
  const lotId = formData.get('lotId') as string;
  const categoryName = formData.get('categoryName') as string;

  console.log(lotId, categoryName);

  if (!categoryName) {
    return {
      error: 'Category name and Lot ID must be filled',
    };
  } else {
    await prisma.lot.update({
      where: {
        id: lotId,
      },
      data: {
        category: categoryName,
        addedcategory: true,
      },
    });

    return { success: true, redirect: true };
  }
}
