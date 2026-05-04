import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { BookCard } from "./BookCard";
import { addToCartAction } from "@/server/actions/cartActions";
import { useCartStore } from "@/store/cartStore";
import { mockBook, outOfStockBook } from "@/__fixtures__/books";
import { CARD_COLORS } from "@/constants/ui";

jest.mock("@/server/actions/cartActions", () => ({
  addToCartAction: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn() },
}));

const mockAddToCartAction = addToCartAction as jest.MockedFunction<
  typeof addToCartAction
>;

const defaultColor = CARD_COLORS[0];

beforeEach(() => {
  useCartStore.setState({ items: [] });
  localStorage.clear();
  jest.clearAllMocks();
  mockAddToCartAction.mockResolvedValue({ success: true });
});

describe("BookCard", () => {
  it("renders title, author, sku, price and Add to Cart button", () => {
    render(<BookCard book={mockBook} cardColor={defaultColor} />);
    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getByText("F. Scott Fitzgerald")).toBeInTheDocument();
    expect(screen.getByText("BH-001")).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add the great gatsby to cart/i }),
    ).toBeInTheDocument();
  });

  it("shows Out of Stock badge and disabled button when stock === 0", () => {
    render(<BookCard book={outOfStockBook} cardColor={defaultColor} />);
    expect(screen.getAllByText(/out of stock/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /is out of stock/i })).toBeDisabled();
  });

  it("rolls back Zustand update and shows toast when Server Action returns an error", async () => {
    mockAddToCartAction.mockResolvedValue({
      success: false,
      message: "This book is out of stock",
    });

    const user = userEvent.setup();
    render(<BookCard book={mockBook} cardColor={defaultColor} />);
    await user.click(screen.getByRole("button", { name: /add the great gatsby to cart/i }));

    await waitFor(() => {
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    expect(toast.error).toHaveBeenCalledWith("This book is out of stock");
  });
});
