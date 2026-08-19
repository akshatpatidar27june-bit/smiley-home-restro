import { useEffect, useMemo, useState } from "react";

const API_URL = (import.meta.env.VITE_DECORATION_API_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "smiley_home_admin_token";

type Decoration = {
  id: string;
  url: string;
  name: string;
  createdAt: string;
  order: number;
};

function apiUrl(path: string) {
  return `${API_URL}${path}`;
}

export default function AdminPanel() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [password, setPassword] = useState("");
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isConfigured = useMemo(() => Boolean(API_URL), []);

  async function loadDecorations() {
    try {
      const response = await fetch(apiUrl("/api/decorations"));
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load decorations.");
      setDecorations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load decorations.");
    }
  }

  useEffect(() => {
    if (isConfigured) void loadDecorations();
  }, [isConfigured]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(apiUrl("/api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed.");
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setPassword("");
      setMessage("Logged in successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadPhoto(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Please select a photo first.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const form = new FormData();
      form.append("photo", file);
      form.append("name", name.trim() || file.name);
      const response = await fetch(apiUrl("/api/decorations"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      setDecorations((items) => [...items, data]);
      setFile(null);
      setName("");
      const input = document.getElementById("decoration-file") as HTMLInputElement | null;
      if (input) input.value = "";
      setMessage("Decoration photo added. It is now live on the website.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto(id: string) {
    if (!window.confirm("Delete this decoration photo?")) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(apiUrl(`/api/decorations/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Delete failed.");
      setDecorations((items) => items.filter((item) => item.id !== id));
      setMessage("Decoration photo deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setMessage("");
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full rounded-2xl bg-white/10 border border-white/10 p-8">
          <h1 className="text-2xl font-bold mb-3">Smiley Home Admin</h1>
          <p className="text-white/70">The Render API URL is not configured. Add VITE_DECORATION_API_URL to the frontend deployment.</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <form onSubmit={login} className="w-full max-w-md rounded-2xl bg-white p-8 text-slate-900 shadow-2xl">
          <div className="mb-7">
            <p className="text-sm font-semibold text-emerald-700">SMILEY HOME RESTAURANT</p>
            <h1 className="text-3xl font-bold mt-1">Decoration Admin</h1>
            <p className="text-slate-500 mt-2">Sign in to manage decoration photos.</p>
          </div>
          <label className="block text-sm font-semibold mb-2" htmlFor="admin-password">Admin password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-600"
            autoComplete="current-password"
          />
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button disabled={busy} className="w-full mt-5 rounded-xl bg-emerald-800 text-white py-3 font-semibold disabled:opacity-50">
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-emerald-950 text-white px-5 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-widest text-emerald-200">SMILEY HOME RESTAURANT</p>
            <h1 className="text-2xl font-bold">Decoration Panel</h1>
          </div>
          <button onClick={logout} className="rounded-lg border border-white/20 px-4 py-2 text-sm">Logout</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-5 sm:p-8">
        {message && <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-800">{message}</div>}
        {error && <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">{error}</div>}

        <section className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm mb-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold">Add decoration photo</h2>
            <p className="text-sm text-slate-500 mt-1">Upload an image and it will automatically appear in the website's Decoration section.</p>
          </div>
          <form onSubmit={uploadPhoto} className="grid md:grid-cols-[1fr_220px_auto] gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="decoration-file">Photo</label>
              <input id="decoration-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={(event) => setFile(event.target.files?.[0] || null)} className="w-full rounded-xl border border-slate-300 p-2.5" />
              <p className="text-xs text-slate-400 mt-1">Maximum 10 MB</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="decoration-name">Name (optional)</label>
              <input id="decoration-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Birthday setup" className="w-full rounded-xl border border-slate-300 px-3 py-3" />
            </div>
            <button disabled={busy || !file} className="rounded-xl bg-emerald-800 text-white px-6 py-3 font-semibold disabled:opacity-40">{busy ? "Uploading..." : "Upload Photo"}</button>
          </form>
        </section>

        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Live decoration photos</h2>
              <p className="text-sm text-slate-500">{decorations.length} photo{decorations.length === 1 ? "" : "s"} currently published</p>
            </div>
          </div>
          {decorations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No decoration photos uploaded yet.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {decorations.map((item) => (
                <article key={item.id} className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                  <img src={`${API_URL}${item.url}`} alt={item.name} className="w-full aspect-square object-cover" />
                  <div className="p-3">
                    <p className="font-semibold truncate" title={item.name}>{item.name}</p>
                    <button onClick={() => removePhoto(item.id)} disabled={busy} className="mt-3 w-full rounded-lg border border-red-200 text-red-600 py-2 text-sm font-semibold disabled:opacity-50">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
