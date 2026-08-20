import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const API_URL = "https://smiley-home-decoration-api.onrender.com";
const OPEN_DECORATION_URL =
  "https://drive.google.com/file/d/1yrQTuCsDCj_MUC6N3IyPuI_dtbpg5kKb/preview";
const DECORATION_VIDEO_URL =
  "https://drive.google.com/drive/folders/1ttnP5_i_GvOTX8LtO2NEdRfhSo4X2ZuC?usp=drive_link";

type Decoration = {
  id: string;
  url: string;
  name: string;
  order: number;
};

export default function DecorationGallery() {
  const [photosTarget, setPhotosTarget] = useState<HTMLElement | null>(null);
  const [videosTarget, setVideosTarget] = useState<HTMLElement | null>(null);
  const [galleryTarget, setGalleryTarget] = useState<HTMLElement | null>(null);
  const [items, setItems] = useState<Decoration[]>([]);
  const [selected, setSelected] = useState<Decoration | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let observer: MutationObserver | undefined;
    let cancelled = false;

    const findTargets = () => {
      const photos = document.querySelector<HTMLElement>(
        '[data-ocid="decoration.photos.card"]',
      );
      const videos = document.querySelector<HTMLElement>(
        '[data-ocid="decoration.videos.card"]',
      );
      const parent = photos?.parentElement || videos?.parentElement || null;

      if (!cancelled) {
        setPhotosTarget(photos);
        setVideosTarget(videos);
        setGalleryTarget(parent);
      }
      return photos || videos;
    };

    findTargets();
    observer = new MutationObserver(findTargets);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/decorations`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load decoration photos");
        return response.json();
      })
      .then((data: Decoration[]) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openPhoto = (item: Decoration) => {
    setSelected(item);
    setZoom(1);
  };

  const closePhoto = () => {
    setSelected(null);
    setZoom(1);
  };

  useEffect(() => {
    if (!selected) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePhoto();
      if (event.key === "+" || event.key === "=") {
        setZoom((value) => Math.min(3, Number((value + 0.25).toFixed(2))));
      }
      if (event.key === "-") {
        setZoom((value) => Math.max(0.5, Number((value - 0.25).toFixed(2))));
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  return (
    <>
      {photosTarget &&
        createPortal(
          <div className="px-8 pb-3 pt-3">
            <a
              href={OPEN_DECORATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              🖼️ Open Decoration
            </a>
          </div>,
          photosTarget,
        )}

      {videosTarget &&
        createPortal(
          <div className="px-8 pb-8 pt-3">
            <a
              href={DECORATION_VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-amber-700 bg-white px-5 py-2.5 text-sm font-semibold text-amber-800 shadow-sm transition hover:bg-amber-50"
            >
              ▶️ Decoration Videos
            </a>
          </div>,
          videosTarget,
        )}

      {galleryTarget && items.length > 0 &&
        createPortal(
          <div
            className="col-span-full mt-8 w-full px-6 pb-10 pt-2 sm:px-8"
            style={{ gridColumn: "1 / -1" }}
          >
            <div className="mb-5 text-center">
              <h3 className="text-2xl font-bold text-emerald-950">
                Decoration Photos
              </h3>
              <p className="mt-1 text-sm text-emerald-950/70">
                Our latest decoration setups · Click any photo to view it larger
              </p>
            </div>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => openPhoto(item)}
                  className="group overflow-hidden rounded-2xl border border-emerald-900/10 bg-white text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                  aria-label={`Open ${item.name || `Decoration setup ${index + 1}`} photo`}
                >
                  <figure>
                    <img
                      src={`${API_URL}/api/decorations/${item.id}/image`}
                      alt={item.name || `Decoration setup ${index + 1}`}
                      className="block h-auto max-h-[520px] min-h-[280px] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <figcaption className="truncate px-4 py-3 text-sm font-semibold text-emerald-950">
                      {item.name || `Setup ${index + 1}`}
                    </figcaption>
                  </figure>
                </button>
              ))}
            </div>
          </div>,
          galleryTarget,
        )}

      {selected &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Decoration photo viewer"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closePhoto();
            }}
          >
            <div className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center">
              <div className="absolute right-2 top-2 z-10 flex items-center gap-2 rounded-full bg-black/70 p-2 shadow-lg">
                <button
                  type="button"
                  onClick={() =>
                    setZoom((value) => Math.max(0.5, Number((value - 0.25).toFixed(2))))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-gray-900 hover:bg-gray-200"
                  aria-label="Zoom out"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="min-w-16 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
                  aria-label="Reset zoom"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setZoom((value) => Math.min(3, Number((value + 0.25).toFixed(2))))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-gray-900 hover:bg-gray-200"
                  aria-label="Zoom in"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={closePhoto}
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-xl font-bold text-white hover:bg-red-700"
                  aria-label="Close photo viewer"
                >
                  ×
                </button>
              </div>

              <div className="flex max-h-[88vh] max-w-[95vw] items-center justify-center overflow-auto rounded-xl bg-black/30 p-2">
                <img
                  src={`${API_URL}/api/decorations/${selected.id}/image`}
                  alt={selected.name || "Decoration photo"}
                  className="max-h-[84vh] max-w-[90vw] select-none object-contain transition-transform duration-200"
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                />
              </div>
              <p className="mt-3 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white">
                {selected.name || "Decoration photo"} · Use + / − to zoom
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
