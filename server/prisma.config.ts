import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Generation needs no database; migrate deploy validates this at runtime.
  datasource: { url: process.env.DATABASE_URL || "" },
});
