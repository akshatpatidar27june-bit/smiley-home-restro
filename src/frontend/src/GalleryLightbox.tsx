import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type GalleryImage = {
  src: string;
  alt: string;
};

export default function GalleryLightbox() {
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const image = target?.closest<HTMLImageElement>("#gallery img");
      if (!image) return;

      event.preventDefault();
      setSelected({ src: image.currentSrc || image.src, alt: image.alt });
      setZoom(1);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "+" || event.key === "=") {
        setZoom((value) => Math.min(3, Number((value + 0.25).toFixed(2))));
      }
      if (event.key === "-") {
        setZoom((value) => Math.max(0.5, Number((value - 0.25).toFixed(2))));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

  if (!selected) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Gallery photo viewer"
      onClick={() => setSelected(null)}
    >
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={selected.src}
          alt={selected.alt}
          className="max-h-[88vh] max-w-[92vw] object-contain transition-transform duration-200 select-none"
          style={{ transform: `scale(${zoom})` }}
        />

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-white shadow-xl">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(0.5, Number((value - 0.25).toFixed(2))))}
            className="h-10 w-10 rounded-full bg-white/15 text-2xl font-bold hover:bg-white/25"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="min-w-16 rounded-full bg-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/25"
            aria-label="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(3, Number((value + 0.25).toFixed(2))))}
            className="h-10 w-10 rounded-full bg-white/15 text-2xl font-bold hover:bg-white/25"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="ml-1 h-10 w-10 rounded-full bg-white/15 text-xl hover:bg-white/25"
            aria-label="Close photo viewer"
          >
            ×
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
