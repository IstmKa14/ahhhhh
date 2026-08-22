# Canvasly — Error Memory & Bug Log

This document tracks system architecture bugs, root causes, and verified fix patterns.

---

## Bug History

### 1. Duplicate JSX in `/design-system` page
- **Symptom**: Parse error line 240 in `/design-system` route.
- **Root Cause**: Duplicate JSX left after inline replacement edit.
- **Fix**: Purged duplicated JSX structure.

### 2. Next.js 16 `middleware.ts` deprecation warning
- **Symptom**: Warning when booting dev server regarding `middleware.ts`.
- **Root Cause**: Next.js 16 standard uses `proxy.ts`.
- **Fix**: Migrated auth middleware logic to `proxy.ts`.

### 3. Missing `dequal` dependency
- **Symptom**: `@clerk/shared` dependency resolution error.
- **Root Cause**: Missing `dequal` dependency required by `@clerk/shared`.
- **Fix**: Installed `dequal`.

### 4. Deprecated `afterSignOutUrl` prop in `<UserButton />`
- **Symptom**: Clerk warning regarding deprecated `afterSignOutUrl`.
- **Root Cause**: Clerk v7+ deprecates `afterSignOutUrl` in favor of environment variable configurations.
- **Fix**: Removed prop and set `NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL`.

### 5. Next.js Server Action Host Mismatch on GitHub Codespaces
- **Symptom**: `Invalid Server Actions request. x-forwarded-host header with value ...app.github.dev does not match origin header with value localhost:3000...`
- **Root Cause**: Next.js CSRF protection for Server Actions validates `Origin` against `Host`/`X-Forwarded-Host`. In cloud proxy environments like GitHub Codespaces, forwarded headers don't match origin headers.
- **Fix**: Configured `experimental.serverActions.allowedOrigins` in `next.config.ts` to allow `*.app.github.dev` and `localhost:3000`.
