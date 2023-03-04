import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (userId: string): Promise<User> => {
  console.info(`createUser: ${userId}`);
  return await prisma.user.create({
    data: {
      userId,
    },
  });
};
