import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 900 });
  
  // ── 1. Check Home Page Updates ─────────────────────────────────────────
  await page.goto('http://localhost:5174/');
  await page.waitForTimeout(500);
  
  // Switch to Tamil
  const langButton = page.locator('button:has-text("தமிழ்")');
  if (await langButton.count() > 0) {
    await langButton.click();
    await page.waitForTimeout(500);
  }
  
  console.log('Checking Home Page updates for Adi Dravidar references...');
  const taTextCount = await page.locator(':text("ஆதிதிராவிடர்")').count();
  const enTextCount = await page.locator(':text("Adi Dravida")').count();
  const enWelfareCount = await page.locator(':text("Adi Dravidar")').count();
  console.log(`Tamil count: ${taTextCount}, English count: ${enTextCount}, English Welfare count: ${enWelfareCount}`);
  if (taTextCount === 0 && enTextCount === 0 && enWelfareCount === 0) {
    console.log('✅ Home Page is clean of Adi Dravida references.');
  } else {
    console.log('❌ Home Page still contains Adi Dravida references!');
  }
  
  const artifactDir = 'scratch';
  
  // ── 2. Capture Megamenu hover states and verify alignment ──────────────
  const menus = [
    { name: 'Services', text: 'சேவைகள்', filename: 'megamenu_services.png' },
    { name: 'Government', text: 'அரசாங்கம்', filename: 'megamenu_government.png' },
    { name: 'Documents', text: 'ஆவணங்கள்', filename: 'megamenu_documents.png' },
    { name: 'Schemes', text: 'திட்டங்கள்', filename: 'megamenu_schemes.png' }
  ];
  
  for (const menu of menus) {
    const locator = page.locator(`nav a:has-text("${menu.text}")`);
    if (await locator.count() > 0) {
      await locator.hover();
      await page.waitForTimeout(800); // wait longer for animation
      
      const screenshotPath = path.join(artifactDir, menu.filename);
      await page.screenshot({ path: screenshotPath });
      console.log(`Saved ${menu.name} to ${screenshotPath}`);
      console.log(`Exists: ${fs.existsSync(screenshotPath)}, size: ${fs.statSync(screenshotPath).size}`);
      
      await page.mouse.move(0, 0);
      await page.waitForTimeout(300);
    } else {
      console.log(`Could not find link for ${menu.text}`);
    }
  }
  
  // ── 3. Check Online Services Page ──────────────────────────────────────
  console.log('Navigating to Online Services...');
  await page.goto('http://localhost:5174/services/online');
  await page.waitForTimeout(800);
  
  console.log('Checking Online Services page for Adi Dravidar references...');
  const taServicesCount = await page.locator(':text("ஆதிதிராவிடர்")').count();
  const enServicesCount = await page.locator(':text("Adi Dravida")').count();
  console.log(`Tamil count: ${taServicesCount}, English count: ${enServicesCount}`);
  if (taServicesCount === 0 && enServicesCount === 0) {
    console.log('✅ Online Services page is clean of Adi Dravida references.');
  } else {
    console.log('❌ Online Services page still contains Adi Dravida references!');
  }
  
  // Save Online Services Page Screenshot
  const onlineSvcPath = path.join(artifactDir, 'online_services_tamil.png');
  await page.screenshot({ path: onlineSvcPath });
  console.log(`Saved Online Services screenshot to ${onlineSvcPath}`);
  
  await browser.close();
}

capture().catch(console.error);
