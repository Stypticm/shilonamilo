'use server';

import prisma from '../../prisma/db';

export const getUserByUid = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email,
    },
  });
};
