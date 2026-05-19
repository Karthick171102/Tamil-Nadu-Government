import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.tn.gov.in/');
  
  // The carousel on tn.gov.in is usually within a flexslider or similar container
  // Let's look for images in the banner/carousel section
  const carouselData = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.flexslider .slides li'));
    if (slides.length === 0) {
        // Alternative selector if flexslider isn't found
        const bannerImages = Array.from(document.querySelectorAll('.banner img, .carousel img'));
        return bannerImages.map(img => ({
            imageSrc: img.src,
            alt: img.alt,
            text: img.title || img.alt
        }));
    }
    return slides.map(slide => {
      const img = slide.querySelector('img');
      const textOverlay = slide.querySelector('.flex-caption') || slide.querySelector('.caption');
      return {
        imageSrc: img ? img.src : '',
        alt: img ? img.alt : '',
        text: textOverlay ? textOverlay.innerText.trim() : (img ? img.alt : '')
      };
    });
  });

  console.log(JSON.stringify(carouselData, null, 2));
  await browser.close();
})();
