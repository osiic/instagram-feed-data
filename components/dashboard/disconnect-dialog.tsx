"use client";

interface DialogProps {
  username: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DisconnectDialog({
  username,
  loading,
  onConfirm,
  onCancel,
}: DialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl border border-neutral-800 bg-neutral-900 p-5 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Disconnect @${username}`}
      >
        <h3 className="font-bold text-base">Disconnect @{username}?</h3>
        <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
          This will remove the connection and delete its local token and cached data.
          You can reconnect anytime using Meta OAuth.
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-md border border-neutral-700 py-2 text-xs font-medium hover:bg-neutral-800 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-md bg-red-600 py-2 text-xs font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Disconnecting..." : "Disconnect"}
          </button>
        </div>
      </div>
    </div>
  );
}
