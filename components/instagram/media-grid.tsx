"use client";

import { useState } from "react";
import { InstagramMedia } from "@/types/instagram";
import MediaCard from "./media-card";
import MediaDetailModal from "./media-detail-modal";

interface MediaGridProps {
  media: InstagramMedia[];
}

export default function MediaGrid({ media }: MediaGridProps) {
  const [selectedMedia, setSelectedMedia] = useState<InstagramMedia | null>(null);

  if (media.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 p-8 text-center">
        <p className="text-sm font-medium text-neutral-400">No media found.</p>
        <p className="text-xs text-neutral-500 mt-1">
          Recent posts will appear here once published.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {media.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            onClick={() => setSelectedMedia(item)}
          />
        ))}
      </div>

      {selectedMedia && (
        <MediaDetailModal
          item={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
  );
}
