# next-route-audit

### Problem
Next.js builds can sometimes miss routes due to configuration errors or dynamic route resolution issues, leading to unexpected 404s in production even if the files exist in the `app` directory.

### Solution
A minimal CLI tool that scans your `app` directory for source routes and verifies their existence in the `.next/server/app` build output.

### Install & Run
Run directly via npx:
```bash
npx next-route-audit
```

*Note: Requires `next build` to have been run successfully.*

### Example Output
```text
--- Next.js Route Audit ---
❌ Found 1 missing routes:
[MISSING] /settings
```

### Verified Features
- Auto-detects `src/app` or `app` directories.
- Verifies both static (.html) and dynamic (.js/.meta) build outputs.
- Returns exit code 1 on failure for CI/CD integration.
