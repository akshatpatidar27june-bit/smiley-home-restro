import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const PUBLIC_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const DECORATION_VIDEO_URL = "https://drive.google.com/drive/folders/1ttnP5_i_GvOTX8LtO2NEdRfhSo4X2ZuC?usp=drive_link";

type Decoration = { id: string; name: string; price: number; image_path: string; display_order: number };

function imageUrl(path: string) {
  if (path.startsWith("legacy:")) return `https://raw.githubusercontent.com/akshatpatidar27june-bit/smiley-home-restro/main/${path.slice(7)}`;
  return `${SUPABASE_URL}/storage/v1/object/public/decorations/${encodeURIComponent(path)}`;
}

export default function DecorationGallery() {
  const [videosTarget, setVideosTarget] = useState<HTMLElement | null>(null);
  const [galleryTarget, setGalleryTarget] = useState<HTMLElement | null>(null);
  const [items, setItems] = useState<Decoration[]>([]);
  const [selected, setSelected] = useState<Decoration | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let observer: MutationObserver | undefined;
    let cancelled = false;
    const findTargets = () => {
      const photosCard = document.querySelector<HTMLElement>('[data-ocid="decoration.photos.card"]');
      const videos = document.querySelector<HTMLElement>('[data-ocid="decoration.videos.card"]');
      photosCard?.remove();
      if (!cancelled) { setVideosTarget(videos); setGalleryTarget(videos?.parentElement || null); }
      return videos;
    };
    findTargets();
    observer = new MutationObserver(findTargets);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => { cancelled = true; observer?.disconnect(); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!SUPABASE_URL || !PUBLIC_KEY) return;
    fetch(`${SUPABASE_URL}/rest/v1/decorations?select=id,name,price,image_path,display_order&order=display_order.asc,created_at.desc`, {
      headers: { apikey: PUBLIC_KEY, Authorization: `Bearer ${PUBLIC_KEY}` },
    }).then(async (response) => {
      if (!response.ok) throw new Error("Unable to load decoration photos");
      return response.json();
    }).then((data: Decoration[]) => { if (!cancelled) setItems(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setItems([]); });
    return () => { cancelled = true; };
  }, []);

  const openPhoto = (item: Decoration) => { setSelected(item); setZoom(1); };
  const closePhoto = () => { setSelected(null); setZoom(1); };

  useEffect(() => {
    if (!selected) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePhoto();
      if (event.key === "+" || event.key === "=") setZoom((v) => Math.min(3, Number((v + 0.25).toFixed(2))));
      if (event.key === "-") setZoom((v) => Math.max(0.5, Number((v - 0.25).toFixed(2))));
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  useEffect(() => {
    if (!galleryTarget || !videosTarget) return;
    const move = () => {
      const gallery = galleryTarget.querySelector<HTMLElement>('[data-smiley-decoration-gallery="true"]');
      if (gallery && gallery.nextElementSibling !== videosTarget) galleryTarget.insertBefore(gallery, videosTarget);
    };
    move();
    const observer = new MutationObserver(move);
    observer.observe(galleryTarget, { childList: true });
    return () => observer.disconnect();
  }, [galleryTarget, videosTarget, items.length]);

  return <>
    {videosTarget && createPortal(<div className="px-8 pb-8 pt-3"><a href={DECORATION_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-amber-700 bg-white px-5 py-2.5 text-sm font-semibold text-amber-800 shadow-sm transition hover:bg-amber-50">▶️ Decoration Videos</a></div>, videosTarget)}
    {galleryTarget && items.length > 0 && createPortal(
      <div data-smiley-decoration-gallery="true" className="col-span-full mt-8 w-full px-6 pb-10 pt-2 sm:px-8" style={{ gridColumn: "1 / -1" }}>
        <div className="mb-5 text-center"><h3 className="text-2xl font-bold text-emerald-950">Decoration Photos</h3><p className="mt-1 text-sm text-emerald-950/70">Our latest decoration setups · Click any photo to view it larger</p></div>
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => <button type="button" key={item.id} onClick={() => openPhoto(item)} className="group overflow-hidden rounded-2xl border border-emerald-900/10 bg-white text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2" aria-label={`Open ${item.name || `Decoration setup ${index + 1}`} photo`}>
            <figure><img src={imageUrl(item.image_path)} alt={item.name || `Decoration setup ${index + 1}`} className="block h-auto max-h-[520px] min-h-[280px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" loading="lazy" />
              <figcaption className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-emerald-950"><span className="truncate">{item.name || `Setup ${index + 1}`}</span>{Number(item.price) > 0 && <span className="shrink-0 text-emerald-800">₹{Number(item.price).toLocaleString("en-IN")}</span>}</figcaption>
            </figure>
          </button>)}
        </div>
      </div>, galleryTarget)}
    {selected && createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Decoration photo viewer" onMouseDown={(event) => { if (event.target === event.currentTarget) closePhoto(); }}>
        <div className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center">
          <div className="absolute right-2 top-2 z-10 flex items-center gap-2 rounded-full bg-black/70 p-2 shadow-lg">
            <button type="button" onClick={() => setZoom((v) => Math.max(0.5, Number((v - 0.25).toFixed(2))))} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-gray-900" aria-label="Zoom out">−</button>
            <button type="button" onClick={() => setZoom(1)} className="min-w-16 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900">{Math.round(zoom * 100)}%</button>
            <button type="button" onClick={() => setZoom((v) => Math.min(3, Number((v + 0.25).toFixed(2))))} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-gray-900" aria-label="Zoom in">+</button>
            <button type="button" onClick={closePhoto} className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-xl font-bold text-white" aria-label="Close photo viewer">×</button>
          </div>
          <div className="flex max-h-[88vh] max-w-[95vw] items-center justify-center overflow-auto rounded-xl bg-black/30 p-2"><img src={imageUrl(selected.image_path)} alt={selected.name || "Decoration photo"} className="max-h-[84vh] max-w-[90vw] select-none object-contain transition-transform duration-200" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }} /></div>
          <p className="mt-3 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white">{selected.name || "Decoration photo"}{Number(selected.price) > 0 ? ` · ₹${Number(selected.price).toLocaleString("en-IN")}` : ""} · Use + / − to zoom</p>
        </div>
      </div>, document.body)}
  </>;
}
