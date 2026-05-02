import { CartContent } from "@/components/features/CartContent";
import { UI } from "@/constants/ui";

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{UI.CART_TITLE}</h1>
      <CartContent />
    </main>
  );
}
