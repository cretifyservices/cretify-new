// server.ts
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

// src/data/projects.ts
var PROJECTS = [
  {
    id: "career-growth-tribe",
    name: "Career Growth Tribe",
    year: "2025",
    client: "Career Growth Tribe Ltd.",
    category: "Web apps",
    tagline: "Modern digital ecosystem & automated member acquisition engine",
    description: "An all-in-one learning and talent community platform built with custom membership logic, cohort management, automated onboarding workflows, and frictionless payment handling.",
    deliverables: ["Custom Web App", "Cohort Engine", "WhatsApp Automation", "Stripe & Razorpay Integration"],
    metrics: [
      { label: "Conversion Lift", value: "+42%" },
      { label: "Active Learners", value: "18,000+" },
      { label: "Page Load Speed", value: "0.4s" }
    ],
    accentColor: "#FF5A00",
    liveUrl: "https://careergrowthtribe.com",
    tags: ["Next.js", "Tailwind CSS", "Automation", "Supabase"],
    challenge: "The client was manually juggling Discord onboarding, course unlock links, and payment proofs across WhatsApp DMs, causing high drop-off rates and delayed activations.",
    solution: "Cretify architected a bespoke web platform uniting automated tier verification, instant course onboarding, interactive progress tracking, and dynamic community leaderboards.",
    result: "Reduced manual administrative overhead by 88% while doubling cohort checkout completion speed.",
    gradient: "from-[#FF5A00]/20 via-[#FF5DA2]/15 to-[#6B4DFF]/20",
    mockupType: "dashboard"
  },
  {
    id: "nexus-capital",
    name: "Nexus Capital Systems",
    year: "2025",
    client: "Nexus Capital Partners",
    category: "Web apps",
    tagline: "Institutional wealth management portal with real-time portfolio tracking",
    description: "High-precision fintech web application providing institutional investors with real-time asset valuation, multi-currency reporting, and interactive data visualizations.",
    deliverables: ["Fintech Web App", "Interactive Charts", "Client Portal", "Real-Time Sync"],
    metrics: [
      { label: "Assets Monitored", value: "$84M+" },
      { label: "Latency", value: "<60ms" },
      { label: "Lighthouse Score", value: "99/100" }
    ],
    accentColor: "#6B4DFF",
    liveUrl: "https://nexuscapital.example.com",
    tags: ["React", "TypeScript", "WebSockets", "Tailwind CSS", "D3.js"],
    challenge: "Legacy PDF reports and slow Excel sheets left high-net-worth clients waiting days for quarterly reconciliations and visual portfolio updates.",
    solution: "Engineered a modern web portal featuring sub-second data streaming, bank-grade encryption, and custom financial charting modules.",
    result: "Client retention reached 99.4% and advisors reported saving 12 hours weekly per fund manager.",
    gradient: "from-[#6B4DFF]/25 via-[#38B6FF]/20 to-[#27E3A4]/15",
    mockupType: "dashboard"
  },
  {
    id: "lumina-coffee",
    name: "Lumina Coffee Roasters",
    year: "2024",
    client: "Lumina Craft Beans Co.",
    category: "E-commerce",
    tagline: "High-conversion e-commerce storefront for an artisanal roaster",
    description: "Playful yet luxurious online coffee boutique featuring custom roast subscription builders, bean taste profiles, and lightning-fast mobile checkouts.",
    deliverables: ["Shopify Custom Headless Store", "Subscription Engine", "Taste Quiz", "Mobile-First UI"],
    metrics: [
      { label: "Checkout Conversion", value: "4.8%" },
      { label: "Subscription Retention", value: "76%" },
      { label: "AOV Growth", value: "+34%" }
    ],
    accentColor: "#FF5A00",
    liveUrl: "https://luminacoffee.example.com",
    tags: ["Shopify Plus", "Tailwind CSS", "Framer Motion", "Stripe"],
    challenge: "Artisanal roasters often suffer from template-looking online shops that fail to evoke the aroma, craft, and premium feel of specialty beans.",
    solution: "Designed an interactive flavor wheel and custom bean quiz that guides newcomers straight to their ideal roast, bundled with recurring monthly subscriptions.",
    result: "Drove a 140% increase in repeat subscription orders within 90 days of the new storefront launch.",
    gradient: "from-[#FFC72C]/25 via-[#FF5A00]/20 to-[#FF5DA2]/15",
    mockupType: "browser"
  },
  {
    id: "aether-spatial",
    name: "Aether Spatial Design",
    year: "2024",
    client: "Aether Architecture Studio",
    category: "Branding",
    tagline: "Architectural brand identity and immersive spatial design portfolio",
    description: "An editorial, typography-forward digital gallery capturing physical architecture, museum installations, and ambient lighting concepts with cinematic scroll reveals.",
    deliverables: ["Brand Identity", "Custom Typography", "Editorial Portfolio", "Interactive Blueprint View"],
    metrics: [
      { label: "Award Recognitions", value: "2 Wins" },
      { label: "Avg Session Duration", value: "3m 48s" },
      { label: "Inbound Inquiries", value: "3.2x" }
    ],
    accentColor: "#14110F",
    liveUrl: "https://aetherspatial.example.com",
    tags: ["Branding", "Design System", "Three.js", "React"],
    challenge: "Aether needed their digital presence to match the exact tactile nuance, restraint, and architectural gravitas of their physical spaces.",
    solution: "Crafted a bespoke visual identity and dual-mode blueprint viewer with smooth page transitions, high-contrast typography, and smooth kinetic micro-interactions.",
    result: "Secured three landmark commercial renovation bids directly attributed to the new portfolio.",
    gradient: "from-[#14110F]/30 via-[#6B4DFF]/20 to-[#38B6FF]/15",
    mockupType: "editorial"
  },
  {
    id: "pulse-healthcare",
    name: "Pulse Healthcare Suite",
    year: "2025",
    client: "Pulse MedTech Group",
    category: "Web apps",
    tagline: "Patient health monitoring & diagnostic telehealth interface",
    description: "Clean, approachable healthcare management system connecting remote specialists with chronic care patients through intuitive vital tracking and video check-ins.",
    deliverables: ["Telehealth UI/UX", "HIPAA-Compliant Patient Portal", "Vital Signs Hub", "Doctor Dashboard"],
    metrics: [
      { label: "Active Doctors", value: "450+" },
      { label: "Consultation Rating", value: "4.9/5" },
      { label: "Accessibility", value: "WCAG AAA" }
    ],
    accentColor: "#27E3A4",
    liveUrl: "https://pulsemed.example.com",
    tags: ["React", "TypeScript", "WebRTC", "Tailwind CSS"],
    challenge: "Medical interfaces are notoriously cluttered, intimidating elderly patients and slowing doctors down with convoluted menus.",
    solution: "Designed high-contrast, zero-cognitive-overload screens with large tap targets, audio-guided check-ins, and one-tap video consultations.",
    result: "Reduced patient onboarding drop-offs from 35% down to under 4%, winning staff praise for clarity.",
    gradient: "from-[#27E3A4]/25 via-[#38B6FF]/20 to-[#6B4DFF]/15",
    mockupType: "dashboard"
  },
  {
    id: "hyperion-logistics",
    name: "Hyperion Logistics Engine",
    year: "2025",
    client: "Hyperion Global Freight",
    category: "AI Automation",
    tagline: "AI automation, supply chain orchestration & dispatch intelligence",
    description: "Automated fleet dispatch, live route optimization, and proactive customs document parser delivering real-time shipment transparency across cross-border freight.",
    deliverables: ["Dispatch Automation", "Customs Document OCR", "Route Tracker", "Customer SMS Updates"],
    metrics: [
      { label: "Dispatch Time Cut", value: "70%" },
      { label: "Daily Shipments", value: "14,000+" },
      { label: "Fuel Saved", value: "18%" }
    ],
    accentColor: "#38B6FF",
    liveUrl: "https://hyperion.example.com",
    tags: ["AI Pipelines", "Python Backend", "React Dashboard", "Tailwind CSS"],
    challenge: "Cross-border logistics teams spent hundreds of man-hours each week retyping bill-of-lading documents and recalculating optimal truck routes.",
    solution: "Built automated OCR pipelines with instant OCR validation, live GPS tracking hooks, and customer notification webhooks.",
    result: "Cut average dispatch lag from 4 hours down to under 12 minutes with automated exception handling.",
    gradient: "from-[#38B6FF]/25 via-[#27E3A4]/20 to-[#FFC72C]/15",
    mockupType: "dashboard"
  }
];

