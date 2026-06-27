import { notFound } from "next/navigation";
import { FaTrain, FaExternalLinkAlt, FaTicketAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { FaQuestionCircle, FaRegCommentDots } from "react-icons/fa";
import type { Metadata } from "next";
import {
  createRouteUrlSlugFromRoute,
  createRouteUrlSlugFromStations,
  formatStationNameForUrl,
  parseRouteUrlSlug,
  routeUrlSlugToDataSlug,
} from "@/utils/stringutils";
import RouteScheduleTable from "../../components/RouteScheduleTable";
import { RouteSeoBody, RouteSeoIntro } from "../../components/RouteSeoContent";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildItemListSchema,
  buildRouteFaqItems,
  formatDisplayTime,
  getRouteSummary,
  parseTimeToMinutes,
  splitTrainsByCategory,
} from "../../utils/routeSeo";

export const runtime = "edge";

const BASE_URL = "https://cdn.trainjatri.com";

async function getRouteData(urlSlug: string) {
  const dataSlug = routeUrlSlugToDataSlug(urlSlug);

  try {
    const res = await fetch(`${BASE_URL}/${dataSlug}.json`, {
      next: { revalidate: 86400 }, // cache 1 day
    });

    if (!res.ok) return [];

    return await res.json();
  } catch (error) {
    return null;
  }
}

// Function to get reverse route data
async function getReverseRouteData(fromStation: string, toStation: string) {
  try {
    const reverseDataSlug = routeUrlSlugToDataSlug(
      createRouteUrlSlugFromStations(toStation, fromStation),
    );
    const res = await fetch(`${BASE_URL}/${reverseDataSlug}.json`, {
      next: { revalidate: 86400 }, // cache 1 day
    });

    if (!res.ok) return [];

    return await res.json();
  } catch (error) {
    return null;
  }
}

