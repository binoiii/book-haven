'use client'

import { useEffect } from 'react'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'

const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'] })
const dmSerifDisplay = DM_Serif_Display({
  variable: '--font-dm-serif',
  subsets: ['latin'],
  weight: '400',
})

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable} antialiased`}>
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
        <h2 className="font-serif text-2xl font-semibold text-gray-900 sm:text-3xl sm:text-4xl">
          Something went <span className="text-orange-400">wrong</span>
        </h2>
        <p className="mt-4 text-gray-500">
          An unexpected error occurred. Try again or come back later.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-gray-400">
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={unstable_retry}
          className="mt-8 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Try again
        </button>
      </body>
    </html>
  )
}
