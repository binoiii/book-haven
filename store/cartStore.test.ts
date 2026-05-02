import { useCartStore } from "./cartStore";
import { mockBook, mockBook2 } from "@/__fixtures__/books";

beforeEach(() => {
  useCartStore.setState({ items: [] });
  localStorage.clear();
});

describe("cartStore", () => {
  describe("addToCart", () => {
    it("adds a new book to the store", () => {
      useCartStore.getState().addToCart(mockBook);
      expect(useCartStore.getState().items).toHaveLength(1);
      expect(useCartStore.getState().items[0]).toEqual({
        book: mockBook,
        quantity: 1,
      });
    });

    it("increments quantity for a duplicate book", () => {
      useCartStore.getState().addToCart(mockBook);
      useCartStore.getState().addToCart(mockBook);
      expect(useCartStore.getState().items).toHaveLength(1);
      expect(useCartStore.getState().items[0].quantity).toBe(2);
    });
  });

  describe("removeFromCart", () => {
    it("removes a book by id", () => {
      useCartStore.getState().addToCart(mockBook);
      useCartStore.getState().removeFromCart(mockBook.id);
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("total", () => {
    it("is correct for multiple items with quantities", () => {
      useCartStore.getState().addToCart(mockBook);
      useCartStore.getState().addToCart(mockBook);
      useCartStore.getState().addToCart(mockBook2);
      expect(useCartStore.getState().total()).toBe(32);
    });
  });

  describe("persistence", () => {
    it("persists state to localStorage and rehydrates on remount", () => {
      useCartStore.getState().addToCart(mockBook);
      const stored = localStorage.getItem("cart");
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.state.items).toHaveLength(1);
      expect(parsed.state.items[0].book.id).toBe(mockBook.id);
    });
  });
});
