const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

const holidayInfo = [
  { trianNo: 816, trainName: "PARJOTAK EXPRESS", offDay: "Wednesday" },
  { trianNo: 788, trainName: "SONAR BANGLA EXPRESS", offDay: "Wednesday" },
  { trianNo: 704, trainName: "MAHANAGAR PROVATI", offDay: "None" },
  { trianNo: 802, trainName: "CHATTALA EXPRESS", offDay: "Friday" },
  { trianNo: 702, trainName: "SUBORNO EXPRESS", offDay: "Monday" },
  { trianNo: 722, trainName: "MOHANAGAR EXPRESS", offDay: "Sunday" },
  { trianNo: 814, trainName: "COXS BAZAR EXPRESS", offDay: "Monday" },
  { trianNo: 742, trainName: "TURNA", offDay: "None" },
];

async function scrapeTrainData(startStation, endStation) {
  const today = moment();
  const tomorrow = today.clone().add(1, "days");
  const nextDay = today.clone().add(2, "days");

  const tomorrowDate = tomorrow.format("DD-MMM-YYYY");
  const nextDayDate = nextDay.format("DD-MMM-YYYY");

  const tomorrowUrl = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${startStation}&to_city=${endStation}&date_of_journey=${tomorrowDate}&seat_class=S_CHAIR`;
  const nextDayUrl = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${startStation}&to_city=${endStation}&date_of_journey=${nextDayDate}&seat_class=S_CHAIR`;

  try {
    const [tomorrowResponse, nextDayResponse] = await Promise.all([
      axios.get(tomorrowUrl),
      axios.get(nextDayUrl),
    ]);

    const tomorrowData = tomorrowResponse.data.data.trains || [];
    const nextDayData = nextDayResponse.data.data.trains || [];

    const tomorrowDataProcessed = tomorrowData.map((train) => ({
      trainNo: parseInt(train.trip_number.match(/\((\d+)\)/)?.[1] || 0),
      trainName: train.trip_number.replace(/\s*\(\d+\)\s*$/, "").trim(),
      departs: train.departure_date_time.split(",")[1].trim(),
      arrives: train.arrival_date_time.split(",")[1].trim(),
      duration: train.travel_time,
    }));

    const nextDayDataProcessed = nextDayData.map((train) => ({
      trainNo: parseInt(train.trip_number.match(/\((\d+)\)/)?.[1] || 0),
      trainName: train.trip_number.replace(/\s*\(\d+\)\s*$/, "").trim(),
      departs: train.departure_date_time.split(",")[1].trim(),
      arrives: train.arrival_date_time.split(",")[1].trim(),
      duration: train.travel_time,
    }));

    const consolidatedData = [
      ...tomorrowDataProcessed,
      ...nextDayDataProcessed,
    ];

    // Remove duplicates based on trainNo
    const uniqueTrains = [];
    const seenTrainNos = new Set();

    for (const train of consolidatedData) {
      if (!seenTrainNos.has(train.trainNo)) {
        uniqueTrains.push(train);
        seenTrainNos.add(train.trainNo);
      }
    }

    return uniqueTrains;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

async function processAndDisplayData(startStation, endStation) {
  const trainData = await scrapeTrainData(startStation, endStation);

  if (trainData.length === 0) {
    console.log("No train data found.");
    return;
  }

  const todayDate = moment().format("DD MMM, YYYY");

  const resultData = {
    category: "Intercity",
    lastUpdated: todayDate,
    schedules: trainData.map((train) => {
      const trainHoliday = holidayInfo.find(
        (holiday) => holiday.trianNo === train.trainNo
      );
      if (!trainHoliday) {
        throw new Error(
          `Holiday information not found for train number ${train.trainName}`
        );
      }

      return {
        trainNo: train.trainNo,
        trainName: train.trainName,
        departs: train.departs,
        arrives: train.arrives,
        duration: train.duration,
        offday: trainHoliday.offDay,
      };
    }),
  };

  const resultTsContent = `export const trainScheduleData = ${JSON.stringify(
    [resultData],
    null,
    2
  )};`;

  const filePath = path.join(__dirname, "result.ts");

  fs.writeFileSync(filePath, resultTsContent);

  console.log("Data written to result.ts");
}

// Example usage:
const startStation = "Chattogram";
const endStation = "Dhaka";

processAndDisplayData(startStation, endStation);
