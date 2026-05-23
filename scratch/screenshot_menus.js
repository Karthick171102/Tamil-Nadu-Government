import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewportSize({ width: 1280, height: 800 });
  
  // Go to localhost:5174
  await page.goto('http://localhost:5174/');
  
  // Check if lang is Tamil, click the toggle if it's English
  // The slim strip language switch button has language toggling logic.
  // Let's find it.
  const htmlLang = await page.getAttribute('html', 'lang');
  console.log('Current HTML lang:', htmlLang);
  
  // In LanguageContext: document.documentElement.lang = language;
  // If it's 'en', we want to switch to 'ta' (Tamil).
  // The toggle button contains text 'தமிழ்' when it's English, or 'English' when it's Tamil.
  // Wait, let's look at the navbar slim strip:
  // <button onClick={toggleLanguage} className="... pl-1 mr-3"> {language === 'ta' ? 'English' : 'தமிழ்'} </button>
  // So if it's 'en', the button says 'தமிழ்'. Let's search for a button with text 'தமிழ்'.
  const langButton = page.locator('button:has-text("தமிழ்")');
  if (await langButton.count() > 0) {
    console.log('Clicking language button to switch to Tamil');
    await langButton.click();
    await page.waitForTimeout(500);
  }
  
  const currentLang = await page.getAttribute('html', 'lang');
  console.log('New HTML lang:', currentLang);
  
  const artifactDir = 'c:\\TN-Gov\\scratch';
  
  // Let's find the nav links: Services, Government, Schemes, Documents
  // In Tamil, they translate to:
  // 'nav.services': 'சேவைகள்'
  // 'nav.government': 'அரசாங்கம்'
  // 'nav.documents': 'ஆவணங்கள்'
  // 'nav.schemes': 'திட்டங்கள்'
  
  const menus = [
    { name: 'Services', text: 'சேவைகள்', filename: 'megamenu_services.png' },
    { name: 'Government', text: 'அரசாங்கம்', filename: 'megamenu_government.png' },
    { name: 'Documents', text: 'ஆவணங்கள்', filename: 'megamenu_documents.png' },
    { name: 'Schemes', text: 'திட்டங்கள்', filename: 'megamenu_schemes.png' }
  ];
  
  for (const menu of menus) {
    console.log(`Hovering over menu: ${menu.name} (${menu.text})`);
    
    // Find the nav link
    const locator = page.locator(`nav a:has-text("${menu.text}")`);
    if (await locator.count() > 0) {
      await locator.hover();
      await page.waitForTimeout(500); // wait for framer motion animation
      
      const screenshotPath = path.join(artifactDir, menu.filename);
      await page.screenshot({ path: screenshotPath });
      console.log(`Saved screenshot to ${screenshotPath}`);
      
      // Move mouse away to close dropdown
      await page.mouse.move(0, 0);
      await page.waitForTimeout(300);
    } else {
      console.log(`Could not find link for ${menu.text}`);
    }
  }
  
  await browser.close();
}

capture().catch(console.error);
