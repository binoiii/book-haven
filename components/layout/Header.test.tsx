import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { useCartStore } from "@/store/cartStore";
import { mockBook } from "@/__fixtures__/books";

beforeEach(() => {
  useCartStore.setState({ items: [] });
  localStorage.clear();
});

describe("Header", () => {
  it("shows the correct cart item count", () => {
    useCartStore.setState({ items: [{ book: mockBook, quantity: 3 }] });
    render(<Header />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

});
