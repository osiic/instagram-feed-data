"use client";

import { InstagramMedia } from "@/types/instagram";
import { Heart, MessageCircle, Play, Layers } from "lucide-react";

interface MediaCardProps {
  item: InstagramMedia;
  onClick: () => void;
}

export default function MediaCard({ item, onClick }: MediaCardProps) {
  const displayUrl = item.thumbnailUrl || item.mediaUrl;

  return (
    <button
      onClick={onClick}
      className="group relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-800 text-left focus:outline-none focus:ring-2 focus:ring-neutral-400"
    >
      {displayUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayUrl}
          alt={item.caption?.slice(0, 40) || "Instagram post"}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
          No image
        </div>
      )}

      {/* Top badges for Video/Carousel */}
      <div className="absolute right-2 top-2">
        {item.mediaType === "VIDEO" && (
          <span className="rounded bg-black/60 p-1 text-white backdrop-blur-sm">
            <Play className="h-3 w-3 fill-white" />
          </span>
        )}
        {item.mediaType === "CAROUSEL_ALBUM" && (
          <span className="rounded bg-black/60 p-1 text-white backdrop-blur-sm">
            <Layers className="h-3 w-3" />
          </span>
        )}
      </div>

      {/* Hover overlay with likes and comments */}
      <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 group-hover:opacity-100 transition">
        {item.likeCount !== null && (
          <div className="flex items-center gap-1 text-xs font-bold text-white">
            <Heart className="h-3.5 w-3.5 fill-white" />
            <span>{item.likeCount}</span>
          </div>
        )}
        {item.commentsCount !== null && (
          <div className="flex items-center gap-1 text-xs font-bold text-white">
            <MessageCircle className="h-3.5 w-3.5 fill-white" />
            <span>{item.commentsCount}</span>
          </div>
        )}
      </div>
    </button>
  );
}
