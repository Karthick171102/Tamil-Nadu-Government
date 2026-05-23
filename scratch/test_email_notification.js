import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';

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

let success = false;
try {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Listen for console logs and errors
  page.on('console', msg => {
    console.log(`[Browser Console ${msg.type()}]: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[Browser JS Error]: ${err.message}`);
  });

  console.log('Navigating to http://localhost:5188/services/grievances ...');
  await page.goto('http://localhost:5188/services/grievances');

  // Wait for load
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Toggle language to English to make verification easier
  console.log('Checking language selection...');
  const langBtn = page.locator('button', { hasText: 'English' }).first();
  if (await langBtn.isVisible()) {
    console.log('Language is currently Tamil. Toggling to English...');
    await langBtn.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
  } else {
    console.log('Language is already English.');
  }

  // Click start complaint
  console.log('Opening complaint form...');
  await page.locator('button', { hasText: 'Start New Complaint' }).click();
  await page.waitForSelector('#fullName');

  // Fill details
  console.log('Filling form details...');
  await page.fill('#fullName', 'Email Test User');
  await page.fill('#phone', '9876543210');
  await page.fill('#email', 'petitioner.test@example.com');
  
  // Select District
  console.log('Selecting District...');
  await page.locator('#district').click();
  await page.waitForSelector('#district-wrapper ul');
  await page.locator('#district-wrapper ul button').filter({ hasText: 'Chennai' }).first().click();

  // Select Constituency
  console.log('Selecting Constituency...');
  await page.locator('#constituency').click();
  await page.waitForSelector('#constituency-wrapper ul');
  await page.locator('#constituency-wrapper ul button').filter({ hasText: 'Harbour' }).first().click();

  // Describe issue
  console.log('Entering issue description...');
  await page.fill('#issue', 'This is an end-to-end verification test to ensure that the email notification system works as expected upon submission.');

  // Click submit
  console.log('Submitting the grievance form...');
  await page.locator('button[type="submit"]').click();

  // Wait for success screen
  console.log('Waiting for the Success screen...');
  await page.waitForSelector('text=Grievance Submitted!');

  // Wait for animations to finish
  console.log('Waiting for entrance animations...');
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Verify email status banner is visible and check content
  console.log('Checking email notification banner on Success screen...');
  const statusTexts = ['Simulated', 'sent', 'failed', 'sending'];
  try {
    // Wait for any of the status text indicators to show up
    await Promise.any(
      statusTexts.map(text => 
        page.waitForSelector(`text=${text}`, { state: 'visible', timeout: 10000 })
      )
    );
    
    // Find which status text is visible and retrieve parent content
    let textContent = '';
    for (const st of statusTexts) {
      const loc = page.locator(`text=${st}`).first();
      if (await loc.isVisible()) {
        const parent = loc.locator('xpath=./ancestor::div[contains(@class, "px-4") or contains(@class, "py-3")]').first();
        textContent = await parent.innerText();
        break;
      }
    }
    
    console.log('\n--- Email Status Banner text ---');
    console.log(textContent);
    console.log('--------------------------------\n');
    
    if (textContent.includes('petitioner.test@example.com')) {
      console.log('✅ Success: Email notification banner contains the target email address!');
      success = true;
    } else {
      console.error('❌ Error: Email banner does not reference the correct email address!');
    }
  } catch (err) {
    console.error('❌ Error: Email status banner did not become visible:', err.message);
  }

  // Take a screenshot
  const screenshotPath = path.join('c:\\TN-Gov\\scratch', 'grievance_success_email_simulated.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Saved screenshot to ${screenshotPath}`);

  await browser.close();
} catch (err) {
  console.error('Error during test execution:', err);
} finally {
  console.log('Stopping Vite server...');
  server.kill();
  if (success) {
    console.log('TEST PASSED!');
    process.exit(0);
  } else {
    console.log('TEST FAILED!');
    process.exit(1);
  }
}
