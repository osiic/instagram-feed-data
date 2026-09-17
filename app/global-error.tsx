"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error.digest ?? error.message);
  }, [error]);

  return (
    <html>
      <body className="bg-neutral-950 text-neutral-100 flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-neutral-400">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="mt-5 rounded-md bg-neutral-100 px-5 py-2 text-sm font-medium text-neutral-950 hover:bg-white transition"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
