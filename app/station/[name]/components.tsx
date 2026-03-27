import {
  FaExternalLinkAlt,
  FaQuestionCircle,
  FaRegCommentDots,
} from "react-icons/fa";

export const JsonLdStructuredData = ({ stationName, trainData }: any) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${stationName} Station Train Schedule`,
    description: `Complete train schedule for ${stationName} railway station in Bangladesh`,
    url: `https://www.trainjatri.com/station/${stationName.toLowerCase()}`,
    about: {
      "@type": "TrainStation",
      name: `${stationName} Railway Station`,
      address: {
        "@type": "PostalAddress",
        addressCountry: "BD",
        addressLocality: stationName,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
};

// Add this component before the GroupedTrainSchedules component
export const TableOfContents = ({
  groupedRoutes,
  stationName,
}: {
  groupedRoutes: { [key: string]: any[] };
  stationName: string;
}) => {
  const sortedRoutes = Object.keys(groupedRoutes).sort();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 text-center">Table of Contents</h2>
      <div className="grid grid-cols-1 gap-2">
        {/* Add link to all stations table */}
        <a
          key="all-stations"
          href="#forward-trains"
          className="block text-left px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200 font-semibold"
        >
          {stationName} to All Station Train Schedule
        </a>
        {sortedRoutes.map((route) => (
          <a
            key={route}
            href={`#${route.replace(/\s+/g, "-")}`}
            className="block text-left px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
          >
            {route} Train Schedule
          </a>
        ))}
      </div>
    </div>
  );
};

export const StationSEOIntro = ({ stationName, trainData }: any) => {
  const totalTrains =
    trainData.forward_trains.length + trainData.reverse_trains.length;

  const uniqueDestinations = Array.from(
    new Set([
      ...trainData.forward_trains.map((t: any) => t.to),
      ...trainData.reverse_trains.map((t: any) => t.to),
    ]),
  );

  const popularDestinations = uniqueDestinations.slice(0, 5).join(", ");

  return (
    <div className="mb-6 text-left text-gray-700 leading-7 bg-white px-1 py-6">
      <p className="mb-4">
        <strong>{stationName} Railway Station</strong> is an important railway
        station in Bangladesh where a total of <strong>{totalTrains}</strong>{" "}
        trains operate regularly.
      </p>

      <p className="mb-4">
        From {stationName}, passengers can travel directly to popular
        destinations such as <strong>{popularDestinations}</strong> and other
        major railway stations in Bangladesh.
      </p>

      <p>
        This page provides the complete and updated train schedule of{" "}
        {stationName} station including departure times, arrival times, weekly
        off days, and route information to help you plan your journey
        efficiently.
      </p>
    </div>
  );
};

export const generateForwardTrainsDescription = (
  stationName: string,
  forwardTrains: any[],
) => {
  if (forwardTrains.length === 0) return "";

  const trainDescriptions = forwardTrains.map(
    (train) =>
      `${train.train_name}(${train.train_number}) departs from ${stationName} at ${train.departure_time_at_current} and arrives at ${train.to} at ${train.arrival_time_at_destination}.`,
  );

  return (
    <div className="mb-4 text-sm text-gray-600 text-left bg-white px-1 py-6">
      <p className="mb-3">
        There are total {forwardTrains.length} forward trains departing from{" "}
        {stationName} to various destinations. {trainDescriptions.join(" ")}
      </p>
      <p>
        These forward trains from {stationName} connect to major destinations
        across Bangladesh. Check the complete schedule with departure times,
        arrival times, and weekly off days for planning your journey.
      </p>
    </div>
  );
};

