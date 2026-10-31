import { useEffect, useState } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const ADMIN_ENDPOINT = `${SUPABASE_URL}/functions/v1/decoration-admin`;
const PUBLIC_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

type Decoration = {
  id: string;
  name: string;
  price: number;
  image_path: string;
  display_order: number;
  created_at: string;
};

function imageUrl(path: string) {
  if (path.startsWith("legacy:")) {
    return `https://raw.githubusercontent.com/akshatpatidar27june-bit/smiley-home-restro/main/${path.slice(7)}`;
  }
  return `${SUPABASE_URL}/storage/v1/object/public/decorations/${encodeURIComponent(path)}`;
}

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("0");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingPrice, setEditingPrice] = useState("0");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function request(path: string, init: RequestInit = {}) {
    const response = await fetch(`${ADMIN_ENDPOINT}${path}`, {
      ...init,
      headers: {
        apikey: PUBLIC_KEY,
        "x-admin-password": password,
        ...(init.headers || {}),
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed.");
    return data;
  }

  async function loadDecorations() {
    const data = await request("/list");
    setDecorations(Array.isArray(data) ? data : []);
  }

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await loadDecorations();
      setAuthenticated(true);
      setMessage("Welcome. Your decoration gallery is ready.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect password.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadPhoto(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return setError("Please choose a photo.");
    setBusy(true); setError(""); setMessage("");
    try {
      const form = new FormData();
      form.append("photo", file);
      form.append("name", name.trim() || file.name);
      form.append("price", price);
      const data = await request("/upload", { method: "POST", body: form });
      setDecorations((items) => [...items, data]);
      setFile(null); setName(""); setPrice("0");
      const input = document.getElementById("decoration-file") as HTMLInputElement | null;
      if (input) input.value = "";
      setMessage("Photo uploaded and published to the website.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally { setBusy(false); }
  }

  function startEditing(item: Decoration) {
    setEditingId(item.id); setEditingName(item.name); setEditingPrice(String(item.price ?? 0));
  }

  async function saveEdit(id: string) {
    const nextName = editingName.trim();
    const nextPrice = Number(editingPrice);
    if (!nextName) return setError("Decoration name cannot be empty.");
    if (!Number.isFinite(nextPrice) || nextPrice < 0) return setError("Enter a valid price.");
    setBusy(true); setError(""); setMessage("");
    try {
      const data = await request(`/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nextName, price: nextPrice }),
      });
      setDecorations((items) => items.map((item) => item.id === id ? data : item));
      setEditingId(null); setMessage("Name and price updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally { setBusy(false); }
  }

  async function removePhoto(item: Decoration) {
    if (!window.confirm(`Delete "${item.name}" from the website?`)) return;
    setBusy(true); setError(""); setMessage("");
    try {
      await request(`/${item.id}`, { method: "DELETE" });
      setDecorations((items) => items.filter((entry) => entry.id !== item.id));
      setMessage("Decoration deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally { setBusy(false); }
  }

  function logout() {
    setAuthenticated(false); setPassword(""); setDecorations([]);
    setMessage(""); setError(""); setEditingId(null);
  }

  if (!SUPABASE_URL || !PUBLIC_KEY) {
    return <div className="min-h-screen bg-slate-950 text-white grid place-items-center p-6"><div className="max-w-lg rounded-2xl bg-white/10 p-8"><h1 className="text-2xl font-bold">Smiley Home Admin</h1><p className="mt-3 text-white/75">Supabase environment variables are not configured for this deployment yet.</p></div></div>;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <form onSubmit={login} className="w-full max-w-md rounded-2xl bg-white p-8 text-slate-900 shadow-2xl">
          <p className="text-sm font-semibold text-emerald-700">SMILEY HOME RESTAURANT</p>
          <h1 className="text-3xl font-bold mt-1">Decoration Admin</h1>
          <p className="text-slate-500 mt-2 mb-7">Enter your admin password to continue.</p>
          <label className="block text-sm font-semibold mb-2" htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600" autoComplete="current-password" />
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button disabled={busy} className="w-full mt-5 rounded-xl bg-emerald-800 text-white py-3 font-semibold disabled:opacity-50">{busy ? "Checking..." : "Sign in"}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-emerald-950 text-white px-5 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div><p className="text-xs tracking-widest text-emerald-200">SMILEY HOME RESTAURANT</p><h1 className="text-2xl font-bold">Decoration Panel</h1></div>
          <button onClick={logout} className="rounded-lg border border-white/20 px-4 py-2 text-sm">Logout</button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-5 sm:p-8">
        {message && <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-800">{message}</div>}
        {error && <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">{error}</div>}
        <section className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-1">Add decoration photo</h2>
          <p className="text-sm text-slate-500 mb-5">Upload a photo, set its name and price. It will appear on the public website.</p>
          <form onSubmit={uploadPhoto} className="grid md:grid-cols-[1fr_1fr_160px_auto] gap-4 items-end">
            <div><label className="block text-sm font-semibold mb-2" htmlFor="decoration-file">Photo</label><input id="decoration-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full rounded-xl border border-slate-300 p-2.5" /><p className="text-xs text-slate-400 mt-1">Maximum 10 MB</p></div>
            <div><label className="block text-sm font-semibold mb-2" htmlFor="decoration-name">Decoration name</label><input id="decoration-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Birthday setup" className="w-full rounded-xl border border-slate-300 px-3 py-3" /></div>
            <div><label className="block text-sm font-semibold mb-2" htmlFor="decoration-price">Price (₹)</label><input id="decoration-price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-3" /></div>
            <button disabled={busy || !file} className="rounded-xl bg-emerald-800 text-white px-6 py-3 font-semibold disabled:opacity-40">{busy ? "Working..." : "Upload Photo"}</button>
          </form>
        </section>
        <section>
          <div className="mb-4"><h2 className="text-xl font-bold">Live decoration photos</h2><p className="text-sm text-slate-500">{decorations.length} photos published</p></div>
          {decorations.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No decoration photos yet.</div> : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {decorations.map((item) => <article key={item.id} className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                <img src={imageUrl(item.image_path)} alt={item.name} className="w-full aspect-square object-cover" />
                <div className="p-3">
                  {editingId === item.id ? <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-500">Decoration name</label><input value={editingName} onChange={(e) => setEditingName(e.target.value)} maxLength={120} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    <label className="block text-xs font-semibold text-slate-500">Price (₹)</label><input type="number" min="0" step="0.01" value={editingPrice} onChange={(e) => setEditingPrice(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    <div className="grid grid-cols-2 gap-2"><button onClick={() => void saveEdit(item.id)} disabled={busy} className="rounded-lg bg-emerald-800 text-white py-2 text-sm font-semibold">Save</button><button onClick={() => setEditingId(null)} disabled={busy} className="rounded-lg border border-slate-300 py-2 text-sm">Cancel</button></div>
                  </div> : <>
                    <p className="font-semibold truncate" title={item.name}>{item.name}</p><p className="mt-1 text-sm text-emerald-800 font-bold">₹{Number(item.price || 0).toLocaleString("en-IN")}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => startEditing(item)} disabled={busy} className="rounded-lg border border-emerald-200 text-emerald-700 py-2 text-sm font-semibold">Edit</button><button onClick={() => void removePhoto(item)} disabled={busy} className="rounded-lg border border-red-200 text-red-600 py-2 text-sm font-semibold">Delete</button></div>
                  </>}
                </div>
              </article>)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
