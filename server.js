import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import { PROJECTS as DEFAULT_PROJECTS } from "./src/data/projects";
import { TESTIMONIALS as DEFAULT_TESTIMONIALS } from "./src/data/testimonials";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3e3;
const JWT_SECRET = process.env.JWT_SECRET || "cretify_secret_key_4508_secure_salt_77";
const DATA_DIR = path.resolve(__dirname, "data");
const STORE_PATH = path.resolve(DATA_DIR, "store.json");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const SEED_PROJECTS = DEFAULT_PROJECTS.map((p, idx) => {
  const sampleImages = [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
  ];
  return {
    ...p,
    imageUrl: sampleImages[idx % sampleImages.length]
  };
});
function loadStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        projects: parsed.projects || SEED_PROJECTS,
        reviews: parsed.reviews || DEFAULT_TESTIMONIALS,
        inquiries: parsed.inquiries || []
      };
    }
  } catch (err) {
    console.error("Error reading store.json, using defaults:", err);
  }
  const initial = {
    projects: SEED_PROJECTS,
    reviews: DEFAULT_TESTIMONIALS,
    inquiries: []
  };
  saveStore(initial);
  return initial;
}
function saveStore(data) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving store.json:", err);
  }
}
let store = loadStore();
app.use(express.json());
const loginAttempts = /* @__PURE__ */ new Map();
function rateLimitLogin(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (record && record.resetTime > now) {
    if (record.count >= 5) {
      return res.status(429).json({ error: "Too many login attempts. Please try again in 15 minutes." });
    }
  } else {
    loginAttempts.set(ip, { count: 0, resetTime: now + 15 * 60 * 1e3 });
  }
  next();
}
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: missing or invalid authorization header" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.username === "cretifyservices4508") {
      next();
    } else {
      res.status(403).json({ error: "Forbidden: invalid credentials" });
    }
  } catch {
    res.status(401).json({ error: "Unauthorized: token expired or invalid" });
  }
}
app.post("/api/auth/login", rateLimitLogin, (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  if (username === "cretifyservices4508" && password === "Cretify@4508") {
    loginAttempts.delete(ip);
    const token = jwt.sign({ username, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ success: true, token, username });
  }
  const record = loginAttempts.get(ip);
  if (record) {
    record.count += 1;
  }
  return res.status(401).json({ error: "Invalid username or password" });
});
app.get("/api/auth/verify", requireAdmin, (req, res) => {
  res.json({ valid: true, username: "cretifyservices4508" });
});
app.get("/api/projects", (_req, res) => {
  res.json(store.projects);
});
app.post("/api/projects", requireAdmin, (req, res) => {
  const newProject = {
    ...req.body,
    id: req.body.id || `proj-${Date.now()}`
  };
  store.projects.unshift(newProject);
  saveStore(store);
  res.status(201).json(newProject);
});
app.put("/api/projects/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = store.projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }
  store.projects[index] = { ...store.projects[index], ...req.body, id };
  saveStore(store);
  res.json(store.projects[index]);
});
app.delete("/api/projects/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  store.projects = store.projects.filter((p) => p.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});
app.post("/api/projects/import", requireAdmin, (req, res) => {
  try {
    const { projects: importedProjects, mode } = req.body;
    if (!Array.isArray(importedProjects)) {
      return res.status(400).json({ error: "Expected an array of projects in { projects: [...] }" });
    }
    const validated = importedProjects.map((p, idx) => ({
      id: p.id || `proj-${Date.now()}-${idx}`,
      name: p.name || "Untitled Project",
      year: p.year || (/* @__PURE__ */ new Date()).getFullYear().toString(),
      client: p.client || "Client",
      category: p.category || "Web development",
      tagline: p.tagline || "",
      description: p.description || "",
      imageUrl: p.imageUrl || "",
      liveUrl: p.liveUrl || "https://",
      accentColor: p.accentColor || "#FF5A00",
      gradient: p.gradient || "from-[#FF5A00]/25 to-[#6B4DFF]/20",
      tags: Array.isArray(p.tags) ? p.tags : ["Digital Experience"],
      deliverables: Array.isArray(p.deliverables) ? p.deliverables : ["Full-Stack Engineering"],
      metrics: Array.isArray(p.metrics) ? p.metrics : [],
      challenge: p.challenge || "",
      solution: p.solution || "",
      result: p.result || "",
      mockupType: p.mockupType || "dashboard"
    }));
    if (mode === "replace") {
      store.projects = validated;
    } else {
      const existingMap = new Map(store.projects.map((p) => [p.id, p]));
      validated.forEach((p) => existingMap.set(p.id, p));
      store.projects = Array.from(existingMap.values());
    }
    saveStore(store);
    res.json({ success: true, count: store.projects.length, projects: store.projects });
  } catch (err) {
    res.status(500).json({ error: err.message || "Import failed" });
  }
});
app.get("/api/reviews", (_req, res) => {
  res.json(store.reviews);
});
app.post("/api/reviews", requireAdmin, (req, res) => {
  const newReview = {
    ...req.body,
    id: req.body.id || `review-${Date.now()}`
  };
  store.reviews.unshift(newReview);
  saveStore(store);
  res.status(201).json(newReview);
});
app.delete("/api/reviews/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  store.reviews = store.reviews.filter((r) => r.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});
app.post("/api/inquiries", (req, res) => {
  const inquiry = {
    id: `inq-${Date.now()}`,
    ...req.body,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  store.inquiries.unshift(inquiry);
  saveStore(store);
  res.status(201).json({ success: true, inquiry });
});
app.get("/api/inquiries", requireAdmin, (_req, res) => {
  res.json(store.inquiries);
});
app.delete("/api/inquiries/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  store.inquiries = store.inquiries.filter((inq) => inq.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});
async function setupFrontend() {
  if (process.env.NODE_ENV === "production" || fs.existsSync(path.resolve(__dirname, "dist/index.html"))) {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, () => {
    console.log(`Cretify Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}
setupFrontend().catch((err) => {
  console.error("Failed to start server:", err);
});
