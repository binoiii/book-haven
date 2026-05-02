export type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  cover: string;
};

export const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 10,
    cover: "https://m.media-amazon.com/images/I/51Bm6JUCscL._SY522_.jpg",
  },
  {
    id: 2,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 12,
    cover: "https://m.media-amazon.com/images/I/61cfToP7pgL._SL1500_.jpg",
  },
  {
    id: 3,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 15,
    cover: "https://m.media-amazon.com/images/I/51lVvSDLQJL._SY522_.jpg",
  },
];
