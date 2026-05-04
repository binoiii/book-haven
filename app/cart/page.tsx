import Link from "next/link";
import { CartContent } from "@/components/features/CartContent";
import { UI } from "@/constants/ui";

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-medium tracking-widest text-orange-400 uppercase">Review</p>
          <h1 className="font-serif text-2xl font-semibold text-gray-900">{UI.CART_TITLE}</h1>
        </div>
        <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-orange-500">
          ← {UI.BACK_TO_SHOP}
        </Link>
      </div>
      <CartContent />
    </main>
  );
}
