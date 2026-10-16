import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { PROJECTS as DEFAULT_PROJECTS } from './src/data/projects';
import { TESTIMONIALS as DEFAULT_TESTIMONIALS } from './src/data/testimonials';
import {
  getProjectsFromFirestore,
  saveProjectToFirestore,
  deleteProjectFromFirestore,
  getReviewsFromFirestore,
  saveReviewToFirestore,
  deleteReviewFromFirestore,
  getInquiriesFromFirestore,
  saveInquiryToFirestore,
  deleteInquiryFromFirestore,
  seedInitialFirestoreData,
  FirestoreProject,
  FirestoreReview,
  FirestoreInquiry
} from './src/lib/firebase';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'cretify_secret_key_4508_secure_salt_77';

// Local storage fallback cache setup
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.resolve(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface StoreData {
  projects: any[];
  reviews: any[];
  inquiries: any[];
}

// Initial seed data using project's actual images
const SEED_PROJECTS: FirestoreProject[] = DEFAULT_PROJECTS.map((p) => ({
  ...p,
  imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
}));

function loadStore(): StoreData {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        projects: parsed.projects || SEED_PROJECTS,
        reviews: parsed.reviews || DEFAULT_TESTIMONIALS,
        inquiries: parsed.inquiries || []
      };
    }
  } catch (err) {
    console.error('Error reading store.json, using defaults:', err);
  }

  const initial: StoreData = {
    projects: SEED_PROJECTS,
    reviews: DEFAULT_TESTIMONIALS,
    inquiries: []
  };
  saveStore(initial);
  return initial;
}

function saveStore(data: StoreData) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store.json:', err);
  }
}

let store = loadStore();

// Synchronize with Cloud Firestore
async function syncWithFirestore() {
  try {
    // Seed initial data once into Firestore if not already seeded
    await seedInitialFirestoreData(SEED_PROJECTS, store.reviews || DEFAULT_TESTIMONIALS);

    // Read live data directly from Cloud Firestore
    const cloudProjects = await getProjectsFromFirestore();
    const cloudReviews = await getReviewsFromFirestore();
    const cloudInquiries = await getInquiriesFromFirestore();

    if (cloudProjects.length > 0) {
      store.projects = cloudProjects;
    }
    // Always trust cloud reviews: if admin deleted reviews, cloudReviews will be empty or filtered
    store.reviews = cloudReviews;
    store.inquiries = cloudInquiries;
    saveStore(store);
    console.log(`[Firestore] Synced successfully: ${cloudProjects.length} projects, ${cloudReviews.length} reviews, ${cloudInquiries.length} inquiries`);
  } catch (err) {
    console.warn('[Firestore] Sync warning (using local fallback cache):', err);
  }
}

// Execute initial sync
syncWithFirestore();

app.use(express.json());

// In-memory rate limiting for brute-force protection
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function rateLimitLogin(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record && record.resetTime > now) {
    if (record.count >= 5) {
      return res.status(429).json({ error: 'Too many login attempts. Please try again in 15 minutes.' });
    }
  } else {
    loginAttempts.set(ip, { count: 0, resetTime: now + 15 * 60 * 1000 });
  }
  next();
}

const ALLOWED_ADMIN_USERNAMES = [
  'cretifyservices4508',
  'cretifyservices@gmail.com',
  'cretify',
  'cretifyservices'
];

// Auth middleware for protected admin routes
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    const username = (decoded.username || '').trim().toLowerCase();
    if (ALLOWED_ADMIN_USERNAMES.includes(username)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden: invalid credentials' });
    }
  } catch {
    res.status(401).json({ error: 'Unauthorized: token expired or invalid' });
  }
}

// ----------------- AUTH ENDPOINTS -----------------
app.post('/api/auth/login', rateLimitLogin, (req: Request, res: Response) => {
  const { username, password } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  // Allow both cretifyservices4508 and cretifyservices@gmail.com
  const isUsernameValid = ALLOWED_ADMIN_USERNAMES.includes(cleanUser);
  const isPasswordValid = cleanPass === 'cretify@1234';

  if (isUsernameValid && isPasswordValid) {
    loginAttempts.delete(ip);
    const token = jwt.sign({ username: cleanUser, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, username: cleanUser });
  }

  const record = loginAttempts.get(ip);
  if (record) {
    record.count += 1;
  }
  return res.status(401).json({ error: 'Invalid username or password' });
});

// Verify token
app.get('/api/auth/verify', requireAdmin, (req: Request, res: Response) => {
  res.json({ valid: true, username: (req as any).user?.username || 'admin' });
});

// ----------------- PROJECTS ENDPOINTS -----------------
// GET all projects (public)
app.get('/api/projects', async (_req: Request, res: Response) => {
  try {
    const cloudProjects = await getProjectsFromFirestore();
    if (cloudProjects.length > 0) {
      store.projects = cloudProjects;
      saveStore(store);
    }
  } catch {}
  res.json(store.projects);
});

