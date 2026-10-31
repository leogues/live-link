import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const schema = connectionString ? new URL(connectionString).searchParams.get("schema") || undefined : undefined;

const adapter = new PrismaPg({
  connectionString,
  max: 5,
  connectionTimeoutMillis: 5000,
}, { schema });
const prisma = new PrismaClient({ adapter });

export default prisma;
