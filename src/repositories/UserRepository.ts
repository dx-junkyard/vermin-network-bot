import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (userId: string): Promise<User> => {
  return await prisma.user.create({
    data: {
      userId,
    },
  });
};