export const generateReverseTrainsDescription = (
  stationName: string,
  reverseTrains: any[],
) => {
  if (reverseTrains.length === 0) return "";

  const trainDescriptions = reverseTrains.map(
    (train) =>
      `${train.train_name}(${train.train_number}) arrives at {stationName} at ${train.arrival_time_at_current} from ${train.from}, departing at ${train.departure_time_at_current} and reaches ${train.to} at ${train.arrival_time_at_destination}.`,
  );

  return (
    <div className="mb-4 text-sm text-gray-600 text-left bg-white px-1 py-6">
      <p className="mb-3">
        There are total {reverseTrains.length} downward trains arriving at{" "}
        {stationName} from various stations. {trainDescriptions.join(" ")}
      </p>
      <p>
        These downward trains provide connections back to {stationName} from
        different parts of Bangladesh. View the complete timetable with arrival
        times, departure times, and weekly off days for convenient travel
        planning.
      </p>
    </div>
  );
};

export const groupTrainsByDestination = (
  trainData: any,
  currentStation: string,
) => {
  const groupedRoutes: { [key: string]: any[] } = {};

  // Process forward trains
  trainData.forward_trains.forEach((train: any) => {
    if (!train.to) return;
    const routeKey = `${currentStation} to ${train.to}`;

    if (!groupedRoutes[routeKey]) {
      groupedRoutes[routeKey] = [];
    }

    groupedRoutes[routeKey].push(train);
  });

  // Process reverse trains
  trainData.reverse_trains.forEach((train: any) => {
    if (!train.to) return;
    const routeKey = `${currentStation} to ${train.to}`;

    if (!groupedRoutes[routeKey]) {
      groupedRoutes[routeKey] = [];
    }

    groupedRoutes[routeKey].push(train);
  });

  // Sort each group by departure time
  Object.keys(groupedRoutes).forEach((route) => {
    groupedRoutes[route].sort((a, b) => {
      const convertToMinutes = (time: string) => {
        const [timePart, modifier] = time.trim().split(" "); // "02:10 am"
        if (!timePart || !modifier) return 0;
        let [hours, minutes] = timePart.split(":").map(Number);

        if (modifier.toLowerCase() === "pm" && hours !== 12) {
          hours += 12;
        }

        if (modifier.toLowerCase() === "am" && hours === 12) {
          hours = 0;
        }

        return hours * 60 + minutes; // total minutes since midnight
      };

      return (
        convertToMinutes(a.departure_time_at_current) -
        convertToMinutes(b.departure_time_at_current)
      );
    });
  });

  return groupedRoutes;
};
// Component to display grouped schedules
export const GroupedTrainSchedules = ({
  groupedRoutes,
}: {
  groupedRoutes: { [key: string]: any[] };
}) => {
  const generateRouteDescription = (route: string, trains: any[]) => {
    const [from, to] = route.split(" to ");

    if (trains.length === 0) return "";

    const trainDescriptions = trains.map(
      (train) =>
        `${train.train_name} departs from ${from} at ${train.departure_time_at_current} and arrive at ${train.arrival_time_at_destination}.`,
    );

    return (
      <div className="mb-4 text-sm text-gray-600 text-left">
        <p className="mb-3">
          There are total {trains.length} trains departs from {from} to {to}.{" "}
          {trainDescriptions.join(" ")}
        </p>
        <p>
          Find complete schedule information for all trains running from {from}{" "}
          to {to}, including departure times, arrival times, and weekly off
          days.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedRoutes).map(([route, trains]) => (
        <div
          key={route}
          id={route.replace(/\s+/g, "-")}
          className="bg-white px-1 py-6 scroll-mt-20"
        >
          <h3 className="text-xl font-bold mb-4 text-center">
            {route} Train Schedule
          </h3>

          {/* Add dynamic SEO text */}
          {generateRouteDescription(route, trains)}

          <div className="w-full overflow-x-auto">
            <table className="min-w-max w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    Train Name
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    Arrival
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    Departure
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    Off Day
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    Train No.
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    From
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    To
                  </th>
                </tr>
              </thead>
              <tbody>
                {trains.map((train: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      <a
                        href={`/trains/${formatTrainNameForUrl(train.train_name)}`}
                        className="text-blue-600 hover:text-blue-800 underline inline-flex items-center space-x-3 transition-colors"
                      >
                        <span>{train.train_name}</span>
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      {train.arrival_time_at_current}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      {train.departure_time_at_current}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      {train.offday}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      {train.train_number}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      {train.from}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      {train.to}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export const formatTrainNameForUrl = (trainName: string) => {
  if (!trainName) return "";
  return trainName.toLowerCase().replace(/\s+/g, "-");
};

export const StationFAQ = ({
  stationName,
  trainData,
}: {
  stationName: string;
  trainData: any;
}) => {
  const uniqueDestinations = Array.from(
    new Set([
      ...trainData.forward_trains.map((t: any) => t.to),
      ...trainData.reverse_trains.map((t: any) => t.from),
    ]),
  );

  const totalTrains =
    trainData.forward_trains.length + trainData.reverse_trains.length;

  // Helper function to count trains between stations
  const countTrainsBetweenStations = (from: string, to: string) => {
    const forwardCount = trainData.forward_trains.filter(
      (t: any) => t.from === from && t.to === to,
    ).length;
    const reverseCount = trainData.reverse_trains.filter(
      (t: any) => t.from === from && t.to === to,
    ).length;
    return forwardCount + reverseCount;
  };

  // Helper function to get train departure info
  const getTrainDepartureInfo = (trainName: string) => {
    const forwardTrain = trainData.forward_trains.find(
      (t: any) => t.train_name === trainName,
    );
    const reverseTrain = trainData.reverse_trains.find(
      (t: any) => t.train_name === trainName,
    );

    if (forwardTrain) {
      return {
        departure: forwardTrain.departure_time_at_current,
        to: forwardTrain.to,
        offday: forwardTrain.offday,
      };
    }
    if (reverseTrain) {
      return {
        departure: reverseTrain.departure_time_at_current,
        to: reverseTrain.to,
        offday: reverseTrain.offday,
      };
    }
    return null;
  };

  const faqData = [
    {
      question: `How many trains depart from ${stationName} station daily?`,
      answer: `A total of ${trainData.forward_trains.length} trains depart from ${stationName} station to various destinations across Bangladesh. These include intercity, commuter, and passenger trains serving different routes throughout the day.`,
    },
    {
      question: `Which are the most popular destinations from ${stationName} station?`,
      answer: `Popular destinations from ${stationName} station include ${uniqueDestinations.slice(0, 5).join(", ")} and other major cities. Each route has specific train schedules with different departure times to suit passenger needs.`,
    },
    ...uniqueDestinations.slice(0, 5).map((destination: string) => {
      const trainCount = countTrainsBetweenStations(stationName, destination);
      return {
        question: `How many trains from ${stationName} to ${destination}?`,
        answer: `There are ${trainCount} trains available from ${stationName} to ${destination}. You can check the detailed schedule above for specific departure times, arrival times, and weekly off days for each train on this route.`,
      };
    }),
    ...uniqueDestinations.slice(0, 5).map((destination: string) => ({
      question: `What is ${stationName} to ${destination} train schedule?`,
      answer: `The ${stationName} to ${destination} route has several trains operating throughout the day. You can check the detailed schedule above for specific departure and arrival times, along with weekly off days for each train on this route.`,
    })),
    ...trainData.forward_trains.map((train: any) => ({
      question: `When does ${train.train_name} depart from ${stationName}?`,
      answer: `${train.train_name}(${train.train_number}) departs from ${stationName} at ${train.departure_time_at_current} and arrives at ${train.to} at ${train.arrival_time_at_destination}. This train has weekly off day on ${train.offday}.`,
    })),
    ...trainData.reverse_trains.map((train: any) => ({
      question: `When does ${train.train_name} arrive at ${stationName}?`,
      answer: `${train.train_name}(${train.train_number}) arrives at ${stationName} at ${train.arrival_time_at_current} from ${train.from}. It then departs at ${train.departure_time_at_current} and reaches ${train.to} at ${train.arrival_time_at_destination}. Weekly off day is ${train.offday}.`,
    })),
    {
      question: `How many intercity trains operate from ${stationName} station?`,
      answer: `From ${stationName} station, there are ${
        trainData.forward_trains.length + trainData.reverse_trains.length
      } intercity trains available to major cities across Bangladesh.`,
    },
    {
      question: `Which trains from ${stationName} have no weekly off day?`,
      answer: `Trains from ${stationName} that operate daily (no off day) include ${
        trainData.forward_trains
          .filter((t: any) => t.offday === "No OffDay")
          .map((t: any) => t.train_name)
          .slice(0, 3)
          .join(", ") || "None"
      }. These trains run every day of the week.`,
    },
    {
      question: `What are the morning departure times from ${stationName} station?`,
      answer: `Morning trains from ${stationName} include ${
        trainData.forward_trains
          .filter((t: any) => {
            const time = t.departure_time_at_current.split(" ")[0];
            const hour = parseInt(time.split(":")[0]);
            return hour < 12;
          })
          .map((t: any) => `${t.train_name} at ${t.departure_time_at_current}`)
          .slice(0, 3)
          .join(", ") || "None"
      }. Morning departures are usually less crowded and recommended for comfortable travel.`,
    },
    {
      question: `What are the evening departure times from ${stationName} station?`,
      answer: `Evening trains from ${stationName} include ${
        trainData.forward_trains
          .filter((t: any) => {
            const time = t.departure_time_at_current.split(" ")[0];
            const hour = parseInt(time.split(":")[0]);
            return hour >= 16;
          })
          .map((t: any) => `${t.train_name} at ${t.departure_time_at_current}`)
          .slice(0, 3)
          .join(", ") || "None"
      }. Evening trains are convenient for business travelers and those who prefer night travel.`,
    },
    {
      question: `How can I book tickets for trains from ${stationName} station?`,
      answer: `You can book train tickets from ${stationName} station through the official Bangladesh Railway website, mobile app, or at the station counter. It's recommended to book in advance especially for intercity trains to ensure seat availability.`,
    },
    {
      question: `What facilities are available at ${stationName} railway station?`,
      answer: `${stationName} railway station provides basic facilities including waiting rooms, ticket counters, and platform information. For specific facility details, passengers are advised to contact the station directly or check the official Bangladesh Railway website.`,
    },
    {
      question: `What is the best time to travel from ${stationName} station?`,
      answer: `The best time to travel from ${stationName} station depends on your destination and preferences. Morning trains are usually less crowded, while evening trains might be more convenient for business travelers. Check the complete schedule to choose the most suitable departure time.`,
    },
    {
      question: `Are there any special trains during holidays from ${stationName} station?`,
      answer: `During major holidays and festivals, Bangladesh Railway often operates special trains from ${stationName} station. These special trains are announced separately and may have different schedules. Passengers are advised to check official announcements during holiday seasons.`,
    },
  ];

  return (
    <div className="mt-12 max-w-4xl mx-auto text-left">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Frequently Asked Questions About {stationName} Railway Station
      </h2>

      <div className="space-y-8">
        {faqData.map((faq, index) => (
          <div key={index} className="  bg-white py-6 px-4">
            {/* Question */}
            <div className="flex items-start gap-3 mb-2">
              <FaQuestionCircle className="text-indigo-600 mt-1 shrink-0" />
              <h3 className="text-lg font-semibold text-gray-800">
                {faq.question}
              </h3>
            </div>

            {/* Answer */}
            <div className="flex items-start gap-3">
              <FaRegCommentDots className="text-gray-500 mt-1 shrink-0" />
              <p className="text-gray-700 leading-7">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
