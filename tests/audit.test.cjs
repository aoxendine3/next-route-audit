const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

describe('Next.js Route Audit Verification', () => {
    const testDir = path.join(__dirname, 'test-project');
    const binPath = path.resolve(__dirname, '../bin.cjs');

    beforeEach(() => {
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
        fs.mkdirSync(testDir, { recursive: true });
    });

    after(() => {
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
    });

    it('should detect missing routes', () => {
        fs.mkdirSync(path.join(testDir, 'app/dashboard'), { recursive: true });
        fs.mkdirSync(path.join(testDir, 'app/settings'), { recursive: true });
        fs.writeFileSync(path.join(testDir, 'app/page.tsx'), '');
        fs.writeFileSync(path.join(testDir, 'app/dashboard/page.tsx'), '');
        fs.writeFileSync(path.join(testDir, 'app/settings/page.tsx'), '');

        fs.mkdirSync(path.join(testDir, '.next/server/app'), { recursive: true });
        fs.writeFileSync(path.join(testDir, '.next/server/app/page.html'), '');
        fs.writeFileSync(path.join(testDir, '.next/server/app/dashboard.html'), '');

        try {
            execSync(`node ${binPath} ${testDir}`, { stdio: 'pipe' });
            throw new Error('Should have failed');
        } catch (e) {
            const cleanError = e.stdout.toString().replace(/\u001b\[[0-9;]*m/g, '');
            expect(cleanError).to.contain('[MISSING] /settings');
        }
    });

    it('should normalize route groups', () => {
        fs.mkdirSync(path.join(testDir, 'app/(auth)/login'), { recursive: true });
        fs.writeFileSync(path.join(testDir, 'app/(auth)/login/page.tsx'), '');

        fs.mkdirSync(path.join(testDir, '.next/server/app'), { recursive: true });
        fs.writeFileSync(path.join(testDir, '.next/server/app/login.html'), '');

        const output = execSync(`node ${binPath} ${testDir}`, { stdio: 'pipe' });
        const cleanOutput = output.toString().replace(/\u001b\[[0-9;]*m/g, '');
        expect(cleanOutput).to.contain('Audit successful');
    });

    it('should support dynamic routes', () => {
        fs.mkdirSync(path.join(testDir, 'app/blog/[slug]'), { recursive: true });
        fs.writeFileSync(path.join(testDir, 'app/blog/[slug]/page.tsx'), '');

        fs.mkdirSync(path.join(testDir, '.next/server/app/blog'), { recursive: true });
        fs.writeFileSync(path.join(testDir, '.next/server/app/blog/[slug].html'), '');

        const output = execSync(`node ${binPath} ${testDir}`, { stdio: 'pipe' });
        const cleanOutput = output.toString().replace(/\u001b\[[0-9;]*m/g, '');
        expect(cleanOutput).to.contain('Audit successful');
    });
});
