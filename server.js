// server.ts
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

// src/data/projects.ts
var PROJECTS = [
  {
    id: "shrungar-ornament",
    name: "Shrungar Ornament",
    client: "Shrungar Silver House",
    category: "E-commerce",
    tagline: "A premium e-commerce experience for Shrungar Silver House. Built to showcase every piece, simplify orders and connect with retailers and customers.",
    description: "A luxury silver and gold jewellery e-commerce storefront crafted to showcase artisanal collections with high-detail product zooms, instant order inquiries, and fluid mobile purchasing.",
    deliverables: ["E-Commerce Storefront", "High-Res Product Showcase", "Order Checkout Flow", "Mobile Responsive UI"],
    metrics: [
      { label: "Catalog Browsing", value: "3.4x" },
      { label: "Mobile Conversion", value: "+48%" },
      { label: "Load Speed", value: "0.5s" }
    ],
    accentColor: "#D4AF37",
    liveUrl: "https://orchid-narwhal-585208.hostingersite.com/",
    imageUrl: "https://res.cloudinary.com/npvenpir/image/upload/v1791884171/5067beae-f5d9-4952-9b54-31bec7d808a0.jpg",
    tags: ["E-commerce", "Ornament", "Jewellery", "Shopify"],
    challenge: "High-end silver and jewellery brands need digital storefronts that convey luxury tactile refinement while maintaining effortless catalog navigation and mobile checkouts.",
    solution: "Designed and engineered a high-performance visual storefront featuring rich product imagery, clean category filtering, and direct WhatsApp / payment order flows.",
    result: "Delivered an opulent, modern digital presence that drives direct retail and wholesale orders.",
    gradient: "from-[#D4AF37]/25 via-[#FF5A00]/15 to-[#14110F]/20",
    mockupType: "browser"
  },
  {
    id: "alfa-bakery",
    name: "Alfa Bakery",
    client: "Career Growth Tribe (Rajan Kumar Prasad)",
    category: "Web apps",
    tagline: "Freshly Baked Happiness, Every Day \u2014 Crafted with love, served with warmth, and baked to perfection.",
    description: "A mouthwatering digital storefront and ordering platform for an artisan bakery, featuring daily menu rotation, custom cake pre-orders, and local delivery routing.",
    deliverables: ["Digital Menu & Ordering", "Pastry Showcase", "Local Delivery Tracker", "Responsive UI"],
    metrics: [
      { label: "Online Orders", value: "+65%" },
      { label: "Repeat Customers", value: "78%" },
      { label: "Mobile Score", value: "98/100" }
    ],
    accentColor: "#FF9900",
    liveUrl: "https://azure-mandrill-352221.hostingersite.com/",
    imageUrl: "https://res.cloudinary.com/npvenpir/image/upload/v1791697702/5cbd0f6b-20d4-4d9c-9367-e09501482d5f.jpg",
    tags: ["Artisan Baking", "Fresh Pastries", "Online Orders", "Responsive Web"],
    challenge: "Traditional bakeries struggle to translate the warm, mouthwatering aroma and freshness of their kitchen to digital screens without slow, cluttered photo galleries.",
    solution: "Built a clean, appetizing digital storefront highlighting freshly baked daily batches, real-time inventory updates, and fast mobile pre-ordering.",
    result: "Increased daily morning pre-orders by 65% and streamlined kitchen order fulfillment.",
    gradient: "from-[#FF9900]/25 via-[#FF5A00]/15 to-[#6B4DFF]/15",
    mockupType: "browser"
  },
  {
    id: "anna-seva",
    name: "Anna Seva",
    client: "Nexus Capital Advisory",
    category: "Web apps",
    tagline: "Turn Your Vision Into Business Growth \u2014 Build smarter strategies, stronger leadership, and a business designed to scale.",
    description: "An empowering executive advisory and community initiative web platform offering strategic consulting booking, leadership playbooks, and automated client intake.",
    deliverables: ["Executive Advisory Portal", "Client Consultation Booking", "Strategic Playbook Library", "Lead Pipeline"],
    metrics: [
      { label: "Inbound Inquiries", value: "3.1x" },
      { label: "Client Booking Speed", value: "<2m" },
      { label: "Advisory Retainers", value: "+52%" }
    ],
    accentColor: "#6B4DFF",
    liveUrl: "https://mediumvioletred-snake-657825.hostingersite.com/",
    imageUrl: "https://res.cloudinary.com/npvenpir/image/upload/v1791697051/d4c21e63-9923-4463-92bd-bef7f1e50d44.jpg",
    tags: ["Business Strategy", "Leadership", "Advisory", "Next.js"],
    challenge: "High-level leadership and advisory practices require a web presence that communicates gravitas, clarity, and deep strategic confidence.",
    solution: "Architected a clean, high-conversion consultation website with integrated discovery questionnaires and calendar sync.",
    result: "Elevated client inquiry conversion rates and established immediate tier-one credibility.",
    gradient: "from-[#6B4DFF]/25 via-[#38B6FF]/20 to-[#27E3A4]/15",
    mockupType: "dashboard"
  },
  {
    id: "fawzaana-furniture",
    name: "FAWZAANA Furniture",
    client: "Lumina Specialty Coffee",
    category: "E-commerce",
    tagline: "Thoughtful Design, Timeless Comfort \u2014 Beautifully crafted furniture that brings functionality, elegance, and warmth to every space.",
    description: "An elegant digital catalog and e-commerce showroom showcasing bespoke wooden furniture, architectural decor, and custom room layout visualizers.",
    deliverables: ["E-Commerce Storefront", "Room Concept Visualizer", "Custom Dimension Configurator", "Shipping Matrix"],
    metrics: [
      { label: "Catalog Browsing Time", value: "4m 12s" },
      { label: "Average Order Value", value: "+38%" },
      { label: "Inquiry Volume", value: "2.8x" }
    ],
    accentColor: "#C28E5C",
    liveUrl: "http://antiquewhite-horse-694804.hostingersite.com/",
    imageUrl: "https://res.cloudinary.com/npvenpir/image/upload/v1791696614/1e1766d0-1a38-44b3-bfe5-e4629487239f.jpg",
    tags: ["Crafted Furniture", "Modern Interiors", "E-Commerce", "3D Showcase"],
    challenge: "Selling premium artisan furniture online demands convincing customers of build quality, wood textures, and spatial proportions through the screen.",
    solution: "Engineered a high-definition image showcase with material zoom, wood finish toggles, and customized interior inquiry forms.",
    result: "Accelerated direct customer inquiries and boosted showroom footfall by 38%.",
    gradient: "from-[#C28E5C]/25 via-[#FF5A00]/15 to-[#38B6FF]/15",
    mockupType: "browser"
  },
  {
    id: "the-crispy-crepes",
    name: "The Crispy Crepes",
    client: "Aether Architecture & Spatial Studio",
    category: "Landing pages",
    tagline: "Bold Flavours, Unforgettable Bites \u2014 Serving street-style favourites packed with spice, freshness, and local character.",
    description: "A punchy, vibrant street food brand website with interactive crepe customization, lively animated visuals, and rapid takeout ordering.",
    deliverables: ["Street Food Brand Identity", "Interactive Menu Page", "Delivery Integration", "Mobile First UX"],
    metrics: [
      { label: "Online Takeout Orders", value: "+84%" },
      { label: "Menu Click-Through", value: "62%" },
      { label: "Mobile Bounce Rate", value: "14%" }
    ],
    accentColor: "#FF5A00",
    liveUrl: "https://cyan-badger-371878.hostingersite.com/",
    imageUrl: "https://res.cloudinary.com/npvenpir/image/upload/v1791694939/be3700f8-8d73-4fba-8afe-86440fb0a5f2.jpg",
    tags: ["Street Eats", "Authentic Flavours", "Branding", "Fast Food"],
    challenge: "Fast-casual eateries need energetic, scroll-stopping digital branding that makes customers hungry immediately and gets them ordering in 2 clicks.",
    solution: "Crafted an energetic brutalist aesthetic with bold typography, high-contrast food photos, and instant ordering CTAs.",
    result: "Drove an 84% surge in weekend takeout orders and viral social check-ins.",
    gradient: "from-[#FF5A00]/25 via-[#FFC72C]/20 to-[#FF5DA2]/15",
    mockupType: "browser"
  },
  {
    id: "viet-duc-dental",
    name: "VIET DUC DENTAL CLINIC",
    client: "Pulse MedTech Labs",
    category: "Web apps",
    tagline: "Confident Smiles Start Here \u2014 Gentle dental care and modern treatments for healthier, brighter smiles.",
    description: "A patient-friendly dental clinic website equipped with 1-click appointment booking, treatment cost calculators, and verified doctor credentials.",
    deliverables: ["Clinic Patient Portal", "Instant Slot Booking", "Doctor Profiles & Credentials", "Treatment Guide"],
    metrics: [
      { label: "Monthly Bookings", value: "380+" },
      { label: "New Patient Intake", value: "+45%" },
      { label: "Satisfaction Score", value: "4.9/5" }
    ],
    accentColor: "#27E3A4",
    liveUrl: "https://orange-seahorse-549893.hostingersite.com/",
    imageUrl: "https://res.cloudinary.com/npvenpir/image/upload/v1791698205/4eb03f45-2370-4413-808a-e6203aac77af.jpg",
    tags: ["Gentle Dentistry", "Oral Health", "Appointment Booking", "Healthcare"],
    challenge: "Dental anxiety and complicated booking procedures frequently deter patients from scheduling necessary treatments.",
    solution: "Designed a calm, reassuring interface with clear treatment overviews, transparent fee expectations, and seamless mobile appointment scheduling.",
    result: "Grew new patient registrations by 45% while decreasing no-show rates by 30% through automated reminders.",
    gradient: "from-[#27E3A4]/25 via-[#38B6FF]/20 to-[#6B4DFF]/15",
    mockupType: "dashboard"
  },
  {
    id: "rm-trendy",
    name: "R&M Trendy",
    client: "Hyperion Supply Chain Solutions",
    category: "E-commerce",
    tagline: "Wear Your Story, Own Your Style \u2014 Discover timeless fashion and everyday essentials that express your individuality.",
    description: "A trend-driven fashion e-commerce experience showcasing seasonal apparel drops, size recommendation widgets, and lightning-fast UPI checkout.",
    deliverables: ["Fashion Storefront", "Lookbook & Drop Showcase", "Quick Buy Drawer", "Order Status Tracking"],
    metrics: [
      { label: "Cart Conversion", value: "5.2%" },
      { label: "Return Rate Reduction", value: "-22%" },
      { label: "Page Speed", value: "0.4s" }
    ],
    accentColor: "#FF5DA2",
    liveUrl: "https://beige-leopard-349803.hostingersite.com/",
    imageUrl: "https://res.cloudinary.com/npvenpir/image/upload/v1791698081/70287d98-7141-4fee-8e5b-fdd1077b7842.jpg",
    tags: ["Signature Style", "Everyday Wear", "Fashion E-Commerce", "Apparel"],
    challenge: "Fast-fashion e-commerce requires instant visual impact, frictionless lookbook browsing, and zero checkout lag during viral collection drops.",
    solution: "Engineered a high-velocity fashion storefront with sticky quick-add cart drawers and instant mobile payment flows.",
    result: "Boosted conversion rates by 5.2% and saw record drop sell-outs within minutes.",
    gradient: "from-[#FF5DA2]/25 via-[#FF5A00]/20 to-[#6B4DFF]/15",
    mockupType: "browser"
  },
  {
    id: "career-growth-tribe-official",
    name: "Career Growth Tribe",
    client: "Career Growth Tribe (Rajan Kumar Prasad)",
    category: "Web apps",
    tagline: "Find Your Direction, Shape Your Future \u2014 Discover your strengths, build career confidence, and move toward meaningful opportunities.",
    description: "A comprehensive career mentorship community and talent accelerator platform featuring cohort management, live workshop schedules, and member resources.",
    deliverables: ["Member Learning Hub", "Cohort Enrolment Flow", "Automated Mentorship Matching", "Event Broadcasts"],
    metrics: [
      { label: "Active Members", value: "25,000+" },
      { label: "Placement Rate", value: "92%" },
      { label: "Member Retention", value: "86%" }
    ],
    accentColor: "#FF5A00",
    liveUrl: "https://careergrowthtribe.com/",
    imageUrl: "https://res.cloudinary.com/npvenpir/image/upload/v1791635852/809287233_4603164849930983_6284418656154300578_n.webp",
    tags: ["Professional Development", "Career Clarity", "Community Platform", "Next.js"],
    challenge: "Scaling a nationwide career mentorship organization needed a dedicated platform to handle thousands of concurrent learners without server slowdowns.",
    solution: "Built an automated community and enrollment portal with instant WhatsApp integration and dynamic learning track schedules.",
    result: "Scaled community membership past 25,000 active professionals across India.",
    gradient: "from-[#FF5A00]/25 via-[#38B6FF]/20 to-[#27E3A4]/15",
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

// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc
} from "firebase/firestore";

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "igneous-mapper-82w8r",
  appId: "1:154886958426:web:7c614c996af29ddc559763",
  apiKey: "AIzaSyB9EKHdTS86tBGgADdJBtzeI7i3akulKcc",
  authDomain: "igneous-mapper-82w8r.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-cretifymoderndig-4b587d05-7573-4265-be33-4ae5927a17a7",
  storageBucket: "igneous-mapper-82w8r.firebasestorage.app",
  messagingSenderId: "154886958426",
  measurementId: "",
  oAuthClientId: "154886958426-ma1lj478bpkodpvsgtplh3mq918i14ui.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

// src/lib/firebase.ts
var app = getApps().length > 0 ? getApp() : initializeApp(firebase_applet_config_default);
var db = firebase_applet_config_default.firestoreDatabaseId ? getFirestore(app, firebase_applet_config_default.firestoreDatabaseId) : getFirestore(app);
var PROJECTS_COLLECTION = "projects";
var REVIEWS_COLLECTION = "reviews";
var INQUIRIES_COLLECTION = "inquiries";
var SYSTEM_COLLECTION = "system";
async function getProjectsFromFirestore() {
  const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
  const list = [];
  querySnapshot.forEach((docSnap) => {
    list.push(docSnap.data());
  });
  return list;
}
async function saveProjectToFirestore(project) {
  const docRef = doc(db, PROJECTS_COLLECTION, project.id);
  await setDoc(docRef, project, { merge: true });
}
async function deleteProjectFromFirestore(id) {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await deleteDoc(docRef);
}
async function getReviewsFromFirestore() {
  const querySnapshot = await getDocs(collection(db, REVIEWS_COLLECTION));
  const list = [];
  querySnapshot.forEach((docSnap) => {
    list.push(docSnap.data());
  });
  return list;
}
async function saveReviewToFirestore(review) {
  const docRef = doc(db, REVIEWS_COLLECTION, review.id);
  await setDoc(docRef, review, { merge: true });
}
async function deleteReviewFromFirestore(id) {
  const docRef = doc(db, REVIEWS_COLLECTION, id);
  await deleteDoc(docRef);
}
async function getInquiriesFromFirestore() {
  const querySnapshot = await getDocs(collection(db, INQUIRIES_COLLECTION));
  const list = [];
  querySnapshot.forEach((docSnap) => {
    list.push(docSnap.data());
  });
  return list;
}
async function saveInquiryToFirestore(inquiry) {
  const docRef = doc(db, INQUIRIES_COLLECTION, inquiry.id);
  await setDoc(docRef, inquiry, { merge: true });
}
async function deleteInquiryFromFirestore(id) {
  const docRef = doc(db, INQUIRIES_COLLECTION, id);
  await deleteDoc(docRef);
}
async function seedInitialFirestoreData(seedProjects, seedReviews) {
  try {
    const seedMarkerRef = doc(db, SYSTEM_COLLECTION, "seed_status");
    const markerSnap = await getDoc(seedMarkerRef);
    if (markerSnap.exists() && markerSnap.data()?.seeded === true) {
      return;
    }
    for (const proj of seedProjects) {
      await saveProjectToFirestore(proj);
    }
    for (const rev of seedReviews) {
      await saveReviewToFirestore(rev);
    }
    await setDoc(seedMarkerRef, {
      seeded: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    console.log("Successfully seeded initial data to Cloud Firestore");
  } catch (err) {
    console.error("Firestore seeding warning:", err);
  }
}

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app2 = express();
var PORT = process.env.PORT || 3e3;
var JWT_SECRET = process.env.JWT_SECRET || "cretify_secret_key_4508_secure_salt_77";
var DATA_DIR = path.resolve(__dirname, "data");
var STORE_PATH = path.resolve(DATA_DIR, "store.json");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
var SEED_PROJECTS = PROJECTS.map((p) => ({
  ...p,
  imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
}));
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
async function syncWithFirestore() {
  try {
    await seedInitialFirestoreData(SEED_PROJECTS, store.reviews || TESTIMONIALS);
    const cloudProjects = await getProjectsFromFirestore();
    const cloudReviews = await getReviewsFromFirestore();
    const cloudInquiries = await getInquiriesFromFirestore();
    if (cloudProjects.length > 0) {
      store.projects = cloudProjects;
    }
    store.reviews = cloudReviews;
    store.inquiries = cloudInquiries;
    saveStore(store);
    console.log(`[Firestore] Synced successfully: ${cloudProjects.length} projects, ${cloudReviews.length} reviews, ${cloudInquiries.length} inquiries`);
  } catch (err) {
    console.warn("[Firestore] Sync warning (using local fallback cache):", err);
  }
}
syncWithFirestore();
app2.use(express.json());
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
var ALLOWED_ADMIN_USERNAMES = [
  "cretifyservices4508",
  "cretifyservices@gmail.com",
  "cretify",
  "cretifyservices"
];
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: missing or invalid authorization header" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const username = (decoded.username || "").trim().toLowerCase();
    if (ALLOWED_ADMIN_USERNAMES.includes(username)) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden: invalid credentials" });
    }
  } catch {
    res.status(401).json({ error: "Unauthorized: token expired or invalid" });
  }
}
app2.post("/api/auth/login", rateLimitLogin, (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const cleanUser = (username || "").trim().toLowerCase();
  const cleanPass = (password || "").trim();
  const isUsernameValid = ALLOWED_ADMIN_USERNAMES.includes(cleanUser);
  const isPasswordValid = cleanPass === "cretify@1234";
  if (isUsernameValid && isPasswordValid) {
    loginAttempts.delete(ip);
    const token = jwt.sign({ username: cleanUser, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, username: cleanUser });
  }
  const record = loginAttempts.get(ip);
  if (record) {
    record.count += 1;
  }
  return res.status(401).json({ error: "Invalid username or password" });
});
app2.get("/api/auth/verify", requireAdmin, (req, res) => {
  res.json({ valid: true, username: req.user?.username || "admin" });
});
app2.get("/api/projects", async (_req, res) => {
  try {
    const cloudProjects = await getProjectsFromFirestore();
    if (cloudProjects.length > 0) {
      store.projects = cloudProjects;
      saveStore(store);
    }
  } catch {
  }
  res.json(store.projects);
});
app2.post("/api/projects", requireAdmin, async (req, res) => {
  const newProject = {
    ...req.body,
    id: req.body.id || `proj-${Date.now()}`
  };
  try {
    await saveProjectToFirestore(newProject);
  } catch (err) {
    console.warn("Failed to save project to Firestore:", err);
  }
  store.projects.unshift(newProject);
  saveStore(store);
  res.status(201).json(newProject);
});
app2.put("/api/projects/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const index = store.projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }
  const updated = { ...store.projects[index], ...req.body, id };
  try {
    await saveProjectToFirestore(updated);
  } catch (err) {
    console.warn("Failed to update project in Firestore:", err);
  }
  store.projects[index] = updated;
  saveStore(store);
  res.json(store.projects[index]);
});
app2.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteProjectFromFirestore(id);
  } catch (err) {
    console.warn("Failed to delete project from Firestore:", err);
  }
  store.projects = store.projects.filter((p) => p.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});
