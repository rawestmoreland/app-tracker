import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // @ts-ignore
  prisma = createPrisma();
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = createPrisma();
  }
  // @ts-ignore
  prisma = global.prisma;
}

function createPrisma() {
  return new PrismaClient();
}

export { prisma };