// CREATE a project (admin)
app.post('/api/projects', requireAdmin, async (req: Request, res: Response) => {
  const newProject = {
    ...req.body,
    id: req.body.id || `proj-${Date.now()}`
  };
  try {
    await saveProjectToFirestore(newProject);
  } catch (err) {
    console.warn('Failed to save project to Firestore:', err);
  }
  store.projects.unshift(newProject);
  saveStore(store);
  res.status(201).json(newProject);
});

// UPDATE a project (admin)
app.put('/api/projects/:id', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const index = store.projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  const updated = { ...store.projects[index], ...req.body, id };
  try {
    await saveProjectToFirestore(updated);
  } catch (err) {
    console.warn('Failed to update project in Firestore:', err);
  }
  store.projects[index] = updated;
  saveStore(store);
  res.json(store.projects[index]);
});

// DELETE a project (admin)
app.delete('/api/projects/:id', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteProjectFromFirestore(id);
  } catch (err) {
    console.warn('Failed to delete project from Firestore:', err);
  }
  store.projects = store.projects.filter((p) => p.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});

// IMPORT projects in bulk from JSON (admin)
app.post('/api/projects/import', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { projects: importedProjects, mode } = req.body;
    if (!Array.isArray(importedProjects)) {
      return res.status(400).json({ error: 'Expected an array of projects in { projects: [...] }' });
    }

    // Ensure all items have valid IDs and defaults
    const validated = importedProjects.map((p: any, idx: number) => ({
      id: p.id || `proj-${Date.now()}-${idx}`,
      name: p.name || 'Untitled Project',
      client: p.client || 'Client',
      category: p.category || 'Web development',
      tagline: p.tagline || '',
      description: p.description || '',
      imageUrl: p.imageUrl || '',
      liveUrl: p.liveUrl || 'https://',
      accentColor: p.accentColor || '#FF5A00',
      gradient: p.gradient || 'from-[#FF5A00]/25 to-[#6B4DFF]/20',
      tags: Array.isArray(p.tags) ? p.tags : ['Digital Experience'],
      deliverables: Array.isArray(p.deliverables) ? p.deliverables : ['Full-Stack Engineering'],
      metrics: p.metrics || '',
      challenge: p.challenge || '',
      solution: p.solution || '',
      result: p.result || '',
      mockupType: p.mockupType || 'dashboard'
    }));

    if (mode === 'replace') {
      for (const p of store.projects) {
        try { await deleteProjectFromFirestore(p.id); } catch {}
      }
      for (const p of validated) {
        try { await saveProjectToFirestore(p); } catch {}
      }
      store.projects = validated;
    } else {
      const existingMap = new Map(store.projects.map((p) => [p.id, p]));
      for (const p of validated) {
        existingMap.set(p.id, p);
        try { await saveProjectToFirestore(p); } catch {}
      }
      store.projects = Array.from(existingMap.values());
    }

    saveStore(store);
    res.json({ success: true, count: store.projects.length, projects: store.projects });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Import failed' });
  }
});

// ----------------- REVIEWS ENDPOINTS -----------------
// GET all reviews (public)
app.get('/api/reviews', async (_req: Request, res: Response) => {
  try {
    const cloudReviews = await getReviewsFromFirestore();
    store.reviews = cloudReviews;
    saveStore(store);
  } catch {}
  res.json(store.reviews);
});

// CREATE a review (admin)
app.post('/api/reviews', requireAdmin, async (req: Request, res: Response) => {
  const newReview = {
    ...req.body,
    id: req.body.id || `review-${Date.now()}`
  };
  try {
    await saveReviewToFirestore(newReview);
  } catch (err) {
    console.warn('Failed to save review to Firestore:', err);
  }
  store.reviews.unshift(newReview);
  saveStore(store);
  res.status(201).json(newReview);
});

// DELETE a review (admin)
app.delete('/api/reviews/:id', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteReviewFromFirestore(id);
  } catch (err) {
    console.warn('Failed to delete review from Firestore:', err);
  }
  store.reviews = store.reviews.filter((r) => r.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});

// ----------------- INQUIRIES ENDPOINTS -----------------
// CREATE inquiry (public)
app.post('/api/inquiries', async (req: Request, res: Response) => {
  const inquiry = {
    id: `inq-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  try {
    await saveInquiryToFirestore(inquiry);
  } catch (err) {
    console.warn('Failed to save inquiry to Firestore:', err);
  }
  store.inquiries.unshift(inquiry);
  saveStore(store);
  res.status(201).json({ success: true, inquiry });
});

// GET inquiries (admin only)
app.get('/api/inquiries', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const cloudInquiries = await getInquiriesFromFirestore();
    store.inquiries = cloudInquiries;
    saveStore(store);
  } catch {}
  res.json(store.inquiries);
});

// DELETE inquiry (admin only)
app.delete('/api/inquiries/:id', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await deleteInquiryFromFirestore(id);
  } catch (err) {
    console.warn('Failed to delete inquiry from Firestore:', err);
  }
  store.inquiries = store.inquiries.filter((inq) => inq.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});

// Mount Vite or serve static dist
async function setupFrontend() {
  if (process.env.NODE_ENV === 'production' || fs.existsSync(path.resolve(__dirname, 'dist/index.html'))) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Cretify Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

setupFrontend().catch((err) => {
  console.error('Failed to start server:', err);
});
