import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = path.join(__dirname, "trainNames.js");
const localTrainDetailsDir = path.join(__dirname, "local_train_details");
const outputFilePath = path.join(__dirname, "uniqueTrainNames.js");

// Remove bracketed number and trim
function extractTrainNameWithoutNumber(name) {
  return name.replace(/\s*\(.*?\)\s*/g, "").trim();
}

function getNamesFromTrainNamesFile() {
  const fileContent = fs.readFileSync(inputFilePath, "utf8");

  const matches = fileContent.match(/\[\s*([\s\S]*?)\s*\]/);
  if (!matches || matches.length < 2) {
    console.error("❌ Could not extract train name array.");
    return [];
  }

  const arrayContent = matches[1];

  return arrayContent
    .split(",")
    .map((line) => line.replace(/["']/g, "").trim())
    .filter((line) => line.length > 0)
    .map(extractTrainNameWithoutNumber);
}

async function getNamesFromLocalTrainDetails() {
  if (!fs.existsSync(localTrainDetailsDir)) {
    console.warn("⚠️ local_train_details folder not found; skipping local trains");
    return [];
  }

  const files = fs
    .readdirSync(localTrainDetailsDir)
    .filter((file) => file.endsWith(".js"));

  const names = [];

  for (const file of files) {
    try {
      const filePath = path.join(localTrainDetailsDir, file);
      const module = await import(pathToFileURL(filePath).href);
      const trainName = module.trainRouteData?.train_name;
      if (trainName) {
        names.push(String(trainName).trim());
      }
    } catch (error) {
      console.error(`Error reading ${file}:`, error.message);
    }
  }

  return names;
}

async function extractUniqueNames() {
  const namesFromTrainNames = getNamesFromTrainNamesFile();
  const namesFromLocalDetails = await getNamesFromLocalTrainDetails();

  const filteredNames = [...namesFromTrainNames, ...namesFromLocalDetails].filter(
    (name) =>
      name &&
      name.length > 0 &&
      !name.toLowerCase().includes("narayanganj commuter"),
  );

  const uniqueNames = Array.from(new Set(filteredNames)).sort();

  const outputJs = `export const uniqueTrainNames = ${JSON.stringify(
    uniqueNames,
    null,
    2,
  )};\n`;

  fs.writeFileSync(outputFilePath, outputJs, "utf8");
  console.log(`✅ Unique train names written to ${outputFilePath}`);
  console.log(`   From trainNames.js:        ${namesFromTrainNames.length}`);
  console.log(`   From local_train_details:  ${namesFromLocalDetails.length}`);
  console.log(`   Unique total:              ${uniqueNames.length}`);
}

extractUniqueNames();
