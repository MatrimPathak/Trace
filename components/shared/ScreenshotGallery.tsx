"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

interface ScreenshotGalleryProps {
  screenshots: string[];
}

export function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (screenshots.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {screenshots.map((url, i) => (
          <button
            key={i}
            onClick={() => setLightbox(url)}
            className="group relative overflow-hidden rounded-xl border border-border bg-muted aspect-video transition-all hover:border-border/60 hover:shadow-md"
          >
            <Image
              src={url}
              alt={`Screenshot ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
              <ZoomIn className="h-5 w-5 text-white" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox}
                alt="Screenshot"
                className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background shadow-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
