#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectRoot = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const appDir = fs.existsSync(path.join(projectRoot, 'src/app')) 
    ? path.join(projectRoot, 'src/app') 
    : path.join(projectRoot, 'app');
const buildDir = path.join(projectRoot, '.next/server/app');

if (!fs.existsSync(appDir)) {
    console.error('❌ Error: Could not find "app" or "src/app" directory.');
    process.exit(1);
}

if (!fs.existsSync(buildDir)) {
    console.error('❌ Error: Could not find ".next/server/app". Run "next build" first.');
    process.exit(1);
}

function getRoutes(dir, base = '', routes = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getRoutes(fullPath, path.join(base, file), routes);
        } else if (file.startsWith('page.')) {
            routes.push(base === '' ? '/' : `/${base.replace(/\\/g, '/')}`);
        }
    }
    return routes;
}

const sourceRoutes = getRoutes(appDir);
const missingRoutes = [];

sourceRoutes.forEach(route => {
    // Next.js build output uses .html or .meta for routes
    const buildPath = route === '/' 
        ? path.join(buildDir, 'page.html') 
        : path.join(buildDir, `${route}.html`);
    
    // Check for both .html (static) and .js/.meta (dynamic/compiled)
    if (!fs.existsSync(buildPath) && !fs.existsSync(buildPath.replace('.html', '.js'))) {
        missingRoutes.push(route);
    }
});

console.log('\n--- Next.js Route Audit ---');
if (missingRoutes.length === 0) {
    console.log('✅ All source routes found in build output.');
} else {
    console.log(`❌ Found ${missingRoutes.length} missing routes:`);
    missingRoutes.forEach(r => console.log(`[MISSING] ${r}`));
    process.exit(1);
}
