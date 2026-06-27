import { formatStationNameForUrl } from "@/utils/stringutils";

export type RouteTrip = {
  train_name: string;
  train_number?: number;
  departure_from_source: string;
  arrival_at_destination: string;
  arrival_at_source?: string;
  journey_duration?: string;
  operating_days?: string;
  source_city?: string;
  destination_city?: string;
  main_source_city?: string;
  main_destination_city?: string;
};

export function classifyTrain(
  trainName: string,
  trainNumber?: number,
): "intercity" | "mail" {
  const name = trainName.toUpperCase();

  if (
    name.includes("MAIL") ||
    name.includes("COMMUTER") ||
    name.includes("SHUTTLE") ||
    (trainNumber !== undefined && trainNumber < 200)
  ) {
    return "mail";
  }

  return "intercity";
}

export function splitTrainsByCategory(trains: RouteTrip[]) {
  const intercity: RouteTrip[] = [];
  const mail: RouteTrip[] = [];

  for (const train of trains) {
    if (classifyTrain(train.train_name, train.train_number) === "mail") {
      mail.push(train);
    } else {
      intercity.push(train);
    }
  }

  return { intercity, mail };
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const time = timeStr.replace(" BST", "").trim();
  const [clock, period] = time.split(" ");
  let [hours, minutes] = clock.split(":").map(Number);

  if (period?.trim().toLowerCase() === "pm" && hours !== 12) {
    hours += 12;
  } else if (period?.trim().toLowerCase() === "am" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

export function formatDisplayTime(time: string): string {
  if (!time) return "N/A";
  return time.replace("BST", "").trim();
}

export function getRouteSummary(trains: RouteTrip[]) {
  if (!trains.length) {
    return null;
  }

  const sorted = [...trains].sort(
    (a, b) =>
      parseTimeToMinutes(a.departure_from_source) -
      parseTimeToMinutes(b.departure_from_source),
  );

  const durations = sorted
    .map((t) => t.journey_duration)
    .filter(Boolean) as string[];

  const { intercity, mail } = splitTrainsByCategory(sorted);
  const periodCounts = getDeparturePeriodCounts(sorted);
  const durationRange = getDurationRange(sorted);

  return {
    totalTrains: sorted.length,
    firstDeparture: sorted[0].departure_from_source,
    lastDeparture: sorted[sorted.length - 1].departure_from_source,
    fastestDuration: durationRange.fastest,
    slowestDuration: durationRange.slowest,
    trainNames: sorted.map((t) => t.train_name).join(", "),
    intercityCount: intercity.length,
    mailCount: mail.length,
    periodCounts,
    fastestTrain: sorted.reduce((best, train) => {
      if (!train.journey_duration) return best;
      if (!best?.journey_duration) return train;
      const bestMins = parseDurationToMinutes(best.journey_duration);
      const trainMins = parseDurationToMinutes(train.journey_duration);
      return trainMins < bestMins ? train : best;
    }, sorted[0]),
    earliestTrain: sorted[0],
    latestTrain: sorted[sorted.length - 1],
  };
}

export function parseDurationToMinutes(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length !== 2 || parts.some(Number.isNaN)) return Number.MAX_SAFE_INTEGER;
  return parts[0] * 60 + parts[1];
}

export function getDurationRange(trains: RouteTrip[]) {
  const withDuration = trains.filter((t) => t.journey_duration);
  if (!withDuration.length) {
    return { fastest: "N/A", slowest: "N/A" };
  }

  const sorted = [...withDuration].sort(
    (a, b) =>
      parseDurationToMinutes(a.journey_duration!) -
      parseDurationToMinutes(b.journey_duration!),
  );

  return {
    fastest: sorted[0].journey_duration!,
    slowest: sorted[sorted.length - 1].journey_duration!,
  };
}

export function getDeparturePeriodCounts(trains: RouteTrip[]) {
  let morning = 0;
  let afternoon = 0;
  let evening = 0;
  let night = 0;

  for (const train of trains) {
    const minutes = parseTimeToMinutes(train.departure_from_source);
    if (minutes >= 300 && minutes < 720) morning += 1;
    else if (minutes >= 720 && minutes < 1020) afternoon += 1;
    else if (minutes >= 1020 && minutes < 1260) evening += 1;
    else night += 1;
  }

  return { morning, afternoon, evening, night };
}

export function getMainCorridorLinks(trains: RouteTrip[]) {
  const corridors = new Map<string, { from: string; to: string }>();

  for (const train of trains) {
    const from = train.main_source_city || train.source_city;
    const to = train.main_destination_city || train.destination_city;
    if (!from || !to) continue;
    if (from === train.source_city && to === train.destination_city) continue;

    const key = `${from}-${to}`;
    if (!corridors.has(key)) {
      corridors.set(key, { from, to });
    }
  }

  return Array.from(corridors.values()).slice(0, 4);
}

export const TICKET_CLASSES = [
  {
    name: "Shuvon",
    description: "Economy non-AC seating — the most affordable option on Bangladesh Railway.",
  },
  {
    name: "Shuvon Chair",
    description: "Reserved chair car seating with better comfort than general Shuvon.",
  },
  {
    name: "First Seat",
    description: "First-class reserved seating with more space and comfort.",
  },
  {
    name: "Snigdha",
    description: "Air-conditioned chair car — popular for medium-distance routes.",
  },
  {
    name: "AC Seat",
    description: "Air-conditioned cabin seating for a cooler, comfortable journey.",
  },
  {
    name: "AC Birth",
    description: "Air-conditioned sleeper berths for longer overnight journeys.",
  },
];

export function buildRouteFaqItems(
  from: string,
  to: string,
  sortedTrains: RouteTrip[],
) {
  if (!sortedTrains.length) return [];

  const first = sortedTrains[0];
  const last = sortedTrains[sortedTrains.length - 1];

  return [
    {
      question: `How many trains run daily from ${from} to ${to}?`,
      answer: `There are ${sortedTrains.length} trains operating from ${from} to ${to} on Bangladesh Railway. Departures start at ${formatDisplayTime(first.departure_from_source)} and the last train leaves at ${formatDisplayTime(last.departure_from_source)}.`,
    },
    {
      question: `What is the ${from} to ${to} train schedule?`,
      answer: `The ${from} to ${to} train schedule includes ${sortedTrains.map((t) => `${t.train_name} (${formatDisplayTime(t.departure_from_source)} - ${formatDisplayTime(t.arrival_at_destination)})`).join(", ")}.`,
    },
    {
      question: `How long does the train take from ${from} to ${to}?`,
      answer: `Journey time from ${from} to ${to} varies by train. The fastest service takes about ${first.journey_duration || "N/A"}. Check the timetable above for each train's duration.`,
    },
    {
      question: `What is the first train from ${from} to ${to}?`,
      answer: `The earliest departure from ${from} to ${to} is ${first.train_name} at ${formatDisplayTime(first.departure_from_source)}, arriving in ${to} at ${formatDisplayTime(first.arrival_at_destination)}.`,
    },
    {
      question: `What is the last train from ${from} to ${to}?`,
      answer: `The last daily train from ${from} to ${to} is ${last.train_name}, departing at ${formatDisplayTime(last.departure_from_source)} and arriving at ${formatDisplayTime(last.arrival_at_destination)}.`,
    },
    {
      question: `How can I book ${from} to ${to} train tickets online?`,
      answer: `You can book Bangladesh Railway tickets online through the official e-ticket portal at eticket.railway.gov.bd. Check the schedule on this page first, then select your train and travel date on the booking site.`,
    },
    {
      question: `What is the fastest train from ${from} to ${to}?`,
      answer: sortedTrains.length
        ? (() => {
            const fastest = [...sortedTrains].sort(
              (a, b) =>
                parseDurationToMinutes(a.journey_duration || "99:99") -
                parseDurationToMinutes(b.journey_duration || "99:99"),
            )[0];
            return `The fastest train from ${from} to ${to} is ${fastest.train_name}, with a journey time of about ${fastest.journey_duration || "N/A"}. It departs at ${formatDisplayTime(fastest.departure_from_source)}.`;
          })()
        : `Check the timetable above for journey durations on the ${from} to ${to} route.`,
    },
    {
      question: `What ticket classes are available on ${from} to ${to} trains?`,
      answer: `Bangladesh Railway trains on the ${from} to ${to} route typically offer Shuvon, Shuvon Chair, First Seat, Snigdha, AC Seat, and AC Birth classes. Availability depends on the specific train — check eticket.railway.gov.bd when booking.`,
    },
    {
      question: `Is there a direct train from ${from} to ${to}?`,
      answer: `Yes. ${sortedTrains.length} direct train${sortedTrains.length > 1 ? "s" : ""} run between ${from} and ${to} without requiring a change. See the full ${from} to ${to} train timetable above for departure and arrival times.`,
    },
  ];
}

export function buildFaqSchema(
  from: string,
  to: string,
  sortedTrains: RouteTrip[],
) {
  const faqItems = buildRouteFaqItems(from, to, sortedTrains);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildItemListSchema(
  from: string,
  to: string,
  sortedTrains: RouteTrip[],
  pageUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${from} to ${to} Train Schedule`,
    description: `Complete list of trains from ${from} to ${to} on Bangladesh Railway`,
    url: pageUrl,
    numberOfItems: sortedTrains.length,
    itemListElement: sortedTrains.map((train, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${train.train_name} — ${from} to ${to}`,
      description: `Departs ${formatDisplayTime(train.departure_from_source)}, arrives ${formatDisplayTime(train.arrival_at_destination)}, duration ${train.journey_duration || "N/A"}`,
    })),
  };
}

