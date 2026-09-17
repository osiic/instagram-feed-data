import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-neutral-100 px-6 text-center">
      <h1 className="text-5xl font-bold text-neutral-400">404</h1>
      <p className="mt-3 text-sm text-neutral-400">Page not found.</p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-md bg-neutral-100 px-5 py-2 text-sm font-medium text-neutral-950 hover:bg-white transition"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
