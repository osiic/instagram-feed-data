"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import DisconnectDialog from "./disconnect-dialog";
import { InstagramProfile } from "@/types/instagram";

interface ProfileSummaryProps {
  account: InstagramProfile;
}

export default function ProfileSummary({ account }: ProfileSummaryProps) {
  const router = useRouter();
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  async function handleDisconnect() {
    setDisconnecting(true);
    try {
      const res = await fetch(`/api/instagram/accounts/${account.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setShowDisconnect(false);
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setDisconnecting(false);
    }
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 overflow-hidden rounded-full border border-neutral-700 bg-neutral-800 flex-shrink-0">
            {account.profilePictureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={account.profilePictureUrl}
                alt={account.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-neutral-400 uppercase">
                {account.username.slice(0, 2)}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base leading-tight">@{account.username}</h2>
              {account.accountType && (
                <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-400">
                  {account.accountType}
                </span>
              )}
            </div>
            {account.name && (
              <p className="text-xs text-neutral-400 mt-0.5">{account.name}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowDisconnect(true)}
          className="rounded p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-red-400 transition"
          title="Disconnect account"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {account.biography && (
        <p className="mt-3 text-xs text-neutral-300 whitespace-pre-line leading-relaxed">
          {account.biography}
        </p>
      )}

      {/* Stats counter */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-neutral-800/80 pt-3 text-center">
        <div>
          <div className="text-base font-bold">
            {account.followersCount?.toLocaleString() ?? "—"}
          </div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
            Followers
          </div>
        </div>
        <div>
          <div className="text-base font-bold">
            {account.followsCount?.toLocaleString() ?? "—"}
          </div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
            Following
          </div>
        </div>
        <div>
          <div className="text-base font-bold">
            {account.mediaCount?.toLocaleString() ?? "—"}
          </div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
            Posts
          </div>
        </div>
      </div>

      {showDisconnect && (
        <DisconnectDialog
          username={account.username}
          loading={disconnecting}
          onConfirm={handleDisconnect}
          onCancel={() => setShowDisconnect(false)}
        />
      )}
    </div>
  );
}
