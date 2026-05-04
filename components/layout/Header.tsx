"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useSearchStore } from "@/store/searchStore";
import { Logo } from "@/components/layout/Logo";
import { SearchInput } from "@/components/features/SearchInput";

export function Header() {
  const { itemCount: count } = useCart();
  const pathname = usePathname();
  const { query, setQuery, clearQuery } = useSearchStore();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) clearQuery();
  }, [isHome, clearQuery]);

  return (
    <header className="sticky top-0 z-100 border-b bg-surface">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>
        {isHome && (
          <div className="ml-auto w-full max-w-xs">
            <SearchInput value={query} onChange={setQuery} />
          </div>
        )}
        <Link href="/cart" className={`relative flex shrink-0 items-center gap-2 text-sm font-medium ${isHome ? "" : "ml-auto"}`}>
          <ShoppingBag className="h-6 w-6 text-gray-900" />
          {count > 0 && (
            <span className="absolute -top-2 -right-3 flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] leading-none font-medium text-white">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
