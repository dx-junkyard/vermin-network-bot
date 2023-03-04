import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (userId: string): Promise<User> => {
  return await prisma.user.upsert({
    create: {
      userId: userId,
    },
    update: {},
    where: {
      userId: userId,
    },
  });
};
