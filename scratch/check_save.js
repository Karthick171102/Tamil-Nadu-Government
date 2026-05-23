import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('Current directory:', process.cwd());
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('data:text/html,<h1>Hello World</h1>');
  
  const targetPath = path.resolve('scratch/test_screenshot.png');
  console.log('Target path:', targetPath);
  
  await page.screenshot({ path: targetPath });
  console.log('Screenshot taken.');
  
  const exists = fs.existsSync(targetPath);
  console.log('Does file exist according to fs:', exists);
  if (exists) {
    console.log('File size:', fs.statSync(targetPath).size);
  }
  
  await browser.close();
}

run().catch(console.error);