app2.post("/api/projects/import", requireAdmin, async (req, res) => {
  try {
    const { projects: importedProjects, mode } = req.body;
    if (!Array.isArray(importedProjects)) {
      return res.status(400).json({ error: "Expected an array of projects in { projects: [...] }" });
    }
    const validated = importedProjects.map((p, idx) => ({
      id: p.id || `proj-${Date.now()}-${idx}`,
      name: p.name || "Untitled Project",
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
      metrics: p.metrics || "",
      challenge: p.challenge || "",
      solution: p.solution || "",
      result: p.result || "",
      mockupType: p.mockupType || "dashboard"
    }));
    if (mode === "replace") {
      for (const p of store.projects) {
        try {
          await deleteProjectFromFirestore(p.id);
        } catch {
        }
      }
      for (const p of validated) {
        try {
          await saveProjectToFirestore(p);
        } catch {
        }
      }
      store.projects = validated;
    } else {
      const existingMap = new Map(store.projects.map((p) => [p.id, p]));
      for (const p of validated) {
        existingMap.set(p.id, p);
        try {
          await saveProjectToFirestore(p);
        } catch {
        }
      }
      store.projects = Array.from(existingMap.values());
    }
    saveStore(store);
    res.json({ success: true, count: store.projects.length, projects: store.projects });
  } catch (err) {
    res.status(500).json({ error: err.message || "Import failed" });
  }
});
app2.get("/api/reviews", async (_req, res) => {
  try {
    const cloudReviews = await getReviewsFromFirestore();
    store.reviews = cloudReviews;
    saveStore(store);
  } catch {
  }
  res.json(store.reviews);
});
app2.post("/api/reviews", requireAdmin, async (req, res) => {
  const newReview = {
    ...req.body,
    id: req.body.id || `review-${Date.now()}`
  };
  try {
    await saveReviewToFirestore(newReview);
  } catch (err) {
    console.warn("Failed to save review to Firestore:", err);
  }
  store.reviews.unshift(newReview);
  saveStore(store);
  res.status(201).json(newReview);
});
app2.delete("/api/reviews/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteReviewFromFirestore(id);
  } catch (err) {
    console.warn("Failed to delete review from Firestore:", err);
  }
  store.reviews = store.reviews.filter((r) => r.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});
