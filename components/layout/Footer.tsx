import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="bg-surface border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-4 py-4 sm:flex-row sm:justify-between sm:py-6">
        <span className="font-serif leading-none tracking-tight text-gray-500">BookHaven</span>
        <p className="text-xs text-gray-400 sm:text-xxs">
          © {new Date().getFullYear()} BookHaven. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
