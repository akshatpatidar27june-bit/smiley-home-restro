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
const uploadDir = path.join(dataDir, "decorations");
const metadataFile = path.join(dataDir, "decorations.json");
const adminPassword = process.env.ADMIN_PASSWORD;
const adminSecret = process.env.ADMIN_SECRET;
const allowedOrigin = process.env.FRONTEND_ORIGIN || "*";

fs.mkdirSync(uploadDir, { recursive: true });

function readDecorations() {
  try {
    return JSON.parse(fs.readFileSync(metadataFile, "utf8"));
  } catch {
    return [];
  }
}

function writeDecorations(items) {
  fs.writeFileSync(metadataFile, JSON.stringify(items, null, 2));
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
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
      cb(null, `${crypto.randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, /^image\/(jpeg|png|webp|gif|avif)$/.test(file.mimetype));
  },
});

app.use(cors({ origin: allowedOrigin === "*" ? true : allowedOrigin }));
app.use(express.json());
app.use("/uploads", express.static(uploadDir, { maxAge: "7d" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/api/login", (req, res) => {
  if (!adminPassword || !adminSecret) {
    return res.status(503).json({ error: "Admin credentials are not configured on the server." });
  }
  if (typeof req.body?.password !== "string" || req.body.password !== adminPassword) {
    return res.status(401).json({ error: "Incorrect password." });
  }
  return res.json({ token: makeToken() });
});

app.get("/api/decorations", (_req, res) => {
  const items = readDecorations().sort((a, b) => a.order - b.order);
  res.json(items);
});

app.post("/api/decorations", (req, res, next) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized." });
  upload.single("photo")(req, res, (error) => {
    if (error) return next(error);
    if (!req.file) return res.status(400).json({ error: "Please select an image." });

    const items = readDecorations();
    const item = {
      id: crypto.randomUUID(),
      url: `/uploads/${req.file.filename}`,
      name: String(req.body?.name || req.file.originalname || "Decoration"),
      createdAt: new Date().toISOString(),
      order: items.length,
    };
    items.push(item);
    writeDecorations(items);
    return res.status(201).json(item);
  });
});

app.delete("/api/decorations/:id", (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized." });
  const items = readDecorations();
  const item = items.find((entry) => entry.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Decoration not found." });

  const filename = path.basename(item.url);
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  const remaining = items.filter((entry) => entry.id !== item.id).map((entry, index) => ({ ...entry, order: index }));
  writeDecorations(remaining);
  return res.json({ ok: true });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error?.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: "Image must be 10 MB or smaller." });
  return res.status(400).json({ error: error?.message || "Upload failed." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Smiley Home decoration API listening on ${port}`);
});