export function buildBreadcrumbSchema(
  from: string,
  to: string,
  stationSlug: string,
  routeSlug: string,
) {
  const baseUrl = "https://www.trainjatri.com";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Stations",
        item: `${baseUrl}/stations`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${from} Station`,
        item: `${baseUrl}/stations/${stationSlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${from} to ${to} Train Schedule`,
        item: `${baseUrl}/stations/${stationSlug}/${routeSlug}`,
      },
    ],
  };
}

export const POPULAR_ROUTES = [
  { from: "Dhaka", to: "Chattogram" },
  { from: "Chattogram", to: "Dhaka" },
  { from: "Cumilla", to: "Dhaka" },
  { from: "Dhaka", to: "Cumilla" },
  { from: "Dhaka", to: "Sylhet" },
  { from: "Sylhet", to: "Dhaka" },
  { from: "Dhaka", to: "Rajshahi" },
  { from: "Rajshahi", to: "Dhaka" },
  { from: "Narsingdi", to: "Dhaka" },
  { from: "Dhaka", to: "Khulna" },
] as const;

export function getPopularRouteHref(from: string, to: string) {
  const fromSlug = formatStationNameForUrl(from);
  const toSlug = formatStationNameForUrl(to);
  return `/stations/${fromSlug}/${fromSlug}-to-${toSlug}-train-schedule`;
}
