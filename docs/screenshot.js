const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = __dirname;

async function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

async function takeScreenshot(page, url, filename) {
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0' });
  await delay(1500); // Give it some extra time for animations and data fetching
  const filePath = path.join(OUTPUT_DIR, filename);
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`Saved screenshot: ${filename}`);
}

(async () => {
  console.log('Starting Puppeteer...');
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1440, height: 900 }
  });
  
  const page = await browser.newPage();
  
  try {
    // 1. Login Page
    await takeScreenshot(page, BASE_URL, '01_Login.png');
    
    // Login as Employee
    console.log('Logging in as Karyawan...');
    await page.type('input[type="email"]', 'rayhan.iqbal@kpc.co.id');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await delay(1000); // Wait for animations
    
    // 2. Karyawan Pages
    await takeScreenshot(page, `${BASE_URL}/employee/status`, '02_Karyawan_Status.png');
    await takeScreenshot(page, `${BASE_URL}/employee/pengajuan`, '03_Karyawan_Pengajuan.png');
    await takeScreenshot(page, `${BASE_URL}/employee/histori`, '04_Karyawan_Histori.png');
    
    // Logout
    console.log('Logging out...');
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    // Login as Approver
    console.log('Logging in as Approver...');
    await page.type('input[type="email"]', 'budi.santoso@kpc.co.id');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await delay(1000);
    
    // 3. Approver Pages
    await takeScreenshot(page, `${BASE_URL}/approver/beranda`, '05_Approver_Beranda.png');
    await takeScreenshot(page, `${BASE_URL}/approver/persetujuan`, '06_Approver_Persetujuan.png');
    await takeScreenshot(page, `${BASE_URL}/approver/histori`, '07_Approver_Histori.png');
    await takeScreenshot(page, `${BASE_URL}/approver/karyawan`, '08_Approver_Data_Karyawan.png');
    await takeScreenshot(page, `${BASE_URL}/approver/approvers`, '09_Approver_Data_Approver.png');
    await takeScreenshot(page, `${BASE_URL}/approver/kriteria`, '10_Approver_Kriteria.png');
    await takeScreenshot(page, `${BASE_URL}/approver/alternatif`, '11_Approver_Alternatif.png');
    await takeScreenshot(page, `${BASE_URL}/approver/matrix`, '12_Approver_Matrix.png');
    await takeScreenshot(page, `${BASE_URL}/approver/ranking`, '13_Approver_Ranking.png');
    
    // Dark mode screenshots!
    console.log('Switching to Dark Mode...');
    // The theme toggle button has title "Toggle dark mode"
    await page.click('button[title="Toggle dark mode"]');
    await delay(1000);
    
    // Let's take a couple of dark mode screenshots to show the new dark mode features
    await takeScreenshot(page, `${BASE_URL}/approver/ranking`, '14_Approver_Ranking_Dark.png');
    
    // Logout and login as Karyawan to show the purple dark mode sidebar
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    // Ensure dark mode is active on login page
    const isDark = await page.evaluate(() => document.documentElement.getAttribute('data-theme') === 'dark');
    if (!isDark) {
      // In this app, theme is stored in localStorage. If we cleared it, we might need to click toggle again
      await page.click('button[title="Toggle dark mode"]');
      await delay(500);
    }
    
    await page.type('input[type="email"]', 'rayhan.iqbal@kpc.co.id');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await delay(1000);
    
    await takeScreenshot(page, `${BASE_URL}/employee/status`, '15_Karyawan_Status_Dark.png');
    
    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Error taking screenshots:', err);
  } finally {
    await browser.close();
  }
})();
