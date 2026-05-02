import { PrismaClient } from "../lib/generated/prisma";
import { books } from "./data/books";

const prisma = new PrismaClient();

async function main() {
  for (const book of books) {
    await prisma.book.upsert({
      where: { sku: book.sku },
      update: book,
      create: book,
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
