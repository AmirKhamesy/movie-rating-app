import { PrismaClient } from "@prisma/client";

type GlobalWithPrisma = {
  prisma?: PrismaClient;
};

declare const globalThis: GlobalWithPrisma;

const client: PrismaClient = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
