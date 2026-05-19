import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.tn.gov.in/press_release.php');
  
  const pressReleaseData = await page.evaluate(() => {
    // Look for images in the press release table or list
    const images = Array.from(document.querySelectorAll('img')).filter(img => img.src.includes('press_release'));
    return images.map(img => ({
      src: img.src,
      alt: img.alt || 'Press Release',
      title: img.title || img.closest('tr')?.innerText.trim().split('\n')[0] || 'Press Release'
    }));
  });

  console.log(JSON.stringify(pressReleaseData, null, 2));
  await browser.close();
})();
