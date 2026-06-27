import Link from "next/link";
import {
  FaClock,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaTrain,
} from "react-icons/fa";
import {
  TICKET_CLASSES,
  formatDisplayTime,
  getMainCorridorLinks,
  getPopularRouteHref,
  type RouteTrip,
} from "../utils/routeSeo";
import { formatStationNameForUrl } from "@/utils/stringutils";

type RouteSummary = NonNullable<
  ReturnType<typeof import("../utils/routeSeo").getRouteSummary>
>;

const TOC_ITEMS = [
  { id: "route-overview", label: "Route Overview" },
  { id: "train-schedule", label: "Train Schedule" },
  { id: "best-trains", label: "Best Trains" },
  { id: "ticket-classes", label: "Ticket Classes" },
  { id: "booking-guide", label: "Online Booking" },
  { id: "travel-tips", label: "Travel Tips" },
  { id: "station-info", label: "Station Info" },
  { id: "faq", label: "FAQ" },
];

type RouteSeoProps = {
  from: string;
  to: string;
  sortedTrains: RouteTrip[];
  routeSummary: RouteSummary;
  reverseTrainCount?: number;
  currentYear: number;
};

export function RouteSeoIntro({
  from,
  to,
  sortedTrains,
  routeSummary,
  reverseTrainCount,
  currentYear,
}: RouteSeoProps) {
  const mainCorridors = getMainCorridorLinks(sortedTrains);
  const { periodCounts } = routeSummary;

  return (
    <>
      <nav
        aria-label="Page contents"
        className="max-w-4xl mx-auto mb-10 bg-gray-50 border border-gray-200 rounded-xl p-5"
      >
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          On This Page
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          {TOC_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-blue-700 hover:text-red-600 hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="route-overview" className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          About the {from} to {to} Train Route
        </h2>
        <div className="text-gray-700 leading-relaxed space-y-4">
          <p>
            Traveling by train from <strong>{from}</strong> to{" "}
            <strong>{to}</strong> is one of the most convenient ways to journey
            across Bangladesh. Bangladesh Railway operates{" "}
            <strong>{routeSummary.totalTrains} direct train</strong>
            {routeSummary.totalTrains > 1 ? "s" : ""} on this corridor in{" "}
            {currentYear}, including{" "}
            {routeSummary.intercityCount > 0 && (
              <>
                <strong>{routeSummary.intercityCount} intercity</strong>
                {routeSummary.mailCount > 0 ? " and " : " "}
              </>
            )}
            {routeSummary.mailCount > 0 && (
              <strong>{routeSummary.mailCount} mail/express</strong>
            )}{" "}
            service{routeSummary.totalTrains > 1 ? "s" : ""}. Journey times
            range from <strong>{routeSummary.fastestDuration}</strong> to{" "}
            <strong>{routeSummary.slowestDuration}</strong>, depending on the
            train you choose.
          </p>

          <p>
            The <strong>{from} to {to} train schedule</strong> covers departures
            throughout the day
            {(periodCounts.morning > 0 ||
              periodCounts.afternoon > 0 ||
              periodCounts.evening > 0 ||
              periodCounts.night > 0) &&
              " — "}
            {periodCounts.morning > 0 && (
              <>{periodCounts.morning} in the morning</>
            )}
            {periodCounts.afternoon > 0 && (
              <>
                {periodCounts.morning > 0 ? ", " : ""}
                {periodCounts.afternoon} in the afternoon
              </>
            )}
            {periodCounts.evening > 0 && (
              <>
                {periodCounts.morning + periodCounts.afternoon > 0 ? ", " : ""}
                {periodCounts.evening} in the evening
              </>
            )}
            {periodCounts.night > 0 && (
              <>
                {periodCounts.morning +
                  periodCounts.afternoon +
                  periodCounts.evening >
                0
                  ? ", and "
                  : ""}
                {periodCounts.night} at night
              </>
            )}
            . The first train leaves {from} at{" "}
            <strong>{formatDisplayTime(routeSummary.firstDeparture)}</strong> and
            the last departure is at{" "}
            <strong>{formatDisplayTime(routeSummary.lastDeparture)}</strong>.
          </p>

          {mainCorridors.length > 0 && (
            <p>
              Some trains on this route also run on longer corridors such as{" "}
              {mainCorridors.map((corridor, i) => (
                <span key={`${corridor.from}-${corridor.to}`}>
                  {i > 0 && (i === mainCorridors.length - 1 ? ", and " : ", ")}
                  <Link
                    href={getPopularRouteHref(corridor.from, corridor.to)}
                    className="text-blue-700 hover:underline font-medium"
                  >
                    {corridor.from} to {corridor.to}
                  </Link>
                </span>
              ))}
              . This page shows the specific timetable for the{" "}
              <strong>
                {from} → {to}
              </strong>{" "}
              segment only.
            </p>
          )}

          {reverseTrainCount !== undefined && reverseTrainCount > 0 && (
            <p>
              For your return journey,{" "}
              <strong>{reverseTrainCount} train</strong>
              {reverseTrainCount > 1 ? "s" : ""} also operate from {to} back to{" "}
              {from}. See the return schedule section below.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

export function RouteSeoBody({
  from,
  to,
  routeSummary,
  currentYear,
}: RouteSeoProps) {
  const fromSlug = formatStationNameForUrl(from);
  const toSlug = formatStationNameForUrl(to);

  return (
    <>
      <section
        id="best-trains"
        className="max-w-4xl mx-auto mb-12 bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FaTrain className="text-red-500" />
          Best Trains from {from} to {to}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-green-700 uppercase mb-1">
              Fastest Train
            </p>
            <p className="font-bold text-gray-900">
              {routeSummary.fastestTrain.train_name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {routeSummary.fastestTrain.journey_duration} journey • Departs{" "}
              {formatDisplayTime(routeSummary.fastestTrain.departure_from_source)}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-700 uppercase mb-1">
              Earliest Departure
            </p>
            <p className="font-bold text-gray-900">
              {routeSummary.earliestTrain.train_name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Leaves {from} at{" "}
              {formatDisplayTime(routeSummary.earliestTrain.departure_from_source)}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-purple-700 uppercase mb-1">
              Latest Departure
            </p>
            <p className="font-bold text-gray-900">
              {routeSummary.latestTrain.train_name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Leaves {from} at{" "}
              {formatDisplayTime(routeSummary.latestTrain.departure_from_source)}
            </p>
          </div>
        </div>
      </section>

      <section id="ticket-classes" className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {from} to {to} Train Ticket Classes
        </h2>
        <p className="text-gray-700 mb-6">
          Bangladesh Railway offers several seat categories on the {from} to {to}{" "}
          route. Ticket prices vary by train, class, and route distance. Book
          through the official portal for current fares.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left font-semibold">Seat Class</th>
                <th className="py-3 px-4 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {TICKET_CLASSES.map((ticketClass) => (
                <tr key={ticketClass.name} className="border-t border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                    {ticketClass.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {ticketClass.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        id="booking-guide"
        className="max-w-4xl mx-auto mb-12 bg-green-50 border border-green-100 rounded-xl p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaTicketAlt className="text-green-600" />
          How to Book {from} to {to} Train Tickets Online
        </h2>
        <ol className="space-y-3 text-gray-700 list-decimal list-inside">
          <li>
            Check the <strong>{from} to {to} train schedule</strong> table above
            and note your preferred train and departure time.
          </li>
          <li>
            Visit the official Bangladesh Railway e-ticket website at{" "}
            <a
              href="https://eticket.railway.gov.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 font-medium hover:underline"
            >
              eticket.railway.gov.bd
            </a>
            .
          </li>
          <li>
            Select <strong>{from}</strong> as origin and <strong>{to}</strong> as
            destination, then choose your travel date.
          </li>
          <li>
            Pick your train from the list and select a seat class (Shuvon, Snigdha,
            AC, etc.).
          </li>
          <li>Complete payment to receive your e-ticket via SMS or email.</li>
        </ol>
        <a
          href="https://eticket.railway.gov.bd/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
        >
          <FaTicketAlt />
          Book Tickets on eticket.railway.gov.bd
          <FaExternalLinkAlt className="text-xs" />
        </a>
      </section>

      <section id="travel-tips" className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaInfoCircle className="text-indigo-600" />
          Travel Tips for {from} to {to} Train Journey
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex gap-2">
            <FaClock className="text-red-500 mt-1 shrink-0" />
            <span>
              Arrive at <strong>{from}</strong> station at least 30 minutes before
              departure. Trains on this route include{" "}
              <strong>{routeSummary.trainNames}</strong>.
            </span>
          </li>
          <li className="flex gap-2">
            <FaTicketAlt className="text-red-500 mt-1 shrink-0" />
            <span>
              Book tickets in advance during Eid, Puja, and other holidays — seats
              on the {from} to {to} route fill up quickly.
            </span>
          </li>
          <li className="flex gap-2">
            <FaTrain className="text-red-500 mt-1 shrink-0" />
            <span>
              Check the &quot;Off Day&quot; column in the schedule — not every
              train runs daily.
              {routeSummary.intercityCount > 0 && " Intercity trains"}
              {routeSummary.intercityCount > 0 &&
                routeSummary.mailCount > 0 &&
                " and "}
              {routeSummary.mailCount > 0 && "mail/express services"} may have
              different operating days.
            </span>
          </li>
          <li className="flex gap-2">
            <FaInfoCircle className="text-red-500 mt-1 shrink-0" />
            <span>
              For live train status, use Bangladesh Railway SMS tracking: type{" "}
              <strong>TR [train number]</strong> and send to <strong>16318</strong>.
            </span>
          </li>
        </ul>
      </section>

      <section className="max-w-4xl mx-auto mb-12 bg-amber-50 border border-amber-100 rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {from} থেকে {to} ট্রেনের সময়সূচী ({currentYear})
        </h2>
        <p className="text-gray-800 leading-relaxed">
          <strong>{from}</strong> থেকে <strong>{to}</strong> রুটে বাংলাদেশ রেলওয়ের{" "}
          {routeSummary.totalTrains}টি ট্রেন চলাচল করে। প্রথম ট্রেনের ছাড়ার সময়{" "}
          <strong>{formatDisplayTime(routeSummary.firstDeparture)}</strong> এবং
          শেষ ট্রেনের ছাড়ার সময়{" "}
          <strong>{formatDisplayTime(routeSummary.lastDeparture)}</strong>। সম্পূর্ণ
          সময়সূচী, যাত্রার সময়কাল এবং টিকিট বুকিংয়ের তথ্য এই পেজে দেওয়া আছে।
          অনলাইনে টিকিট কিনতে{" "}
          <a
            href="https://eticket.railway.gov.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-700 font-medium hover:underline"
          >
            eticket.railway.gov.bd
          </a>{" "}
          ভিজিট করুন।
        </p>
      </section>

      <section
        id="station-info"
        className="max-w-4xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />
            {from} Railway Station
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Departure station for the {from} to {to} route. Browse all train
            schedules and destinations from {from}.
          </p>
          <Link
            href={`/stations/${fromSlug}`}
            className="text-blue-700 text-sm font-medium hover:underline inline-flex items-center gap-1"
          >
            View all trains from {from}
            <FaExternalLinkAlt className="w-3 h-3" />
          </Link>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />
            {to} Railway Station
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Arrival station for trains traveling from {from} to {to}. Find return
            schedules and other connections from {to}.
          </p>
          <Link
            href={`/stations/${toSlug}`}
            className="text-blue-700 text-sm font-medium hover:underline inline-flex items-center gap-1"
          >
            View all trains from {to}
            <FaExternalLinkAlt className="w-3 h-3" />
          </Link>
        </div>
      </section>
    </>
  );
}
