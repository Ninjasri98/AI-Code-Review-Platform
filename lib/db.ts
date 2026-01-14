import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// Initialize the Prisma PostgreSQL adapter with the connection string from environment variables
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,

})

const PrismaClientSingleton = () =>{
    return new PrismaClient({adapter})
}

declare const globalThis : {
    prismaGlobal : ReturnType<typeof PrismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal || PrismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma;
}

export default prisma;