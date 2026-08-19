import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const API_URL = "https://smiley-home-decoration-api.onrender.com";
const OPEN_DECORATION_URL = "https://drive.google.com/file/d/1yrQTuCsDCj_MUC6N3IyPuI_dtbpg5kKb/preview";
const DECORATION_VIDEO_URL = "https://drive.google.com/drive/folders/1ttnP5_i_GvOTX8LtO2NEdRfhSo4X2ZuC?usp=drive_link";

type Decoration = {
  id: string;
  url: string;
  name: string;
  order: number;
};

export default function DecorationGallery() {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [items, setItems] = useState<Decoration[]>([]);

  useEffect(() => {
    let observer: MutationObserver | undefined;
    let cancelled = false;

    const findTarget = () => {
      const element = document.querySelector<HTMLElement>('[data-ocid="decoration.photos.card"]');
      if (element && !cancelled) setTarget(element);
      return element;
    };

    findTarget();
    observer = new MutationObserver(findTarget);
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

  if (!target || items.length === 0) return null;

  return createPortal(
    <div className="px-8 pb-8 pt-2">
      <div className="mb-5 flex flex-wrap gap-3">
        <a
          href={OPEN_DECORATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
        >
          Open Decoration
        </a>
        <a
          href={DECORATION_VIDEO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-emerald-900 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
        >
          Decoration Videos
        </a>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, index) => (
          <figure key={item.id} className="overflow-hidden rounded-xl border border-emerald-900/10 bg-white shadow-sm">
            <img
              src={`${API_URL}${item.url}`}
              alt={item.name || `Decoration setup ${index + 1}`}
              className="aspect-square w-full object-cover"
              loading="lazy"
            />
            <figcaption className="truncate px-3 py-2 text-xs font-semibold text-emerald-950">
              {item.name || `Setup ${index + 1}`}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>,
    target,
  );
}
