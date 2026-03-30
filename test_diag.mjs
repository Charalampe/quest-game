import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 960, height: 720 } });

    const logs = [];
    const errors = [];
    page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);

    // Check canvas
    const canvasInfo = await page.evaluate(() => {
        const c = document.querySelector('canvas');
        return c ? { w: c.width, h: c.height, style: c.style.cssText } : null;
    });
    console.log('Canvas:', canvasInfo);

    // Check game
    const gameInfo = await page.evaluate(() => {
        if (!window.game) return 'window.game is undefined';
        return {
            isRunning: window.game.isRunning,
            sceneKeys: window.game.scene.scenes.map(s => s.scene.key),
            activeScenes: window.game.scene.scenes.filter(s => s.scene.settings.active).map(s => s.scene.key)
        };
    });
    console.log('Game:', gameInfo);

    // Print console logs
    console.log('\n--- Console Logs ---');
    logs.forEach(l => console.log(l));

    console.log('\n--- Page Errors ---');
    errors.forEach(e => console.log(e));

    await browser.close();
})();
