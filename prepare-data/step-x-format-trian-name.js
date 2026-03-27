import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = path.join(__dirname, 'trainNames.js');
const outputFilePath = path.join(__dirname, 'uniqueTrainNames.js');

// Remove bracketed number and trim
function extractTrainNameWithoutNumber(name) {
  return name.replace(/\s*\(.*?\)\s*/g, '').trim();
}

async function extractUniqueNames() {
  const fileContent = fs.readFileSync(inputFilePath, 'utf8');

  const matches = fileContent.match(/\[\s*([\s\S]*?)\s*\]/);
  if (!matches || matches.length < 2) {
    console.error('❌ Could not extract train name array.');
    return;
  }

  const arrayContent = matches[1];

  const rawNames = arrayContent
    .split(',')
    .map((line) => line.replace(/["']/g, '').trim())
    .filter((line) => line.length > 0);

  const filteredNames = rawNames
    .map(extractTrainNameWithoutNumber)
    .filter(name => !name.toLowerCase().includes('narayanganj commuter'));

  const uniqueNames = Array.from(new Set(filteredNames)).sort();

  const outputJs = `export const uniqueTrainNames = ${JSON.stringify(
    uniqueNames,
    null,
    2
  )};\n`;

  fs.writeFileSync(outputFilePath, outputJs, 'utf8');
  console.log(`✅ Unique train names written to ${outputFilePath}`);
}

extractUniqueNames();
