# CRETIFY — Independent Digital Agency

> **An independent digital agency crafting modern web applications, digital presence, and automated systems for companies reaching further than before.**

- **Website:** [cretify.in](https://cretify.in)
- **Email:** services@cretify.in
- **Direct WhatsApp / Call:** +91 70618 99513 / +91 74850 94642
- **Admin Portal:** `/admin` (Username: `cretifyservices4508`, Password: `Cretify@4508`)

---

## ⚡ Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion (`motion/react`)
- **3D Procedural Visuals:** Three.js, `@react-three/fiber`, `@react-three/drei` (No external .gltf files required)
- **Physics Toy:** Matter.js interactive letter playground (desktop)
- **Sound System:** Web Audio API synthesizer (no external audio assets required)
- **Lead Capture:** Formspree direct integration (`https://formspree.io/f/xkjworpg`) + SQLite/JSON server backup
- **Backend:** Express Full-Stack server (`server.ts` compiled to `server.js` with SPA fallback)

---

## 🚀 How to Connect with Hostinger Web App via GitHub

### Option A: Hostinger Node.js Web App (Recommended — Direct Deploy)
1. **Push this repo to GitHub:**
   ```bash
   git add .
   git commit -m "feat: complete cretify agency website and production build"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. **In your Hostinger Control Panel (hPanel):**
   - Navigate to **Websites** > **Node.js** (or **Web Apps** > **Create Node.js application**).
   - Choose **Install via Git** / **Connect GitHub repository**.
   - Select your repository and branch: `main`.
3. **Configure Node.js Settings:**
   - **Node.js version:** `20.x` or `22.x`
   - **Application Root:** `/` (or leave as root directory)
   - **Application Startup File:** `server.js`
   - **Build Command:** *(leave empty, or `npm run build` — `dist/` and `server.js` are already pre-built!)*
   - **Run Command:** `npm start` *(or `node server.js`)*
   - **Environment Variables:**
     - `NODE_ENV` = `production`
     - `JWT_SECRET` = `cretify_secret_key_4508_secure_salt_77`
4. Click **Deploy / Start**.
   Because `dist/` and `server.js` are pre-compiled and `.npmrc` prevents peer dependency errors, Hostinger will install cleanly without npm failures and start instantly on your domain!

---

### Option B: Hostinger Shared / Cloud Hosting (Static + .htaccess)
If you are deploying to standard Hostinger Web Hosting (`public_html`):
1. Run `npm run build` locally or set up GitHub Actions.
2. Upload the contents of the `dist/` directory into your Hostinger `public_html/`.
3. The included `public/.htaccess` file is automatically placed inside `dist/.htaccess`. It ensures that refreshing any SPA page (`/work`, `/services`, `/about`, `/contact`, `/admin`) works without 404 errors:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
4. All inquiries from the 4-step modal submit directly to **Formspree** (`https://formspree.io/f/xkjworpg`), so your leads will land in your email inbox immediately!

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm start
```

---

## 🔒 Admin Portal Credentials

- **URL:** `/admin`
- **Username:** `cretifyservices4508`
- **Password:** `Cretify@4508`

From the admin dashboard, you can:
- Add, edit, or delete portfolio projects and update their live links or desktop screenshots
- Add, edit, or remove client testimonials & ratings
- View and manage incoming client project briefs
