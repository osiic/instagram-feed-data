"use client";

import { InstagramMedia } from "@/types/instagram";
import { X, Heart, MessageCircle, ExternalLink } from "lucide-react";

interface ModalProps {
  item: InstagramMedia;
  onClose: () => void;
}

export default function MediaDetailModal({ item, onClose }: ModalProps) {
  const displayUrl = item.mediaUrl || item.thumbnailUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-1.5 text-neutral-300 hover:text-white transition"
          title="Close preview"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Media display */}
        <div className="relative aspect-square w-full bg-black flex-shrink-0">
          {displayUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayUrl}
              alt={item.caption?.slice(0, 40) || "Post media"}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-500">
              Media unavailable
            </div>
          )}
        </div>

        {/* Details & Caption */}
        <div className="p-4 overflow-y-auto">
          {/* Engagement bar */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-4 text-xs font-semibold">
              {item.likeCount !== null && (
                <span className="flex items-center gap-1.5 text-neutral-200">
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  {item.likeCount.toLocaleString()} likes
                </span>
              )}
              {item.commentsCount !== null && (
                <span className="flex items-center gap-1.5 text-neutral-200">
                  <MessageCircle className="h-4 w-4 text-neutral-400" />
                  {item.commentsCount.toLocaleString()} comments
                </span>
              )}
            </div>

            {item.permalink && (
              <a
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200"
              >
                <span>View on Instagram</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Caption */}
          {item.caption && (
            <p className="mt-3 text-xs text-neutral-300 whitespace-pre-line leading-relaxed">
              {item.caption}
            </p>
          )}

          {item.timestamp && (
            <p className="mt-3 text-[11px] text-neutral-500">
              {new Date(item.timestamp).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
