import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const API_URL = "https://smiley-home-decoration-api.onrender.com";

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
