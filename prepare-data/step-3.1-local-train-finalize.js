import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_TRAIN_DETAILS_DIR = path.join(__dirname, "local_train_details");
const FINAL_TRAIN_DATA_DIR = path.join(__dirname, "Final_train_data");

// ---------------------------------------------------------------------------
// Special-case handlers
// ---------------------------------------------------------------------------

function handleTitasCommuter(_trainName, files, routeDataByFile) {
  // 33 → forward, 34 → reverse, 35 → forward_2, 36 → reverse_2
  const byNumber = {};

  for (const file of files) {
    const match = file.match(/_(\d+)\.js$/i);
    if (!match) continue;
    byNumber[Number(match[1])] = routeDataByFile[file];
  }

  const required = [33, 34, 35, 36];
  const missing = required.filter((num) => !byNumber[num]);
  if (missing.length) {
    console.log(
      `Titas Commuter: missing train number(s): ${missing.join(", ")}`,
    );
    return null;
  }

  return {
    forward: byNumber[33],
    reverse: byNumber[34],
    forward_2: byNumber[35],
    reverse_2: byNumber[36],
  };
}

/**
 * Chattogram Mail (1) = forward (Dhaka → Chattogram)
 * Dhaka Mail (2) = reverse (Chattogram → Dhaka)
 */
function handleDhakaChattogramMail(_trainName, files, routeDataByFile) {
  const forwardFile = files.find((file) => /^chattogram_mail_/i.test(file));
  const reverseFile = files.find((file) => /^dhaka_mail_/i.test(file));

  if (!forwardFile || !reverseFile) {
    console.log(
      "Dhaka/Chattogram Mail: need both dhaka_mail_* and chattogram_mail_* files",
    );
    return null;
  }

  return {
    forward: routeDataByFile[forwardFile],
    reverse: routeDataByFile[reverseFile],
  };
}

function getGroupKey(trainName) {
  const name = (trainName || "").toLowerCase();
  if (name.includes("dhaka_mail") || name.includes("chattogram_mail")) {
    return "dhaka_mail";
  }
  return trainName;
}

function getSpecialHandler(trainName) {
  const name = (trainName || "").toLowerCase();
  if (name.includes("titas")) return handleTitasCommuter;
  if (name.includes("dhaka_mail") || name.includes("chattogram_mail")) {
    return handleDhakaChattogramMail;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Generic finalize logic (mirrors step-3-finalize-train-details.js)
// ---------------------------------------------------------------------------

function processGenericTrain(trainName, files, routeDataByFile) {
  const sortedFiles = [...files].sort((a, b) => {
    const numA = Number((a.match(/_(\d+|na)\.js$/i) || [])[1]) || 0;
    const numB = Number((b.match(/_(\d+|na)\.js$/i) || [])[1]) || 0;
    return numA - numB;
  });

  if (sortedFiles.length === 2) {
    return {
      forward: routeDataByFile[sortedFiles[0]],
      reverse: routeDataByFile[sortedFiles[1]],
    };
  }

  if (sortedFiles.length === 1) {
    return {
      forward: routeDataByFile[sortedFiles[0]],
      reverse: null,
    };
  }

  console.log(
    `Skipping ${trainName}: expected 1 or 2 files, got ${sortedFiles.length}`,
  );
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function combineLocalTrainData() {
  if (!fs.existsSync(LOCAL_TRAIN_DETAILS_DIR)) {
    throw new Error(
      `local_train_details folder not found: ${LOCAL_TRAIN_DETAILS_DIR}`,
    );
  }

  if (!fs.existsSync(FINAL_TRAIN_DATA_DIR)) {
    fs.mkdirSync(FINAL_TRAIN_DATA_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(LOCAL_TRAIN_DETAILS_DIR)
    .filter((file) => file.endsWith(".js"));

  const trainMap = {};

  for (const file of files) {
    const match = file.match(/^(.*)_(\d+|na)\.js$/i);
    if (!match) {
      console.log(`Skipping unrecognized filename: ${file}`);
      continue;
    }

    const groupKey = getGroupKey(match[1]);
    if (!trainMap[groupKey]) {
      trainMap[groupKey] = [];
    }
    trainMap[groupKey].push(file);
  }

  const written = [];
  const skipped = [];

  for (const trainName of Object.keys(trainMap).sort()) {
    const groupFiles = trainMap[trainName];
    const routeDataByFile = {};

    try {
      for (const file of groupFiles) {
        const filePath = path.join(LOCAL_TRAIN_DETAILS_DIR, file);
        const module = await import(pathToFileURL(filePath).href);
        if (!module.trainRouteData) {
          throw new Error(`No trainRouteData export in ${file}`);
        }
        routeDataByFile[file] = module.trainRouteData;
      }

      const specialHandler = getSpecialHandler(trainName);
      let trainData = null;

      if (specialHandler) {
        trainData = specialHandler(trainName, groupFiles, routeDataByFile);
        if (!trainData) {
          skipped.push({
            trainName,
            reason: "special-case handler returned no data",
          });
          console.log(
            `Skipping ${trainName}: special-case handler returned no data`,
          );
          continue;
        }
      } else {
        trainData = processGenericTrain(trainName, groupFiles, routeDataByFile);
        if (!trainData) {
          skipped.push({
            trainName,
            reason: "generic processing skipped",
          });
          continue;
        }
      }

      const outputFileName = `${trainName}.js`;
      const outputFilePath = path.join(FINAL_TRAIN_DATA_DIR, outputFileName);
      const outputContent = `export const trainData = ${JSON.stringify(
        trainData,
        null,
        2,
      )};\n`;

      fs.writeFileSync(outputFilePath, outputContent);
      written.push(outputFileName);
      console.log(`Combined data for ${trainName} saved to ${outputFileName}`);
    } catch (error) {
      console.error(`Error processing ${trainName}:`, error);
      skipped.push({
        trainName,
        reason: error.message,
      });
    }
  }

  console.log("\n=== Local Train Finalize Summary ===\n");
  console.log(`Written: ${written.length}`);
  console.log(`Skipped: ${skipped.length}`);

  if (written.length) {
    console.log("\n--- Final_train_data ---");
    for (const file of written) {
      console.log(`  ${file}`);
    }
  }

  if (skipped.length) {
    console.log("\n--- skipped ---");
    for (const item of skipped) {
      console.log(`  ${item.trainName}: ${item.reason}`);
    }
  }

  console.log("\nDone.\n");
}

combineLocalTrainData();
