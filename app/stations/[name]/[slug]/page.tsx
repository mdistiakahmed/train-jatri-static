import { notFound } from "next/navigation";
import { FaTrain, FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { FaQuestionCircle, FaRegCommentDots } from "react-icons/fa";
import path from "path";
import fs from "fs";
import { Metadata } from "next";

const formatTrainNameForUrl = (trainName: string) => {
  if (!trainName) return "";
  return trainName.toLowerCase().replace(/\s+/g, "-");
};

async function getRouteData(slug: string) {
  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "trains-by-stations",
      `${slug}.json`,
    );

    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    return null;
  }
}

async function getReverseRouteData(fromStation: string, toStation: string) {
  const reverseSlug =
    `${toStation.toLowerCase().replace(/\s+/g, "-")}` +
    `-to-` +
    `${fromStation.toLowerCase().replace(/\s+/g, "-")}`;

  return getRouteData(reverseSlug);
}

async function getPopularDestinations(stationName: string, limit: number = 20) {
  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "trains-by-stations",
      "all-trips.json",
    );

    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    return data.routes
      .filter((route: any) => route.route.startsWith(`${stationName} - `))
      .map((route: any) => ({
        name: route.route.split(" - ")[1],
        slug: route.filename.replace(".json", ""),
      }))
      .slice(0, limit);
  } catch {
    return [];
  }
}

async function getTrainCountForRoute(fromStation: string, toStation: string) {
  try {
    const slug =
      `${fromStation.toLowerCase().replace(/\s+/g, "-")}` +
      `-to-` +
      `${toStation.toLowerCase().replace(/\s+/g, "-")}`;

    const filePath = path.join(
      process.cwd(),
      "data",
      "trains-by-stations",
      `${slug}.json`,
    );

    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    return data.length;
  } catch {
    return null;
  }
}

// Helper function to parse the slug into readable station names
function parseSlug(slug: string) {
  const parts = slug.split("-to-");
  if (parts.length !== 2) return null;

  const formatStationName = (str: string) =>
    str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return {
    from: formatStationName(parts[0]),
    to: formatStationName(parts[1]),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const stations = parseSlug(slug);

  if (!stations) {
    return {
      title: "Route Not Found | Train Jatri",
    };
  }

  const data = await getRouteData(slug);

  if (!data?.length) {
    return {
      title: `${stations.from} to ${stations.to} Train Schedule | Train Jatri`,
    };
  }

  return {
    title: `${stations.from} to ${stations.to} Train Schedule (${data.length} Daily Trains) | Train Jatri`,
    description: `Check Bangladesh Railway train schedule from ${stations.from} to ${stations.to}. View departure times, arrival times, train duration, train number and operating days.`,
  };
}

export async function generateStaticParams() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "trains-by-stations",
    "all-trips.json",
  );

  const fileContents = fs.readFileSync(filePath, "utf8");

  const data = JSON.parse(fileContents);

  return data.routes.map((route: any) => {
    const slug = route.filename.replace(".json", "");

    const fromStation = slug.split("-to-")[0];

    return {
      name: fromStation,
      slug,
    };
  });
}

const formatTime = (time: string) => {
  if (!time) return "N/A";
  return time.replace("BST", "").trim();
};

function formatOperatingDays(
  daysString: string,
  lang: "en" | "bn" = "en"
): string {
  if (!daysString) return "N/A";

  const weekDays = [
    { short: "Sat", en: "Saturday", bn: "শনিবার" },
    { short: "Sun", en: "Sunday", bn: "রবিবার" },
    { short: "Mon", en: "Monday", bn: "সোমবার" },
    { short: "Tue", en: "Tuesday", bn: "মঙ্গলবার" },
    { short: "Wed", en: "Wednesday", bn: "বুধবার" },
    { short: "Thu", en: "Thursday", bn: "বৃহস্পতিবার" },
    { short: "Fri", en: "Friday", bn: "শুক্রবার" },
  ];

  const operatingDays = daysString
    .split(",")
    .map((d) => d.trim());

  const offDays = weekDays.filter(
    (day) => !operatingDays.includes(day.short)
  );

  if (offDays.length === 0) {
    return lang === "bn"
      ? "সপ্তাহের ৭ দিনই চলাচল করে"
      : "Runs all 7 days a week";
  }

  return offDays
    .map((day) =>
      lang === "bn"
        ? `${day.en} (${day.bn})`
        : `${day.en} (${day.bn})`
    )
    .join(", ");
}

