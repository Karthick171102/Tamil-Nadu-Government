import { chromium } from 'playwright';
import { spawn } from 'child_process';

console.log('Starting Vite server on port 5188...');
const server = spawn('npx', ['vite', '--port', '5188', '--strictPort'], {
  cwd: 'c:\\TN-Gov',
  shell: true
});

server.stdout.on('data', (data) => {
  console.log(`[Vite]: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`[Vite Err]: ${data}`);
});

// Wait 4 seconds for server to start
await new Promise(resolve => setTimeout(resolve, 4000));

try {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to http://localhost:5188/services/grievances ...');
  await page.goto('http://localhost:5188/services/grievances');

  // Wait 5 seconds for the loader to completely fade out and unmount
  console.log('Waiting 5 seconds for loading overlay to unmount...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Click the "Start New Complaint" / "புதிய புகாரைத் தொடங்குக" button
  console.log('Clicking the "Start New Complaint" button...');
  await page.locator('button', { hasText: 'புகாரைத் தொடங்குக' }).click();
  
  // Wait for the form to render
  console.log('Waiting for #district to be visible...');
  await page.waitForSelector('#district');

  // Find css rules for .border, .border-gray-200, .bg-white, button
  const matchingRules = await page.evaluate(() => {
    const results = {};
    for (const sheet of document.styleSheets) {
      try {
        const checkRules = (rules) => {
          for (const rule of rules) {
            if (rule.type === CSSRule.MEDIA_RULE) {
              checkRules(rule.cssRules);
            } else if (rule.type === CSSRule.STYLE_RULE) {
              const sel = rule.selectorText;
              if (sel && (sel === '.border' || sel.includes('.border-gray-200') || sel.includes('button') || sel === '.border-solid')) {
                results[sel] = rule.cssText;
              }
            } else if (rule.type === 12) { // CSSLayerBlockRule (Vite/Tailwind layer)
              checkRules(rule.cssRules);
            }
          }
        };
        checkRules(sheet.cssRules);
      } catch (e) {
        results['error'] = e.message;
      }
    }
    return results;
  });
  console.log('Matching Rules in document:', JSON.stringify(matchingRules, null, 2));

  await browser.close();
} catch (err) {
  console.error('Error during test:', err);
} finally {
  server.kill();
  process.exit(0);
}
