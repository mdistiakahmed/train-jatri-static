// file: generate-trains-by-stations.js

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRAIN_DATA_DIR = path.join(__dirname, "Final_train_data");
const OUTPUT_DIR = path.join(__dirname, "trains-by-stations");

// -------------------------------------
// Helpers
// -------------------------------------

function formatCityName(name) {
  return name
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function normalizeCityName(name) {
  return name.replace(/_/g, " ").trim();
}

function getOperatingDays(days = []) {
  if (days.length === 7) return "Daily";
  if (days.length === 0) return "Unknown";
  return days.join(", ");
}

async function readTrainFiles() {
  const files = await fs.readdir(TRAIN_DATA_DIR);

  return files.filter((file) => file.endsWith(".js") && !file.startsWith("_"));
}

function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return null;

  const parseTime = (timeStr) => {
    const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)/i);

    if (!match) return null;

    let [, hour, minute, meridiem] = match;

    hour = parseInt(hour, 10);
    minute = parseInt(minute, 10);

    if (meridiem.toLowerCase() === "pm" && hour !== 12) {
      hour += 12;
    }

    if (meridiem.toLowerCase() === "am" && hour === 12) {
      hour = 0;
    }

    return hour * 60 + minute;
  };

  let startMinutes = parseTime(startTime);
  let endMinutes = parseTime(endTime);

  if (startMinutes === null || endMinutes === null) {
    return null;
  }

  // handle trains crossing midnight
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  const diff = endMinutes - startMinutes;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}`;
}

// -------------------------------------
// Process One Direction
// -------------------------------------

function processDirection(directionData, stationPairMap) {
  if (!directionData || !directionData.routes) {
    return;
  }

  const { train_name, train_number, days, total_duration } = directionData;

  const routes = directionData.routes;

  console.log(`Processing ${train_name} (${train_number})`);

  for (let i = 0; i < routes.length - 1; i++) {
    for (let j = i + 1; j < routes.length; j++) {
      const source = routes[i];
      const destination = routes[j];

      if (!source.departure_time || !destination.arrival_time) {
        continue;
      }

      const sourceCity = normalizeCityName(source.city);
      const destinationCity = normalizeCityName(destination.city);

      const key = `${sourceCity}|||${destinationCity}`;

      if (!stationPairMap.has(key)) {
        stationPairMap.set(key, []);
      }

      stationPairMap.get(key).push({
        train_name,
        train_number,

        arrival_at_source: source.arrival_time,
        departure_from_source: source.departure_time,

        arrival_at_destination: destination.arrival_time,

        journey_duration: calculateDuration(
          source.departure_time,
          destination.arrival_time,
        ),

        operating_days: getOperatingDays(days),

        source_city: sourceCity,
        destination_city: destinationCity,

        main_source_city: routes[0].city,
        main_destination_city: routes[routes.length - 1].city,
      });
    }
  }
}

// -------------------------------------
// Main
// -------------------------------------

async function generateStationSchedules() {
  try {
    await fs.mkdir(OUTPUT_DIR, {
      recursive: true,
    });

    const trainFiles = await readTrainFiles();

    console.log(`Found ${trainFiles.length} train files`);

    const stationPairMap = new Map();

    for (const file of trainFiles) {
      try {
        const filePath = path.join(TRAIN_DATA_DIR, file);

        const modulePath = path.resolve(filePath);

        // Import JS module
        const trainModule = await import(`file://${modulePath}`);

        const data = trainModule.trainData;

        if (!data) {
          console.warn(`No trainData export found in ${file}`);
          continue;
        }

        processDirection(data.forward, stationPairMap);
        processDirection(data.reverse, stationPairMap);
      } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
      }
    }

    console.log(`Generated ${stationPairMap.size} routes`);

    // -------------------------------------
    // Write route files
    // -------------------------------------

    let createdFiles = 0;
    const allTrips = [];

    for (const [key, schedules] of stationPairMap) {
      const first = schedules[0];

      schedules.sort((a, b) =>
        a.departure_from_source.localeCompare(b.departure_from_source),
      );

      const filename = `${formatCityName(
        first.source_city,
      )}-to-${formatCityName(first.destination_city)}.json`;

      const filePath = path.join(OUTPUT_DIR, filename);

      await fs.writeFile(filePath, JSON.stringify(schedules, null, 2));

      allTrips.push({
        route: `${first.source_city} - ${first.destination_city}`,
        filename,
      });

      console.log(`✅ Created ${filename} (${schedules.length} trains)`);

      createdFiles++;
    }

    // -------------------------------------
    // Create all-trips.json
    // -------------------------------------

    allTrips.sort((a, b) => a.route.localeCompare(b.route));

    await fs.writeFile(
      path.join(OUTPUT_DIR, "all-trips.json"),
      JSON.stringify(
        {
          routes: allTrips,
        },
        null,
        2,
      ),
    );

    console.log(`✅ Generated all-trips.json (${allTrips.length} routes)`);

    console.log(`✅ Successfully created ${createdFiles} station pair files`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

generateStationSchedules().catch(console.error);
