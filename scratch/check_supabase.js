import { chromium } from 'playwright';
import { spawn } from 'child_process';

console.log('Starting Vite server on port 5188...');
const server = spawn('npx', ['vite', '--port', '5188', '--strictPort'], {
  cwd: 'c:\\TN-Gov',
  shell: true
});

let serverStdout = '';
server.stdout.on('data', (data) => {
  serverStdout += data.toString();
  console.log(`[Vite]: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`[Vite Err]: ${data}`);
});

// Wait 4 seconds for server to start
await new Promise(resolve => setTimeout(resolve, 4000));

let success = true;
try {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Listen for console logs and errors
  page.on('console', msg => {
    console.log(`[Browser Console ${msg.type()}]: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[Browser JS Error]: ${err.message}`);
    success = false;
  });

  console.log('Navigating to http://localhost:5188/services/grievances ...');
  await page.goto('http://localhost:5188/services/grievances');

  // Wait 4 seconds for mount and overlay fade
  await new Promise(resolve => setTimeout(resolve, 4000));

  // Click start complaint
  console.log('Opening complaint form...');
  await page.locator('button', { hasText: 'புகாரைத் தொடங்குக' }).click();
  await page.waitForSelector('#fullName');

  // Fill name, district, constituency
  console.log('Testing form interactivity...');
  await page.fill('#fullName', 'Test User');
  await page.fill('#phone', '9999999999');
  await page.fill('#email', 'test.user@example.com');
  
  // Verify values are populated
  const phoneVal = await page.inputValue('#phone');
  console.log(`Phone input contains: ${phoneVal}`);
  if (phoneVal !== '9999999999') {
    console.error('Phone field validation / inputs failed!');
    success = false;
  }

  await browser.close();
} catch (err) {
  console.error('Error during test:', err);
  success = false;
} finally {
  console.log('Stopping Vite server...');
  server.kill();
  if (success) {
    console.log('TEST PASSED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.log('TEST FAILED!');
    process.exit(1);
  }
}
