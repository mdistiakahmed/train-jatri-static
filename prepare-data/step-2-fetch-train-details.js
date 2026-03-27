import fs from "fs";
import path from "path";
import fetch from "node-fetch"; // If you're using node-fetch
import { trainNameOptions } from "./trainNames.mjs"; // Corrected import
import { fileURLToPath } from 'url';

async function fetchTrainRoutes(trainName, trainNumber) {
  try {
    const apiUrl = "https://railspaapi.shohoz.com/v1.0/web/train-routes";
    const payload = {
      model: trainNumber.toString(),
      departure_date_time: "2025-06-19",
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(
      `Error fetching routes for <span class="math-inline">\{trainName\} \(</span>{trainNumber}):`,
      error
    );
    return null;
  }
}

async function processTrainData() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const trainDetailsDir = path.join(__dirname, 'train_details');

  // Create the 'train_details' directory if it doesn't exist
  if (!fs.existsSync(trainDetailsDir)) {
    fs.mkdirSync(trainDetailsDir);
  }

  for (const trainNameFull of trainNameOptions) {
    const match = trainNameFull.match(/(.*)\s\((\d+)\)/);
    if (match) {
      const trainName = match[1];
      const trainNumber = parseInt(match[2]);
      const routeData = await fetchTrainRoutes(trainName, trainNumber);

      if (routeData) {
        const formattedData = {
          path: `${routeData.routes[0].city} to ${
            routeData.routes[routeData.routes.length - 1].city
          }`,
          days: routeData.days,
          routes: routeData.routes.map((route) => ({
            city: route.city,
            departure_time: route.departure_time,
            halt: route.halt,
            duration: route.duration,
            arrival_time: route.arrival_time,
          })),
          total_duration: routeData.total_duration,
          train_name: trainName,
          train_number: trainNumber,
        };

        const fileName = `${trainName
          .replace(/\s+/g, "_")
          .toLowerCase()}_${trainNumber}.js`;
        const filePath = path.join(trainDetailsDir, fileName); // Save to 'train_details' folder
        const fileContent = `export const trainRouteData = ${JSON.stringify(
          formattedData,
          null,
          2
        )};`;

        fs.writeFileSync(filePath, fileContent);
        console.log(
          `Data for ${trainName} (${trainNumber}) saved to ${fileName}`
        );
      }
    } else {
      console.log(`Could not get train name and number from ${trainNameFull}`);
    }
  }
}

processTrainData();