const parseTime = (timeStr: string) => {
  if(!timeStr) return 0;
  const time = timeStr.replace(" BST", "").trim();
  const [clock, period] = time.split(" ");
  let [hours, minutes] = clock.split(":").map(Number);

  if (period.toLowerCase() === "pm" && hours !== 12) {
    hours += 12;
  } else if (period.toLowerCase() === "am" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

export default async function StationRoutePage({ params }: any) {
  const { slug } = await params;
  const stations = parseSlug(slug);
  if (!stations) notFound();

  const [data, reverseRouteData, fromDestinations, toDestinations] =
    await Promise.all([
      getRouteData(slug),
      getReverseRouteData(stations.from, stations.to),
      getPopularDestinations(stations.from, 20),
      getPopularDestinations(stations.to, 20),
    ]);

  const sortedData = data
    ? [...data].sort(
        (a, b) =>
          parseTime(a.arrival_at_source) - parseTime(b.arrival_at_source),
      )
    : [];

  if (!data) return notFound();

  const toStationSlug = stations.to.toLowerCase().replace(/\s+/g, "-");
  const reverseSlug = `${toStationSlug}-to-${stations.from.toLowerCase().replace(/\s+/g, "-")}`;

  const fromDestinationsWithCounts = await Promise.all(
    fromDestinations.map(async (destination: any) => ({
      ...destination,
      trainCount: await getTrainCountForRoute(stations.from, destination.name),
    })),
  );

  const toDestinationsWithCounts = await Promise.all(
    toDestinations.map(async (destination: any) => ({
      ...destination,
      trainCount: await getTrainCountForRoute(stations.to, destination.name),
    })),
  );

  return (
    <div className="min-h-screen w-screen md:w-full py-8 md:px-4">
      <div className="w-full px-4 sm:px-6 lg:px-8 overflow-x-auto">
        {/* Header */}
        <div className="text-center mb-10 max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {stations.from} to {stations.to} Train Schedule, Timetable &
            Departure Times
          </h1>

          <p className="text-lg text-gray-700 mb-4">
            There {data.length === 1 ? "is" : "are"}{" "}
            <strong>
              {sortedData.length} daily train{sortedData.length > 1 ? "s" : ""}
            </strong>{" "}
            operating from <strong>{stations.from}</strong> to{" "}
            <strong>{stations.to}</strong> via Bangladesh Railway. The first
            train departs at{" "}
            <strong>{formatTime(sortedData[0].departure_from_source)}</strong>{" "}
            and the last service leaves at{" "}
            <strong>
              {formatTime(
                sortedData[sortedData.length - 1].departure_from_source,
              )}
            </strong>
            .
          </p>

          <p className="text-base text-gray-600">
            On this page, you can check updated departure times, arrival times,
            journey duration, train numbers, operating days, and available train
            types for the {stations.from} - {stations.to} railway route. Compare
            services and plan your train journey in Bangladesh efficiently.
          </p>
        </div>

        <Image
          src="/logo.png"
          alt="Bangladesh Railway Train Journey"
          width={400}
          height={200}
          className="mx-auto my-8"
        />

        <div className="overflow-x-auto flex flex-col gap-8">
          {/* Schedule Table */}
          <div className="flex flex-col overflow-x-auto">
            <div>
              <div className="bg-red-600 text-white px-6 py-3">
                <h2 className="text-xl font-semibold">
                  {stations.from} to {stations.to} Schedule
                </h2>
              </div>
              <div className="w-full overflow-x-auto max-w-full">
                {sortedData && sortedData.length > 0 ? (
                  <table className="min-w-max w-full bg-white rounded-lg shadow-md">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                          Train Name
                        </th>
                        <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                          Departure From {stations.from}
                        </th>
                        <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                          Arrival at {stations.to}
                        </th>

                        <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                          Off Day
                        </th>

                        <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                          Duration
                        </th>

                        {/* <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                          Live Track
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedData.map((trip: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="text-center">

                            <a
                              href={`/trains/${formatTrainNameForUrl(trip.train_name)}`}
                              className="text-blue-600 underline inline-flex items-center space-x-3 transition-colors"
                            >
                              <span>{trip.train_name}</span>
                              <FaExternalLinkAlt className="w-3 h-3" />
                            </a>
                            
                            </td>

                          <td className="text-center">
                            {formatTime(trip.departure_from_source)}
                          </td>

                          <td className="text-center">
                            {formatTime(trip.arrival_at_destination)}
                          </td>

                          <td className="text-center">
                            {formatOperatingDays(trip.operating_days)}
                          </td>

                          <td className="text-center">
                            {trip.journey_duration || "N/A"}
                          </td>

                          {/* <td className="font-medium">Live Track</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No scheduled trains found for this route.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8 mb-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Schedule Overview
          </h2>
          <div className="space-y-4">
            {sortedData.map((trip: any, index: number) => (
              <p key={index} className="text-gray-700">
                The {trip.train_name} departs from{" "}
                {stations.from} at {formatTime(trip.departure_from_source)} and
                arrives in {stations.to} at{" "}
                {formatTime(trip.arrival_at_destination)}.
              </p>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-14 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Frequently Asked Questions About {stations.from} to {stations.to}{" "}
            Trains
          </h2>

          <div className="space-y-6 max-w-4xl mx-auto flex flex-col gap-4">
            {/* Total Trains Question */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <FaQuestionCircle className="text-indigo-600 mt-1 shrink-0 text-lg" />
                <h3 className="text-lg font-semibold text-gray-800">
                  How many trains run daily from {stations.from} to{" "}
                  {stations.to}?
                </h3>
              </div>
              <div className="flex items-start gap-3">
                <FaRegCommentDots className="text-gray-500 mt-1 shrink-0 text-lg" />
                <p className="text-gray-700 leading-7">
                  There are {sortedData.length} daily trains operating from{" "}
                  {stations.from} to {stations.to}. Departure times start at{" "}
                  {formatTime(sortedData[0].departure_from_source)}
                  and continue throughout the day until the last train at{" "}
                  {formatTime(
                    sortedData[sortedData.length - 1].departure_from_source,
                  )}
                  .
                </p>
              </div>
            </div>

            {/* Duration Question */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <FaQuestionCircle className="text-indigo-600 mt-1 shrink-0 text-lg" />
                <h3 className="text-lg font-semibold text-gray-800">
                  How long does train take from {stations.from} to {stations.to}
                  ?
                </h3>
              </div>
              <div className="flex items-start gap-3">
                <FaRegCommentDots className="text-gray-500 mt-1 shrink-0 text-lg" />
                <p className="text-gray-700 leading-7">
                  The average travel time is{" "}
                  {sortedData[0].journey_duration || "N/A"}
                </p>
              </div>
            </div>

            {/* First Train Question */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <FaQuestionCircle className="text-indigo-600 mt-1 shrink-0 text-lg" />
                <h3 className="text-lg font-semibold text-gray-800">
                  What is the first train from {stations.from} to {stations.to}?
                </h3>
              </div>
              <div className="flex items-start gap-3">
                <FaRegCommentDots className="text-gray-500 mt-1 shrink-0 text-lg" />
                <p className="text-gray-700 leading-7">
                  The earliest train departs from {stations.from} at{" "}
                  {formatTime(sortedData[0].departure_from_source)} {" "}
                  and arrives in {stations.to} at{" "}
                  {formatTime(sortedData[0].arrival_at_destination)}.
                </p>
              </div>
            </div>

            {/* Last Train Question */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <FaQuestionCircle className="text-indigo-600 mt-1 shrink-0 text-lg" />
                <h3 className="text-lg font-semibold text-gray-800">
                  What is the last train from {stations.from} to {stations.to}?
                </h3>
              </div>
              <div className="flex items-start gap-3">
                <FaRegCommentDots className="text-gray-500 mt-1 shrink-0 text-lg" />
                <p className="text-gray-700 leading-7">
                  The final daily departure leaves {stations.from} at{" "}
                  {formatTime(
                    sortedData[sortedData.length - 1].departure_from_source,
                  )} {" "}
                  and reaches {stations.to} at{" "}
                  {formatTime(
                    sortedData[sortedData.length - 1].arrival_at_destination,
                  )}
                  .
                </p>
              </div>
            </div>

            {/* Operating Days Question */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <FaQuestionCircle className="text-indigo-600 mt-1 shrink-0 text-lg" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Do trains from {stations.from} to {stations.to} run every day?
                </h3>
              </div>
              <div className="flex items-start gap-3">
                <FaRegCommentDots className="text-gray-500 mt-1 shrink-0 text-lg" />
                <p className="text-gray-700 leading-7">
                  Most trains on this route operate daily, but some services may
                  run only on selected days. Please check the "Off Day"
                  column in the timetable above for the most accurate and
                  updated schedule information.
                </p>
              </div>
            </div>



            {/* Dynamic Train-Specific FAQs */}
            {sortedData.slice(0, 2).map((trip: any, index: number) => (
              <div
                key={`train-faq-${index}`}
                className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100"
              >
                <div className="flex items-start gap-3 mb-3">
                  <FaQuestionCircle className="text-indigo-600 mt-1 shrink-0 text-lg" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    What time does Train {trip.train_name} depart from{" "}
                    {stations.from}?
                  </h3>
                </div>
                <div className="flex items-start gap-3">
                  <FaRegCommentDots className="text-gray-500 mt-1 shrink-0 text-lg" />
                  <p className="text-gray-700 leading-7">
                    Train {trip.train_name} departs from {stations.from} at{" "}
                    {formatTime(trip.departure_from_source)} and arrives in{" "}
                    {stations.to} at {formatTime(trip.arrival_at_destination)}.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= Return Journey ================= */}
        {reverseRouteData && (
          <section className="mt-16 max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <FaTrain className="text-blue-600 text-xl mt-1 shrink-0" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Return Train: {stations.to} → {stations.from}
                </h2>
              </div>

              <p className="text-gray-700 leading-relaxed mb-5">
                Planning your return trip? You can also check the complete train
                timetable for the journey from <strong>{stations.to}</strong>{" "}
                back to <strong>{stations.from}</strong>. View updated departure
                times, arrival schedules, train numbers and operating days for
                this return route in Bangladesh.
              </p>

              <Link
                href={`/stations/${toStationSlug}/${reverseSlug}`}
                prefetch={false}
                className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                View {stations.to} to {stations.from} Train Schedule
                <FaExternalLinkAlt className="text-sm" />
              </Link>
            </div>
          </section>
        )}

        {/* ================= Popular Routes From Station A ================= */}
        {fromDestinationsWithCounts.length > 0 && (
          <section className="mt-16 max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Popular Train Routes from {stations.from}
              </h2>
              <p className="text-gray-600 mt-2">
                Explore frequently searched train schedules departing from{" "}
                <strong>{stations.from}</strong>. These railway routes connect
                major destinations across Bangladesh.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fromDestinationsWithCounts.map(
                (destination: any, index: number) => {
                  const trainCount = destination.trainCount;

                  return (
                    <Link
                      key={`from-${index}`}
                      href={`/stations/${stations.from.toLowerCase().replace(/\s+/g, "-")}/${destination.slug}`}
                      prefetch={false}
                      className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col items-center gap-3 mb-3">
                        <div className="flex gap-3 items-center justify-center">
                          <FaTrain className="text-red-500 text-base" />
                          <span className="text-base font-semibold text-gray-900">
                            {stations.from} → {destination.name}
                          </span>
                        </div>
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                          {trainCount
                            ? `${trainCount} daily train${trainCount > 1 ? "s" : ""} available`
                            : "Train schedules available"}
                        </span>
                      </div>

                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                          View Complete Train Schedule
                        </p>
                        <p className="text-xs text-gray-500">
                          {trainCount} daily departures • Updated timetable
                        </p>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          </section>
        )}

        {/* ================= Popular Routes From Station B ================= */}
        {toDestinationsWithCounts.length > 0 && (
          <section className="mt-16 max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Popular Train Routes from {stations.to}
              </h2>
              <p className="text-gray-600 mt-2">
                Discover additional train connections departing from{" "}
                <strong>{stations.to}</strong>. Browse popular railway
                destinations and plan your next journey across Bangladesh.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {toDestinationsWithCounts.map(
                (destination: any, index: number) => {
                  const trainCount = destination.trainCount;

                  return (
                    <Link
                      key={`from-${index}`}
                      href={`/stations/${stations.to.toLowerCase().replace(/\s+/g, "-")}/${destination.slug}`}
                      prefetch={false}
                      className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col items-center gap-3 mb-3">
                        <div className="flex gap-3 items-center justify-center">
                          <FaTrain className="text-red-500 text-base" />
                          <span className="text-base font-semibold text-gray-900">
                            {stations.to} → {destination.name}
                          </span>
                        </div>
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                          {trainCount
                            ? `${trainCount} daily train${trainCount > 1 ? "s" : ""} available`
                            : "Train schedules available"}
                        </span>
                      </div>

                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                          View Complete Train Schedule
                        </p>
                        <p className="text-xs text-gray-500">
                          {trainCount} daily departures • Updated timetable
                        </p>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
