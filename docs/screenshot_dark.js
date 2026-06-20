const puppeteer = require('puppeteer');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = __dirname;

async function delay(time) {
  return new Promise(function(resolve) { setTimeout(resolve, time) });
}

(async () => {
  console.log('Starting Puppeteer for Dark Mode...');
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();
  
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    // Force Dark Mode via localStorage and direct DOM injection
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    
    console.log('Logging in as Approver...');
    await page.type('input[type="email"]', 'budi.santoso@kpc.co.id');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.goto(`${BASE_URL}/approver/ranking`, { waitUntil: 'networkidle0' });
    
    // Ensure dark mode persists after navigation
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await delay(1500);
    
    const filePath = path.join(OUTPUT_DIR, '14_Approver_Ranking_Dark.png');
    await page.screenshot({ path: filePath, fullPage: true });
    console.log('Saved screenshot: 14_Approver_Ranking_Dark.png');
    
    // Logout
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    // Force Dark Mode again
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    
    console.log('Logging in as Karyawan...');
    await page.type('input[type="email"]', 'rayhan.iqbal@kpc.co.id');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.goto(`${BASE_URL}/employee/status`, { waitUntil: 'networkidle0' });
    
    // Ensure dark mode persists
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await delay(1500);
    
    const filePath2 = path.join(OUTPUT_DIR, '15_Karyawan_Status_Dark.png');
    await page.screenshot({ path: filePath2, fullPage: true });
    console.log('Saved screenshot: 15_Karyawan_Status_Dark.png');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
})();
