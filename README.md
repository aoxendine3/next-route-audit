# Next.js Route Audit

[![Audit](https://img.shields.io/badge/Next.js-Route%20Audit-black)](https://github.com/aoxendine3/next-route-audit)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

`next-route-audit` is a high-performance CLI utility that verifies the integrity of your Next.js builds. It compares your source `app` directory against the compiled `.next` artifacts to identify missing routes before they cause 404s in production.

## 🚀 The Problem
Next.js builds can occasionally fail to generate specific routes due to configuration dissonances, dynamic route resolution issues, or environmental constraints. These failures are often invisible until a user hits a 404.

## 🏛 The Solution
This tool provides **Absolute Grounding** for your deployment. It scans your source structure and verifiably checks it against the physical build output.

## 📦 Installation & Usage

Run instantly via `npx`:
```bash
npx next-route-audit
```

Target a specific project path:
```bash
npx next-route-audit ./path/to/my-project
```

*Note: Requires `next build` to have been run successfully.*

## 📋 Concrete Example
**Source Structure:**
`/app/dashboard/page.tsx`
`/app/settings/page.tsx`

**Build Output:**
`.next/server/app/dashboard.html` exists.
`.next/server/app/settings.html` is **missing**.

**Audit Output:**
```text
--- Next.js Route Audit ---
❌ Audit failed: 1 missing routes detected:
[MISSING] /settings
```

## ☙ CI/CD Integration (GitHub Actions)
Add this to your deployment workflow to prevent broken builds from reaching production:

```yaml
- name: Audit Next.js Routes
  run: npx next-route-audit
```

## 🛠 Features
- **Dynamic Route Support**: Handles `[slug]` and `[[...slug]]` segments.
- **Route Group Normalization**: Correctly resolves `(auth)/login` as `/login`.
- **Nested Layout Verification**: Audits complex nested structures.
- **Exit Code Integrity**: Returns `1` on mismatch for automated failure detection.

## 💰 Enterprise Support
For high-scale institutional auditing or custom integration, contact the maintenance team.