app2.post("/api/inquiries", async (req, res) => {
  const inquiry = {
    id: `inq-${Date.now()}`,
    ...req.body,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  try {
    await saveInquiryToFirestore(inquiry);
  } catch (err) {
    console.warn("Failed to save inquiry to Firestore:", err);
  }
  store.inquiries.unshift(inquiry);
  saveStore(store);
  res.status(201).json({ success: true, inquiry });
});
app2.get("/api/inquiries", requireAdmin, async (_req, res) => {
  try {
    const cloudInquiries = await getInquiriesFromFirestore();
    store.inquiries = cloudInquiries;
    saveStore(store);
  } catch {
  }
  res.json(store.inquiries);
});
app2.delete("/api/inquiries/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteInquiryFromFirestore(id);
  } catch (err) {
    console.warn("Failed to delete inquiry from Firestore:", err);
  }
  store.inquiries = store.inquiries.filter((inq) => inq.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});
async function setupFrontend() {
  if (process.env.NODE_ENV === "production" || fs.existsSync(path.resolve(__dirname, "dist/index.html"))) {
    const distPath = path.resolve(__dirname, "dist");
    app2.use(express.static(distPath));
    app2.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app2.use(vite.middlewares);
  }
  app2.listen(PORT, () => {
    console.log(`Cretify Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}
setupFrontend().catch((err) => {
  console.error("Failed to start server:", err);
});
