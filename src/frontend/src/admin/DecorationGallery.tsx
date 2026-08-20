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
                Our latest decoration setups
              </p>
            </div>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <figure
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-md"
                >
                  <img
                    src={`${API_URL}/api/decorations/${item.id}/image`}
                    alt={item.name || `Decoration setup ${index + 1}`}
                    className="block h-auto max-h-[520px] min-h-[280px] w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="truncate px-4 py-3 text-sm font-semibold text-emerald-950">
                    {item.name || `Setup ${index + 1}`}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>,
          galleryTarget,
        )}
    </>
  );
}
