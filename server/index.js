import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import multer from "multer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 10000);
const dataDir = process.env.DATA_DIR || path.resolve(__dirname, "../data");
const adminPassword = process.env.ADMIN_PASSWORD;
const adminSecret = process.env.ADMIN_SECRET;
const allowedOrigin = process.env.FRONTEND_ORIGIN || "*";

const githubToken = process.env.GITHUB_TOKEN;
const githubRepo = process.env.GITHUB_REPO || "akshatpatidar27june-bit/smiley-home-restro";
const githubBranch = process.env.GITHUB_BRANCH || "main";
const githubFolder = (process.env.GITHUB_DECORATION_FOLDER || "public/decorations").replace(/^\/+|\/+$/g, "");
const githubMetadataPath = `${githubFolder}/decorations.json`;

fs.mkdirSync(dataDir, { recursive: true });

function githubConfigured() {
  return Boolean(githubToken && githubRepo);
}

async function githubRequest(pathname, options = {}) {
  if (!githubConfigured()) throw new Error("GitHub storage is not configured on the server.");
  const response = await fetch(`https://api.github.com${pathname}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok) {
    const message = body?.message || `GitHub request failed (${response.status})`;
    throw new Error(message);
  }
  return body;
}

async function getGithubFile(filePath) {
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  try {
    return await githubRequest(`/repos/${githubRepo}/contents/${encodedPath}?ref=${encodeURIComponent(githubBranch)}`);
  } catch (error) {
    if (String(error.message).toLowerCase().includes("not found")) return null;
    throw error;
  }
}

async function getDecorations() {
  const file = await getGithubFile(githubMetadataPath);
  if (!file) return [];
  const decoded = Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8");
  try {
    return JSON.parse(decoded);
  } catch {
    return [];
  }
}

async function putGithubFile(filePath, contentBuffer, message, existingSha = null) {
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  const body = {
    message,
    content: Buffer.isBuffer(contentBuffer) ? contentBuffer.toString("base64") : Buffer.from(contentBuffer).toString("base64"),
    branch: githubBranch,
  };
  if (existingSha) body.sha = existingSha;
  return githubRequest(`/repos/${githubRepo}/contents/${encodedPath}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function deleteGithubFile(filePath, sha, message) {
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  return githubRequest(`/repos/${githubRepo}/contents/${encodedPath}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha, branch: githubBranch }),
  });
}

async function saveDecorations(items, existingSha = null) {
  return putGithubFile(githubMetadataPath, Buffer.from(JSON.stringify(items, null, 2)), "Update decoration gallery metadata", existingSha);
}

function sign(value) {
  return crypto.createHmac("sha256", adminSecret || "missing-secret").update(value).digest("hex");
}

function makeToken() {
  const payload = Buffer.from(`admin:${Date.now()}`).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function isAuthorized(req) {
  if (!adminSecret) return false;
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return false;
  const token = header.slice(7);
  const [payload, signature] = token.split(".");
  if (!payload || !signature || signature.length !== 64) return false;
  const expected = sign(payload);
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, /^image\/(jpeg|png|webp|gif|avif)$/.test(file.mimetype));
  },
});

app.use(cors({ origin: allowedOrigin === "*" ? true : allowedOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true, githubStorage: githubConfigured() }));

app.post("/api/login", (req, res) => {
  if (!adminPassword || !adminSecret) {
    return res.status(503).json({ error: "Admin credentials are not configured on the server." });
  }
  if (typeof req.body?.password !== "string" || req.body.password !== adminPassword) {
    return res.status(401).json({ error: "Incorrect password." });
  }
  return res.json({ token: makeToken() });
});

app.get("/api/decorations", async (_req, res, next) => {
  try {
    const items = (await getDecorations()).sort((a, b) => a.order - b.order);
    res.json(items);
  } catch (error) {
    next(error);
  }
});

app.post("/api/decorations", (req, res, next) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized." });
  upload.single("photo")(req, res, async (error) => {
    if (error) return next(error);
    if (!req.file) return res.status(400).json({ error: "Please select an image." });
    try {
      if (!githubConfigured()) return res.status(503).json({ error: "GitHub storage is not configured on the server." });

      const items = await getDecorations();
      const extension = path.extname(req.file.originalname).toLowerCase() || ".jpg";
      const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;
      const filePath = `${githubFolder}/${filename}`;

      await putGithubFile(filePath, req.file.buffer, `Add decoration image ${filename}`);

      const rawUrl = `https://raw.githubusercontent.com/${githubRepo}/${githubBranch}/${filePath.split("/").map(encodeURIComponent).join("/")}`;
      const item = {
        id: crypto.randomUUID(),
        url: rawUrl,
        name: String(req.body?.name || req.file.originalname || "Decoration"),
        createdAt: new Date().toISOString(),
        order: items.length,
        githubPath: filePath,
      };
      const updatedItems = [...items, item];
      const metadataFile = await getGithubFile(githubMetadataPath);
      await saveDecorations(updatedItems, metadataFile?.sha || null);
      return res.status(201).json(item);
    } catch (uploadError) {
      return next(uploadError);
    }
  });
});

app.delete("/api/decorations/:id", async (req, res, next) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized." });
  try {
    const items = await getDecorations();
    const item = items.find((entry) => entry.id === req.params.id);
    if (!item) return res.status(404).json({ error: "Decoration not found." });

    if (item.githubPath) {
      const imageFile = await getGithubFile(item.githubPath);
      if (imageFile?.sha) await deleteGithubFile(item.githubPath, imageFile.sha, `Delete decoration image ${path.basename(item.githubPath)}`);
    }

    const remaining = items.filter((entry) => entry.id !== item.id).map((entry, index) => ({ ...entry, order: index }));
    const metadataFile = await getGithubFile(githubMetadataPath);
    await saveDecorations(remaining, metadataFile?.sha || null);
    return res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error?.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: "Image must be 10 MB or smaller." });
  return res.status(400).json({ error: error?.message || "Upload failed." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Smiley Home decoration API listening on ${port}`);
});
