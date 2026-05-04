import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="bg-surface border-t">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <span className="font-serif leading-none tracking-tight text-gray-500">BookHaven</span>
        <p className="text-xxs text-gray-400">
          © {new Date().getFullYear()} BookHaven. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
