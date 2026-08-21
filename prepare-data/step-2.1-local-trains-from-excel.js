import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_PATH = path.join(__dirname, "..", "Local-Train-Schedule.xlsx");
const LOCAL_TRAIN_DETAILS_DIR = path.join(__dirname, "local_train_details");

const HALT_MINUTES = 2;
const TRAIN_TYPE = "local";
const ALL_DAYS = ["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];
const DAY_MAP = {
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function excelTimeToMinutes(serial) {
  if (typeof serial === "string" && serial.includes(":")) {
    const match = serial.match(/(\d+):(\d+)/);
    if (match) {
      return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
    }
  }
  const totalMinutes = Math.round(Number(serial) * 24 * 60);
  return totalMinutes;
}

function formatTimeBST(totalMinutes) {
  const mins = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? "pm" : "am";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm} BST`;
}

function formatDuration(minutes) {
  const rounded = Math.max(0, Math.round(minutes));
  const h = Math.floor(rounded / 60);
  const m = rounded % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function weeklyOffdayToDays(offday) {
  const value = (offday || "None").trim().toLowerCase();
  if (value === "none" || value === "") {
    return [...ALL_DAYS];
  }
  const offDayShort = DAY_MAP[value];
  if (!offDayShort) {
    console.warn(`Unknown offday "${offday}", defaulting to daily`);
    return [...ALL_DAYS];
  }
  return ALL_DAYS.filter((day) => day !== offDayShort);
}

function getTrainNumberSlug(trainNumber) {
  if (trainNumber === "" || trainNumber === null || trainNumber === undefined) {
    return "na";
  }
  return String(trainNumber);
}

function getFileSlug(row) {
  return (row.Train_Name || "").trim().toLowerCase().replace(/\s+/g, "_");
}

function toSheetKey(startStation, destStation) {
  const start = (startStation || "").trim().toLowerCase().replace(/\s+/g, "-");
  const dest = (destStation || "").trim().toLowerCase().replace(/\s+/g, "-");
  return `${start}-${dest}`;
}

// ---------------------------------------------------------------------------
// Excel loading
// ---------------------------------------------------------------------------

function loadWorkbook() {
  if (!fs.existsSync(EXCEL_PATH)) {
    throw new Error(`Excel file not found: ${EXCEL_PATH}`);
  }
  return XLSX.readFile(EXCEL_PATH);
}

function parseLocalTrainsSheet(workbook) {
  const sheet = workbook.Sheets.local_trains;
  if (!sheet) {
    throw new Error('Sheet "local_trains" not found in workbook');
  }
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

function parseRouteSheets(workbook) {
  const sheets = {};
  for (const name of workbook.SheetNames) {
    if (name === "local_trains") continue;
    sheets[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name], {
      defval: "",
    });
  }
  return sheets;
}

// ---------------------------------------------------------------------------
// Schedule building
// ---------------------------------------------------------------------------

function buildSchedule(stations, startDepSerial, endArrSerial) {
  const n = stations.length;
  if (n < 2) {
    throw new Error("Route sheet must contain at least 2 stations");
  }

  const startDep = excelTimeToMinutes(startDepSerial);
  let endArr = excelTimeToMinutes(endArrSerial);
  if (endArr <= startDep) {
    endArr += 24 * 60;
  }

  const totalJourney = endArr - startDep;
  const haltBudget = (n - 1) * HALT_MINUTES;
  let travelBudget = totalJourney - haltBudget;
  if (travelBudget < 0) {
    console.warn(
      `Travel budget negative (${travelBudget} min) for ${stations[0].station_name_english} -> ${stations[n - 1].station_name_english}; using full journey time`,
    );
    travelBudget = totalJourney;
  }

  const distances = stations.map((row) => Number(row.Distance) || 0);
  const totalDist = distances[n - 1] - distances[0];

  const segmentTravels = [];
  for (let i = 0; i < n - 1; i++) {
    const segDist = distances[i + 1] - distances[i];
    const raw =
      totalDist > 0
        ? (travelBudget * segDist) / totalDist
        : travelBudget / (n - 1);
    segmentTravels.push(Math.round(raw));
  }

  const routes = [];
  let currentTime = startDep;

  for (let i = 0; i < n; i++) {
    const city = (stations[i].station_name_english || "")
      .trim()
      .replace(/\s+/g, "_");

    if (i === 0) {
      routes.push({
        city,
        departure_time: formatTimeBST(startDep),
        arrival_time: null,
        halt: null,
        duration: null,
      });
      continue;
    }

    if (i < n - 1) {
      const segTravel = segmentTravels[i - 1];
      const arrival = currentTime + segTravel;
      const departure = arrival + HALT_MINUTES;
      routes.push({
        city,
        arrival_time: formatTimeBST(arrival),
        halt: String(HALT_MINUTES).padStart(2, "0"),
        departure_time: formatTimeBST(departure),
        duration: formatDuration(segTravel),
      });
      currentTime = departure;
    } else {
      const lastSegTravel = endArr - currentTime;
      routes.push({
        city,
        arrival_time: formatTimeBST(endArr),
        departure_time: null,
        halt: null,
        duration: formatDuration(lastSegTravel),
      });
    }
  }

  return routes;
}

function buildTrainRouteData(row, stations) {
  const routes = buildSchedule(
    stations,
    row.Departure_time_from_start_station,
    row.Arrival_Time_at_Destination_Station,
  );

  const startCity = (row.Start_Station || "").trim().replace(/\s+/g, "_");
  const destCity = (row.Destination_Station || "").trim().replace(/\s+/g, "_");
  const startDep = excelTimeToMinutes(row.Departure_time_from_start_station);
  let endArr = excelTimeToMinutes(row.Arrival_Time_at_Destination_Station);
  if (endArr <= startDep) {
    endArr += 24 * 60;
  }

  const trainNumber =
    row.Train_Number === "" ||
    row.Train_Number === null ||
    row.Train_Number === undefined
      ? "NA"
      : Number(row.Train_Number);

  return {
    path: `${startCity.replace(/_/g, " ")} to ${destCity.replace(/_/g, " ")}`,
    days: weeklyOffdayToDays(row.Weekly_offday),
    routes,
    total_duration: formatDuration(endArr - startDep),
    train_name: (row.Train_Name || "").trim().toUpperCase(),
    train_number: trainNumber,
    train_type: TRAIN_TYPE,
  };
}

// ---------------------------------------------------------------------------
// File writers
// ---------------------------------------------------------------------------

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeTrainDetailsFile(fileName, trainRouteData) {
  const filePath = path.join(LOCAL_TRAIN_DETAILS_DIR, fileName);
  const content = `export const trainRouteData = ${JSON.stringify(
    trainRouteData,
    null,
    2,
  )};`;
  fs.writeFileSync(filePath, content);
  return filePath;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  ensureDir(LOCAL_TRAIN_DETAILS_DIR);

  const workbook = loadWorkbook();
  const localTrains = parseLocalTrainsSheet(workbook);
  const routeSheets = parseRouteSheets(workbook);

  const trainDetailsWritten = [];
  const skipped = [];
  const warnings = [];

  for (const row of localTrains) {
    const trainName = (row.Train_Name || "").trim();
    const startStation = (row.Start_Station || "").trim();
    const destStation = (row.Destination_Station || "").trim();
    const sheetKey = toSheetKey(startStation, destStation);
    const stations = routeSheets[sheetKey];

    if (!stations || stations.length < 2) {
      skipped.push({
        train_name: trainName,
        train_number: row.Train_Number,
        start: startStation,
        dest: destStation,
        reason: `no route sheet "${sheetKey}"`,
      });
      continue;
    }

    try {
      const trainRouteData = buildTrainRouteData(row, stations);
      const slug = getFileSlug(row);
      const numSlug = getTrainNumberSlug(row.Train_Number);
      const fileName = `${slug}_${numSlug}.js`;
      const filePath = writeTrainDetailsFile(fileName, trainRouteData);
      trainDetailsWritten.push(filePath);
      console.log(
        `Data for ${trainRouteData.train_name} (${trainRouteData.train_number}) saved to ${fileName}`,
      );
    } catch (error) {
      warnings.push({
        train_name: trainName,
        train_number: row.Train_Number,
        error: error.message,
      });
    }
  }

  console.log("\n=== Local Train Excel Import Summary ===\n");
  console.log(`Processed: ${trainDetailsWritten.length}`);
  console.log(`Skipped:   ${skipped.length}`);
  console.log(`Warnings:  ${warnings.length}`);

  if (trainDetailsWritten.length) {
    console.log("\n--- local_train_details ---");
    for (const f of trainDetailsWritten) {
      console.log(`  ${path.basename(f)}`);
    }
  }

  if (skipped.length) {
    console.log("\n--- skipped (no route sheet) ---");
    for (const s of skipped) {
      console.log(
        `  ${s.train_number || "NA"} ${s.train_name}: ${s.start} -> ${s.dest} (${s.reason})`,
      );
    }
  }

  if (warnings.length) {
    console.log("\n--- warnings ---");
    for (const w of warnings) {
      console.log(`  ${w.train_name || w.train_number}: ${w.error}`);
    }
  }

  console.log("\nDone.\n");
}

main();