// src/data/testimonials.ts
var TESTIMONIALS = [
  {
    id: "dm-1",
    clientName: "Aman Sharma [EDIT]",
    role: "Founder",
    company: "Growth Tribe [EDIT]",
    channel: "WhatsApp",
    time: "Yesterday at 11:42 PM",
    message: "Bro the site is INSANE!! \u{1F525} We had 400 people sign up in the first 2 hours of the drop and not a single glitch. Page load feels instant. Best investment we made this year tbh.",
    rating: 5,
    avatarColor: "#FF5A00"
  },
  {
    id: "dm-2",
    clientName: "Elena Rostova [EDIT]",
    role: "Head of Brand",
    company: "Lumina Roasters [EDIT]",
    channel: "Instagram",
    time: "Tuesday at 4:15 PM",
    message: "Just checked the Shopify analytics... our mobile checkout conversion jumped from 2.1% to 4.8% after the redesign!! The bean quiz is pure gold \u2615\u{1F44F}",
    rating: 5,
    avatarColor: "#6B4DFF"
  },
  {
    id: "dm-3",
    clientName: "Vikram Sengupta [EDIT]",
    role: "Managing Partner",
    company: "Nexus Capital [EDIT]",
    channel: "WhatsApp",
    time: "Friday at 2:09 PM",
    message: "The institutional LP portal went live this morning. Our LPs are literally texting me asking who built the interactive chart views. Super clean engineering guys.",
    rating: 5,
    avatarColor: "#27E3A4"
  },
  {
    id: "dm-4",
    clientName: "Devika Nair [EDIT]",
    role: "Creative Director",
    company: "Aether Studios [EDIT]",
    channel: "Telegram",
    time: "Last week at 6:30 PM",
    message: "Cretify understood our spatial aesthetic from the very first moodboard. Zero corporate fluff, just pure craft and ridiculous attention to typography.",
    rating: 5,
    avatarColor: "#38B6FF"
  },
  {
    id: "dm-5",
    clientName: "Rahul Mehta [EDIT]",
    role: "Co-Founder & COO",
    company: "Hyperion Logistics [EDIT]",
    channel: "WhatsApp",
    time: "Monday at 9:15 AM",
    message: "Your automation script just saved our dispatchers 4 hours every single day. No more manual entry errors. You guys actually deliver ahead of schedule \u{1F680}",
    rating: 5,
    avatarColor: "#FF5DA2"
  }
];

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3e3;
var JWT_SECRET = process.env.JWT_SECRET || "cretify_secret_key_4508_secure_salt_77";
var DATA_DIR = path.resolve(__dirname, "data");
var STORE_PATH = path.resolve(DATA_DIR, "store.json");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
var SEED_PROJECTS = PROJECTS.map((p, idx) => {
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
        reviews: parsed.reviews || TESTIMONIALS,
        inquiries: parsed.inquiries || []
      };
    }
  } catch (err) {
    console.error("Error reading store.json, using defaults:", err);
  }
  const initial = {
    projects: SEED_PROJECTS,
    reviews: TESTIMONIALS,
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
var store = loadStore();
app.use(express.json());
var loginAttempts = /* @__PURE__ */ new Map();
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
