import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const trainDataDir = path.join(__dirname, 'Final_train_data');
const outputDir = path.join(__dirname, 'Stations');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const files = fs.readdirSync(trainDataDir);
const stationMap = {}; // { stationName: { forward: [...], reverse: [...] } }
const allDaysMap = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  };

const allDays = Object.keys(allDaysMap);

for (const file of files) {
  if (!file.endsWith('.js')) continue;

  const filePath = pathToFileURL(path.join(trainDataDir, file)).toString();
  const { trainData } = await import(filePath);

  ['forward', 'reverse'].forEach((direction) => {
    const data = trainData[direction];
    if(!data) {
      return;
    }
    const trainName = data.train_name;
    const trainNumber = data.train_number;
    const days = data.days;
    const route = data.routes;


    const offDays = allDays
        .filter(day => !days.includes(day))
        .map(short => allDaysMap[short]);

    const offDayResult = offDays.length === 0 ? "No OffDay" : offDays[0];

    const startStation = route[0]?.city || '';
    const destStation = route[route.length - 1]?.city || '';
    const destArrival = route[route.length - 1]?.arrival_time || '';

    for (const stop of route) {
      const station = stop.city;
      const arrival = stop.arrival_time || '---';
      const departure = stop.departure_time || '---';

      if (!stationMap[station]) {
        stationMap[station] = { forward: [], reverse: [] };
      }

      stationMap[station][direction].push({
        train_name: trainName,
        train_number: trainNumber,
        offday: offDayResult,
        from: startStation,
        to: destStation,
        arrival_time_at_current: arrival.replace(/\s*BST$/, ''),
        departure_time_at_current: departure.replace(/\s*BST$/, ''),
        arrival_time_at_destination: destArrival.replace(/\s*BST$/, ''),
      });
    }
  });
}

// Helper to parse time string to sortable value
function parseTime(timeStr) {
  if (!timeStr || timeStr === '---') return Infinity;
  try {
    const [time, modifier] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let h = hours % 12;
    if (modifier.toLowerCase() === 'pm') h += 12;
    return h * 60 + minutes;
  } catch {
    return Infinity;
  }
}

// Sort and write station-wise JS files
const allStationNames = [];

for (const station in stationMap) {
  const data = stationMap[station];

  data.forward.sort((a, b) =>
    parseTime(a.arrival_time_at_current) - parseTime(b.arrival_time_at_current)
  );
  data.reverse.sort((a, b) =>
    parseTime(a.arrival_time_at_current) - parseTime(b.arrival_time_at_current)
  );

  const fileContentObject = {
    station,
    forward_trains: data.forward,
    reverse_trains: data.reverse,
  };

  const jsContent = `export const trainData = ${JSON.stringify(fileContentObject, null, 2)};\n`;
  const safeFileName = station.toLowerCase().replace(/[^a-z0-9]/g, '');
  const outputFilePath = path.join(outputDir, `${safeFileName}.js`);

  fs.writeFileSync(outputFilePath, jsContent, 'utf8');
  console.log(`✅ Station file written: ${safeFileName}.js`);

  allStationNames.push(safeFileName);
}

// Write all station names file
allStationNames.sort((a, b) => a.localeCompare(b));
const allStationsJsContent = `export const allStationNames = ${JSON.stringify(allStationNames, null, 2)};\n`;
const allStationsFilePath = path.join(outputDir, '0_all_station_name.js');
fs.writeFileSync(allStationsFilePath, allStationsJsContent, 'utf8');
console.log('✅ All station names written to 0_all_station_name.js');
