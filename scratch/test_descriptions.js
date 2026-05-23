import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function waitForLoader(page) {
  console.log('Waiting for loader to disappear...');
  await page.waitForSelector('.fixed.inset-0.z-\\[9999\\]', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(1000); // Wait for transition animations to finish
}

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 1000 });
  const artifactDir = 'scratch';
  
  // ── 1. Services Hub (English) ─────────────────────────────────────────
  console.log('Navigating to Services Hub (English)...');
  await page.goto('http://localhost:5174/services');
  await waitForLoader(page);
  
  const engButton = page.locator('button.font-outfit:has-text("English")');
  if (await engButton.count() > 0) {
    await engButton.first().click();
    await page.waitForTimeout(1000);
  }
  
  await page.screenshot({ path: path.join(artifactDir, 'services_hub_english.png') });
  console.log('Saved services_hub_english.png');
  
  // ── 2. Online Services (English) - Category Filter ────────────────────
  console.log('Navigating to Online Services (English)...');
  await page.goto('http://localhost:5174/services/online');
  await waitForLoader(page);
  
  const catFilterBtnEn = page.locator('main button').filter({ hasText: /^Category$/i });
  if (await catFilterBtnEn.count() > 0) {
    console.log('Clicking Category filter button...');
    await catFilterBtnEn.first().click();
    await page.waitForTimeout(1000);
  }
  
  await page.screenshot({ path: path.join(artifactDir, 'online_services_cat_english.png') });
  console.log('Saved online_services_cat_english.png');
  
  // ── 3. Online Services (English) - Service Filter ─────────────────────
  console.log('Switching to Service Filter (English)...');
  const svcFilterBtnEn = page.locator('main button').filter({ hasText: /^Service$/i });
  if (await svcFilterBtnEn.count() > 0) {
    console.log('Clicking Service filter button...');
    await svcFilterBtnEn.first().click();
    await page.waitForTimeout(2000); // 87 items: needs more time to animate in
  }
  
  await page.screenshot({ path: path.join(artifactDir, 'online_services_svc_english.png') });
  console.log('Saved online_services_svc_english.png');
  
  // ── 4. Online Services (Tamil) - Category Filter ──────────────────────
  console.log('Switching to Tamil...');
  const taButton = page.locator('button.font-outfit:has-text("தமிழ்")');
  if (await taButton.count() > 0) {
    await taButton.first().click();
    await page.waitForTimeout(1000);
  }
  
  const catFilterBtnTa = page.locator('main button').filter({ hasText: /^பிரிவு$/ });
  if (await catFilterBtnTa.count() > 0) {
    console.log('Clicking Category filter button (Tamil)...');
    await catFilterBtnTa.first().click();
    await page.waitForTimeout(1000);
  }
  
  await page.screenshot({ path: path.join(artifactDir, 'online_services_cat_tamil.png') });
  console.log('Saved online_services_cat_tamil.png');
  
  await browser.close();
  console.log('Verification run successfully finished.');
}

capture().catch(console.error);
