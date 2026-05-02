"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-32 text-center">
      <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
      <p className="mb-6 text-muted-foreground">We couldn&apos;t load the books. Please try again.</p>
      <button
        onClick={reset}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80"
      >
        Try again
      </button>
    </main>
  );
}
