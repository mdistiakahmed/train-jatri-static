import Link from "next/link";
import { FaTrain } from "react-icons/fa";
import { POPULAR_ROUTES, getPopularRouteHref } from "../utils/routeSeo";

export default function PopularRoutes({
  title = "Popular Train Routes",
  description = "Browse the most searched station-to-station train schedules across Bangladesh Railway.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {POPULAR_ROUTES.map((route) => (
          <Link
            key={`${route.from}-${route.to}`}
            href={getPopularRouteHref(route.from, route.to)}
            prefetch={false}
            className="group flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all"
          >
            <FaTrain className="text-red-500 shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                {route.from} to {route.to} Train Schedule
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Timetable, departure times &amp; all trains
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