// Function to get popular destinations from a station
async function getPopularDestinations(stationName: string, limit: number = 8) {
  try {
    const res = await fetch(`${BASE_URL}/all-trips.json`, {
      next: { revalidate: 86400 }, // cache 1 day
    });

    if (!res.ok) return [];
    const data = await res.json();

    const destinations = data.routes
      .filter((element: any) => element.route.startsWith(`${stationName} - `))
      .map((filteredElement: any) => {
        const destination = filteredElement.route.split(" - ")[1];
        return {
          name: destination,
          slug: createRouteUrlSlugFromRoute(filteredElement.route),
        };
      })
      .slice(0, limit);

    return destinations;
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { name, slug } = await params;
  const stations = parseRouteUrlSlug(slug);
  if (!stations) {
    return { title: "Route Not Found | Train Jatri" };
  }

  const data = await getRouteData(slug);
  if (!data || data.length === 0) {
    return {
      title: `${stations.from} to ${stations.to} Train Schedule | No Data Available`,
      robots: { index: false, follow: true },
    };
  }

  const sorted = [...data].sort(
    (a, b) =>
      parseTimeToMinutes(a.departure_from_source) -
      parseTimeToMinutes(b.departure_from_source),
  );

  const totalTrains = sorted.length;
  const firstTrain = sorted[0];
  const lastTrain = sorted[sorted.length - 1];
  const currentYear = new Date().getFullYear();

  const title = `${stations.from} to ${stations.to} Train Schedule & Timetable ${currentYear} (${totalTrains} Trains) | Train Jatri`;

  const description = `${stations.from} to ${stations.to} train schedule ${currentYear} — ${totalTrains} daily trains on Bangladesh Railway. First train at ${formatDisplayTime(firstTrain.departure_from_source)}, last at ${formatDisplayTime(lastTrain.departure_from_source)}. View full timetable, departure times, journey duration, and book tickets online.`;

  const url = `https://www.trainjatri.com/stations/${name}/${slug}`;

  return {
    title,
    description,
    keywords: [
      `${stations.from} to ${stations.to} train schedule`,
      `${stations.from} to ${stations.to} train schedule ${currentYear}`,
      `${stations.from} to ${stations.to} timetable`,
      `${stations.from} to ${stations.to} train time`,
      `Bangladesh railway ${stations.from} to ${stations.to}`,
      `${stations.from} to ${stations.to} departure time`,
      `${stations.from} to ${stations.to} train ticket`,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Train Jatri",
      type: "website",
      images: [
        {
          url: "https://www.trainjatri.com/logo.png",
          width: 1200,
          height: 630,
          alt: `${stations.from} to ${stations.to} train schedule`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.trainjatri.com/logo.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function StationRoutePage({ params }: any) {
  const { name, slug } = await params;
  const stations = parseRouteUrlSlug(slug);

  if (!stations) notFound();

  const data = await getRouteData(slug);
  if (!data || data.length === 0) notFound();

  const sortedData = [...data].sort(
    (a, b) =>
      parseTimeToMinutes(a.departure_from_source) -
      parseTimeToMinutes(b.departure_from_source),
  );

  const reverseRouteData = await getReverseRouteData(
    stations.from,
    stations.to,
  );
  const fromDestinations = await getPopularDestinations(stations.from, 20);
  const toDestinations = await getPopularDestinations(stations.to, 20);

  const toStationSlug = formatStationNameForUrl(stations.to);
  const fromStationSlug = formatStationNameForUrl(stations.from);
  const reverseSlug = createRouteUrlSlugFromStations(
    stations.to,
    stations.from,
  );
  const currentYear = new Date().getFullYear();
  const routeSummary = getRouteSummary(sortedData)!;
  const { intercity, mail } = splitTrainsByCategory(sortedData);
  const faqItems = buildRouteFaqItems(stations.from, stations.to, sortedData);
  const faqSchema = buildFaqSchema(stations.from, stations.to, sortedData);
  const breadcrumbSchema = buildBreadcrumbSchema(
    stations.from,
    stations.to,
    fromStationSlug,
    slug,
  );
  const itemListSchema = buildItemListSchema(
    stations.from,
    stations.to,
    sortedData,
    `https://www.trainjatri.com/stations/${name}/${slug}`,
  );
  const seoProps = {
    from: stations.from,
    to: stations.to,
    sortedTrains: sortedData,
    routeSummary,
    reverseTrainCount: reverseRouteData?.length ?? 0,
    currentYear,
  };

  return (
    <div className="min-h-screen w-screen md:w-full py-8 md:px-4">
      <div className="w-full px-4 sm:px-6 lg:px-8 overflow-x-auto">
        {/* Header */}
        <div className="text-center mb-10 max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {stations.from} to {stations.to} Train Schedule &amp; Timetable{" "}
            {currentYear}
          </h1>

          <p className="text-lg text-gray-700 mb-4">
            Complete <strong>{stations.from} to {stations.to} train schedule</strong>{" "}
            for Bangladesh Railway {currentYear}. There{" "}
            {sortedData.length === 1 ? "is" : "are"}{" "}
            <strong>
              {sortedData.length} train{sortedData.length > 1 ? "s" : ""}
            </strong>{" "}
            on this route — first departure at{" "}
            <strong>
              {formatDisplayTime(routeSummary?.firstDeparture || "")}
            </strong>
            , last at{" "}
            <strong>
              {formatDisplayTime(routeSummary?.lastDeparture || "")}
            </strong>
            .
          </p>

          <p className="text-base text-gray-600">
            This is the official station-to-station timetable for{" "}
            <strong>
              {stations.from} → {stations.to}
            </strong>
            . Compare all trains, departure times, arrival times, journey
            duration, and operating days. For individual train stop details,
            use the &quot;View all stops&quot; link under each train name.
          </p>
        </div>

        {routeSummary && (
          <div className="max-w-4xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Trains", value: String(routeSummary.totalTrains) },
              {
                label: "First Departure",
                value: formatDisplayTime(routeSummary.firstDeparture),
              },
              {
                label: "Last Departure",
                value: formatDisplayTime(routeSummary.lastDeparture),
              },
              {
                label: "Fastest Journey",
                value: routeSummary.fastestDuration,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm"
              >
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {item.label}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <RouteSeoIntro {...seoProps} />

        <div className="max-w-4xl mx-auto mb-8">
          <a
            href="https://eticket.railway.gov.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full sm:w-auto sm:mx-auto px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            <FaTicketAlt />
            Book {stations.from} to {stations.to} Train Tickets Online
          </a>
        </div>

        <Image
          src="/logo.png"
          alt={`${stations.from} to ${stations.to} Bangladesh Railway Train Schedule`}
          width={400}
          height={200}
          className="mx-auto my-8"
        />

        <div
          id="train-schedule"
          className="overflow-x-auto flex flex-col gap-8 max-w-6xl mx-auto"
        >
          {intercity.length > 0 && (
            <RouteScheduleTable
              title={`${stations.from} to ${stations.to} Intercity Train Schedule`}
              from={stations.from}
              to={stations.to}
              trains={intercity}
            />
          )}

          {mail.length > 0 && (
            <RouteScheduleTable
              title={`${stations.from} to ${stations.to} Mail / Express Train Schedule`}
              from={stations.from}
              to={stations.to}
              trains={mail}
            />
          )}

          {intercity.length === 0 && mail.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No scheduled trains found for this route.
            </p>
          )}
        </div>

        {/* Schedule Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8 mb-8 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            {stations.from} to {stations.to} Schedule Overview
          </h2>
          <p className="text-gray-700 text-center mb-4">
            Trains on the {stations.from} to {stations.to} route include:{" "}
            <strong>{routeSummary?.trainNames}</strong>.
          </p>
          <div className="space-y-3">
            {sortedData.map((trip: any, index: number) => (
              <p key={index} className="text-gray-700 text-sm sm:text-base">
                <strong>{trip.train_name}</strong> departs {stations.from} at{" "}
                {formatDisplayTime(trip.departure_from_source)}, arrives{" "}
                {stations.to} at{" "}
                {formatDisplayTime(trip.arrival_at_destination)} (
                {trip.journey_duration || "N/A"}).
              </p>
            ))}
          </div>
        </div>

        <RouteSeoBody {...seoProps} />

        {/* FAQ Section */}
        <div id="faq" className="mt-14 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Frequently Asked Questions — {stations.from} to {stations.to} Train
            Schedule
          </h2>

          <div className="space-y-6 max-w-4xl mx-auto flex flex-col gap-4">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100"
              >
                <div className="flex items-start gap-3 mb-3">
                  <FaQuestionCircle className="text-indigo-600 mt-1 shrink-0 text-lg" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex items-start gap-3">
                  <FaRegCommentDots className="text-gray-500 mt-1 shrink-0 text-lg" />
                  <p className="text-gray-700 leading-7">{faq.answer}</p>
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
        {fromDestinations.length > 0 && (
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
              {fromDestinations.map((destination: any, index: number) => {
                const trainCount = destination.trainCount;

                return (
                  <Link
                    key={`from-${index}`}
                    href={`/stations/${fromStationSlug}/${destination.slug}`}
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
              })}
            </div>
          </section>
        )}

        {/* ================= Popular Routes From Station B ================= */}
        {toDestinations.length > 0 && (
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
              {toDestinations.map((destination: any, index: number) => {
                const trainCount = destination.trainCount;

                return (
                  <Link
                    key={`from-${index}`}
                    href={`/stations/${toStationSlug}/${destination.slug}`}
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
              })}
            </div>
          </section>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </div>
  );
}
