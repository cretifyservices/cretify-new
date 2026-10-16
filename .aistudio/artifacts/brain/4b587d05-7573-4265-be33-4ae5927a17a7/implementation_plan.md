# Implementation Plan: Admin Login Resolution & Multi-Identifier Access

Enable flexible admin login by supporting both `cretifyservices4508` and `cretifyservices@gmail.com`, clear any IP rate-limiting lockout, and ensure input sanitization and token validation accept both identifiers.

## User Review Required

> [!IMPORTANT]
> **Admin Credentials Configuration**:
> - **Accepted Usernames**: Both `cretifyservices4508` and `cretifyservices@gmail.com` (case-insensitive & whitespace trimmed).
> - **Default Password**: `cretify@1234` (if you were using a different password previously, please let us know in feedback or we can accept your preferred password).
> - **Rate Limit Reset**: All temporary IP lockouts will be flushed so you can log in immediately without waiting.

---

## Architecture & Data Flow

```
[Admin Login Form]
       │
       ▼ (Username trimmed & lowercase normalized)
[POST /api/auth/login]
       │
       ├── Check: username in ['cretifyservices4508', 'cretifyservices@gmail.com']
       │   AND password === 'cretify@1234'
       │
       ├── Valid: Issue signed 7-day JWT with { username, role: 'admin' }
       │   Flush login attempt counters
       │
       └── Invalid: Return clear error message with attempt countdown
```

---

## Proposed Changes

### 1. Backend Authentication (`server.ts`)
- Update `/api/auth/login` to validate against an allowed username set:
  - `cretifyservices4508`
  - `cretifyservices@gmail.com`
- Normalize username inputs (`username.trim().toLowerCase()`) to prevent trailing spaces or mobile keyboard autocapitalization from causing authentication failures.
- Update `requireAdmin` middleware to accept tokens issued to either `cretifyservices4508` or `cretifyservices@gmail.com`.
- Reset in-memory rate-limiter map so current IP blocks are cleared immediately.

### 2. Frontend Admin Page (`src/pages/AdminPage.tsx`)
- Ensure username and password input handlers apply `.trim()` when submitting credentials.
- Add an informational badge on the login screen showing accepted formats (`cretifyservices4508` or `cretifyservices@gmail.com`) for clarity.

---

## Verification Plan

### Automated & Build Checks
- Run `compile_applet` and `lint_applet` to confirm zero TypeScript errors.
- Run `npm run build` to update production bundles.

### Manual Verification
1. **API Auth Test**:
   - Test login with `cretifyservices4508` and verify JWT return.
   - Test login with `cretifyservices@gmail.com` and verify JWT return.
   - Test protected endpoint `/api/auth/verify` with returned tokens.
2. **Admin Portal UI**:
   - Access `/admin` in the browser.
   - Log in with `cretifyservices4508` and `cretify@1234`.
   - Log out and log in with `cretifyservices@gmail.com` and `cretify@1234`.
   - Verify full access to works, reviews, and inquiries.
