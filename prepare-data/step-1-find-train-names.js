import puppeteer from "puppeteer";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeTrainNames() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto("https://eticket.railway.gov.bd/train-information");

    await page.waitForSelector("#trainFilterInput");
    await page.click("#trainFilterInput");
    await delay(1000);

    await page.type("#trainFilterInput", "R");

    // Wait for the train-name elements to be present
    await page.waitForFunction(() => {
      return document.querySelectorAll(".train-name").length > 0;
    });

    const trainNames = await page.evaluate(() => {
      const trainNameElements = document.querySelectorAll(".train-name");
      return Array.from(trainNameElements).map((el) => el.textContent.trim());
    });

    await browser.close();
    return trainNames;
  } catch (error) {
    console.error("Error scraping train names:", error);
    await browser.close();
    return [];
  }
}

async function writeTrainNamesToFile() {
  const trainNames = await scrapeTrainNames();

  if (trainNames.length === 0) {
    console.log("No train names found.");
    return;
  }

  const resultTsContent = `export const trainNameOptions = ${JSON.stringify(
    trainNames,
    null,
    2
  )};`;

  const filePath = path.join(__dirname, "trainNames.js");

  fs.writeFileSync(filePath, resultTsContent);

  console.log("Train names written to trainNames.js");
}

writeTrainNamesToFile();
