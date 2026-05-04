"use client";

import { Search, X } from "lucide-react";
import { UI } from "@/constants/ui";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative w-full">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={UI.SEARCH_PLACEHOLDER}
        className="text-foreground placeholder:text-muted-foreground w-full rounded-full border border-gray-200 bg-white py-2 pr-9 pl-9 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
        aria-label={UI.SEARCH_PLACEHOLDER}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors hover:text-gray-900"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
