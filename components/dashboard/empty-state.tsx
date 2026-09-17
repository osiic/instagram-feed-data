export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 px-6 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
        <svg
          className="h-7 w-7 text-neutral-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      </div>
      <h2 className="mt-5 text-lg font-bold">Connect your first Instagram account</h2>
      <p className="mt-2 max-w-xs text-xs text-neutral-400 leading-relaxed">
        Link your Business or Creator accounts using secure Meta OAuth.
        We never ask for passwords nor scrape profiles.
      </p>
      <a
        href="/api/instagram/connect"
        className="mt-6 rounded-lg bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-white transition"
      >
        Connect Instagram
      </a>
    </div>
  );
}
