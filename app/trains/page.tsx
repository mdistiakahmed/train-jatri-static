import Image from "next/image";
import { uniqueTrainNames } from "@/utils/trainNames";
import SearchButton from "@/components/SearchTrainComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Bangladesh Trains List | Intercity & Mail Express Trains",
  description:
    "Browse the complete list of Bangladesh Railway trains including Intercity, Mail Express, and local trains. View routes, schedules, and details for every train.",
  openGraph: {
    title: "All Bangladesh Trains List | Intercity & Mail Express Trains",
    description:
      "Browse the complete list of Bangladesh Railway trains including Intercity, Mail Express, and local trains. View routes, schedules, and details for every train.",
    images: "/logo.png",
    url: "https://www.trainjatri.com/trains",
    siteName: "Train Jatri",
    type: "website",
  },
};

const stripBracketContent = (name: string) => {
  return name.replace(/\s*\(.*?\)\s*/g, "").trim(); // Removes (number) and trims
};

const TrainsPage = () => {
  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Trains Schedule
        </h1>

        <p className="text-lg text-gray-600 mb-10 text-center">
          Discover a comprehensive list of trains across Bangladesh. Find your
          train and plan your journey with Train Jatri.
        </p>

        <Image
          src="/logo.png"
          alt="Bangladesh Railway Train Journey"
          width={400}
          height={200}
          className="mx-auto my-8"
        />

        <SearchButton />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueTrainNames.map((rawName) => {
            const cleanName = stripBracketContent(rawName);
            const urlSlug = cleanName.toLowerCase().replace(/\s+/g, "-");
            return (
              <a
                key={rawName}
                href={`/trains/${urlSlug}`}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3 capitalize">
                  {cleanName}
                </h3>
                <p className="text-gray-600">View schedule and details.</p>
                <div className="mt-4 flex justify-end">
                  <span className="text-indigo-600 font-medium">
                    View Details →
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrainsPage;
