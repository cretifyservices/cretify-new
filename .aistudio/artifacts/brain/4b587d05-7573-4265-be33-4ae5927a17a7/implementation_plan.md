# Implementation Plan: Cloud Database Persistence with Firebase Firestore

Resolve data loss during GitHub pushes and redeployments by migrating from a git-tracked local JSON file to a cloud persistent **Firebase Firestore** database. All admin updates, additions, and deletions (works, reviews, inquiries) will live permanently in the cloud and never be overwritten by git commits, branch checkouts, or server rebuilds.

## User Review Required

> [!IMPORTANT]
> **Cloud Database Provisioning**:
> In accordance with your choice, we will provision Firebase Firestore. Once you approve this plan, the Firebase setup UI will be prompted for one-click authorization.
> - **Initial Data Migration**: All 8 migrated live projects from `cretify.in/work` and your current reviews will be seeded into Firestore on initial setup.
> - **Permanent Persistence**: Any subsequent additions, updates, or deletions made in the Admin Portal will write directly to Firestore in the cloud. Pushing code updates to GitHub or redeploying will **never** reset or recover deleted fake reviews.

---

## Architecture & Data Flow

```
[Admin Portal / UI] 
       │
       ▼
[Express Server API / Firestore SDK]
       │
       ├──► Read & Write directly to Cloud Firestore Collections:
       │      • /projects (all case studies & client works)
       │      • /reviews (client reviews & testimonials)
       │      • /inquiries (lead contact submissions)
       │
       └──► Local fallback cache (prevents downtime if offline)
```

1. **Collections Schema**:
   - `projects`: Document ID matches project ID (e.g. `shrungar-ornament`, `alfa-bakery`), contains full project details, tags, live URLs, deliverables.
   - `reviews`: Document ID matches review ID (e.g. `dm-1`), contains client name, role, company, message, rating, avatar color.
   - `inquiries`: Document ID auto-generated timestamped ID, contains contact leads and messages.

2. **Server API Update**:
   - `/api/projects` (GET, POST, PUT, DELETE): reads from and writes to Firestore.
   - `/api/reviews` (GET, POST, PUT, DELETE): reads from and writes to Firestore.
   - `/api/inquiries` (GET, POST, DELETE): reads from and writes to Firestore.

3. **Client-side Resiliency**:
   - `TestimonialsSection.tsx`: ensure that when `/api/reviews` returns an empty array (if all reviews are deleted), it clears state instead of keeping dummy fallback reviews.

---

## Proposed Changes

### 1. Database Provisioning & Firebase SDK
- Provision Firestore using the `firebase_setup` UI.
- Create `firebase-blueprint.json` and `firestore.rules` securing collections (public read for projects and reviews; admin write; public create for contact inquiries).
- Configure Firebase SDK on the server with environment configuration.

### 2. Initial Cloud Seeding (One-Time)
- Implement auto-migration script that transfers current authentic works (`src/data/projects.ts`) and current reviews into Firestore on initial launch if collections are empty.
- Ensure that once seeded, Firestore is the sole authority—git commits to source files will no longer reset live data.

### 3. Server Endpoints Refactoring (`server.ts`)
- Refactor Express routes (`/api/projects`, `/api/reviews`, `/api/inquiries`) to interface directly with Firestore.
- Keep in-memory/file fallback for offline/development resilience.

### 4. Frontend Fallback Hardening (`TestimonialsSection.tsx` & `WorkPage.tsx`)
- Update `TestimonialsSection.tsx` so that empty review lists (`[]`) returned from the database correctly render empty or an inviting "Submit a review" card rather than falling back to fake dummy testimonials.

---

## Verification Plan

### Automated & Build Checks
- Run `compile_applet` and `lint_applet` to ensure TypeScript compilation without errors.
- Run `npm run build` to confirm production client and server bundles build cleanly.

### Manual Verification Flows
1. **Admin Portal Review Deletion & Creation**:
   - Open `/admin` and log in.
   - Delete a review or update review text.
   - Confirm changes reflect immediately on `/` and `/api/reviews`.
2. **Persistence Test**:
   - Restart the server process (`restart_dev_server`).
   - Query `/api/reviews` and confirm the deleted reviews **do not** return.
3. **Project Management Test**:
   - Confirm all 8 migrated works appear and edit successfully in `/admin`.
