export const prismaSchemaPath = "packages/db/prisma/schema.prisma";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
