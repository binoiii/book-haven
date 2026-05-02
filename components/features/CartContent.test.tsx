import { render, screen } from "@testing-library/react";
import { CartContent } from "./CartContent";
import { useCartStore } from "@/store/cartStore";
import { mockBook, mockBook2 } from "@/__fixtures__/books";

beforeEach(() => {
  useCartStore.setState({ items: [] });
  localStorage.clear();
  jest.clearAllMocks();
});

describe("CartContent", () => {
  it("shows empty state when cart has no items", () => {
    render(<CartContent />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /continue shopping/i }),
    ).toBeInTheDocument();
  });

  it("renders all cart items with correct line totals and cart total", () => {
    useCartStore.setState({
      items: [
        { book: mockBook, quantity: 2 },
        { book: mockBook2, quantity: 1 },
      ],
    });

    render(<CartContent />);

    expect(screen.getAllByTestId("cart-item")).toHaveLength(2);
    expect(screen.getByText("$20.00")).toBeInTheDocument();
    expect(screen.getByText("$12.00")).toBeInTheDocument();
    expect(screen.getByTestId("cart-total")).toHaveTextContent("$32.00");
  });

});
