import { allStationNames } from "@/data/Stations/0_all_station_name";
import { uniqueTrainNames } from "@/utils/trainNames";
import { paths } from "@/utils/trainRoutes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}

      {/* Explore More Sections */}
      <div className="mt-16 space-y-16">
        {/* Popular Stations Section */}
        <section className="bg-white p-8 rounded-xl border border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Popular Stations
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore train schedules from major railway stations across
              Bangladesh. Check arrivals, departures, and plan your journey.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {allStationNames.splice(0, 12).map((station) => (
                <a
                  key={station}
                  href={`/station/${station.toLowerCase().replace(/\s+/g, "-")}`}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
                >
                  <h3 className="font-medium text-gray-800">{station}</h3>
                  <p className="text-sm text-gray-500">Station</p>
                </a>
              ))}
            </div>
            <a
              href="/station"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              View All Stations
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </section>

        {/* Places to Visit Section */}
        <section className="bg-gradient-to-r from-green-50 to-teal-50 p-8 rounded-xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Discover Beautiful Destinations
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore amazing places across Bangladesh that you can easily reach
              by train. From scenic landscapes to cultural landmarks, find your
              next travel destination.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { name: "Coxs Bazar", type: "Beach" },
                { name: "Sundarbans", type: "Forest" },
                { name: "Sylhet", type: "Tea Gardens" },
                { name: "Rangamati", type: "Hill Station" },
                { name: "Srimangal", type: "Tea Capital" },
                { name: "Bandarban", type: "Hills" },
                { name: "Kuakata", type: "Sea Beach" },
                { name: "Paharpur", type: "Heritage Site" },
              ].map((place) => (
                <div
                  key={place.name}
                  className="p-3 bg-white/80 backdrop-blur-sm rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-800">{place.name}</h3>
                  <p className="text-sm text-gray-500">{place.type}</p>
                </div>
              ))}
            </div>
            <a
              href="/places-to-visit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
            >
              Explore Destinations
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
