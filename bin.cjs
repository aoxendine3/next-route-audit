#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// ANSI Colors for Professional CLI Output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m"
};

const projectRoot = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const appDir = [
    path.join(projectRoot, 'src/app'),
    path.join(projectRoot, 'app')
].find(d => fs.existsSync(d) && fs.statSync(d).isDirectory());

const buildDir = path.join(projectRoot, '.next/server/app');

console.log(`\n${colors.bright}${colors.cyan}--- Next.js Route Audit ---${colors.reset}`);
console.log(`${colors.cyan}Project:${colors.reset} ${projectRoot}`);

if (!appDir) {
    console.error(`${colors.red}❌ Error: Could not find "app" or "src/app" directory.${colors.reset}`);
    process.exit(1);
}

if (!fs.existsSync(buildDir)) {
    console.error(`${colors.red}❌ Error: Could not find ".next/server/app". Run "next build" first.${colors.reset}`);
    process.exit(1);
}

function normalizeRoute(routePath) {
    return routePath
        .split(path.sep)
        .filter(part => !part.startsWith('(') || !part.endsWith(')'))
        .join('/');
}

function getSourceRoutes(dir, currentRoute = '', routes = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getSourceRoutes(fullPath, path.join(currentRoute, file), routes);
        } else if (file.match(/^page\.(tsx|jsx|js|ts)$/)) {
            const normalized = normalizeRoute(currentRoute);
            routes.push(normalized === '' ? '/' : `/${normalized}`);
        }
    }
    return routes;
}

const sourceRoutes = getSourceRoutes(appDir);
const missingRoutes = [];

sourceRoutes.forEach(route => {
    const possiblePaths = [
        path.join(buildDir, route === '/' ? 'page.html' : `${route}.html`),
        path.join(buildDir, route, 'page.html'),
        path.join(buildDir, route === '/' ? 'page.js' : `${route}.js`),
        path.join(buildDir, route, 'page.js')
    ];

    const exists = possiblePaths.some(p => fs.existsSync(p));
    if (!exists) {
        missingRoutes.push(route);
    }
});

if (missingRoutes.length === 0) {
    console.log(`${colors.green}✅ Audit successful: All ${sourceRoutes.length} source routes found in build.${colors.reset}\n`);
    process.exit(0);
} else {
    console.log(`${colors.red}❌ Audit failed: ${missingRoutes.length} missing routes detected:${colors.reset}`);
    missingRoutes.forEach(r => console.log(`${colors.yellow}[MISSING]${colors.reset} ${r}`));
    console.log('');
    process.exit(1);
}
