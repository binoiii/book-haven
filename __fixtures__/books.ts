import type { Book } from "@/lib/generated/prisma";

export const mockBook: Book = {
  id: 1,
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  price: 10,
  cover: "https://example.com/cover.jpg",
  sku: "BH-001",
  stock: 10,
};

export const mockBook2: Book = {
  id: 2,
  title: "The Catcher in the Rye",
  author: "J.D. Salinger",
  price: 12,
  cover: "https://example.com/cover2.jpg",
  sku: "BH-002",
  stock: 5,
};

export const outOfStockBook: Book = {
  ...mockBook,
  id: 3,
  stock: 0,
};
