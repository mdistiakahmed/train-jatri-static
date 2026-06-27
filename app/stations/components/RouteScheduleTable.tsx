import { FaExternalLinkAlt } from "react-icons/fa";
import type { RouteTrip } from "../utils/routeSeo";
import { formatDisplayTime } from "../utils/routeSeo";

function formatOperatingDays(daysString: string): string {
  if (!daysString) return "N/A";
  if (daysString.toLowerCase() === "daily") {
    return "Runs all 7 days a week";
  }

  const weekDays = [
    { short: "Sat", en: "Saturday" },
    { short: "Sun", en: "Sunday" },
    { short: "Mon", en: "Monday" },
    { short: "Tue", en: "Tuesday" },
    { short: "Wed", en: "Wednesday" },
    { short: "Thu", en: "Thursday" },
    { short: "Fri", en: "Friday" },
  ];

  const operatingDays = daysString.split(",").map((d) => d.trim());
  const offDays = weekDays.filter((day) => !operatingDays.includes(day.short));

  if (offDays.length === 0) {
    return "Runs all 7 days a week";
  }

  return offDays.map((day) => day.en).join(", ");
}

export default function RouteScheduleTable({
  title,
  from,
  to,
  trains,
}: {
  title: string;
  from: string;
  to: string;
  trains: RouteTrip[];
}) {
  if (!trains.length) return null;

  return (
    <div className="flex flex-col overflow-x-auto">
      <div className="bg-red-600 text-white px-6 py-3">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="w-full overflow-x-auto max-w-full">
        <table className="min-w-max w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                Train Name
              </th>
              <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                Departure From {from}
              </th>
              <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                Arrival at {to}
              </th>
              <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                Off Day
              </th>
              <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {trains.map((trip, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                  <span className="font-medium text-gray-900">
                    {trip.train_name}
                  </span>
                  <a
                    href={`/trains/${trip.train_name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block text-xs text-blue-600 hover:underline mt-1"
                    title={`View all stops for ${trip.train_name}`}
                  >
                    View all stops <FaExternalLinkAlt className="inline w-2.5 h-2.5" />
                  </a>
                </td>
                <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap text-center">
                  {formatDisplayTime(trip.departure_from_source)}
                </td>
                <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap text-center">
                  {formatDisplayTime(trip.arrival_at_destination)}
                </td>
                <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap text-center">
                  {formatOperatingDays(trip.operating_days || "")}
                </td>
                <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap text-center">
                  {trip.journey_duration || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
