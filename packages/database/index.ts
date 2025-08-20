/* eslint-disable no-unused-vars */
export * from '@prisma/client';
export * from '@prisma/client/edge';

declare global {
  namespace PrismaJson {
    // you can use classes, interfaces, types, etc.
    type CustomFields = Record<string, string>;
  }
}
