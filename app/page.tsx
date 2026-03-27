import React from "react";
import Image from "next/image";
import { uniqueTrainNames } from "@/utils/trainNames";
import { paths } from "@/utils/trainRoutes";

// Major stations in Bangladesh
const majorStations = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Brahmanbaria",
  "Sylhet",
];

const stripBracketContent = (name: string) => {
  return name.replace(/\s*\(.*?\)\s*/g, "").trim();
};

const HomePage = () => {
  // Get top 6 popular trains
  const popularTrains = uniqueTrainNames.slice(0, 6);

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Complete Bangladesh Railway Guide
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Find train schedules, book tickets, and get real-time updates for
            all major train routes across Bangladesh. Plan your journey with
            Train Jatri - your trusted travel companion.
          </p>
          <Image
            src="/logo.png"
            alt="Bangladesh Railway Network - Train Jatri"
            width={600}
            height={300}
            className="mx-auto rounded-lg"
            priority
          />
        </section>

        {/* Quick Access Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Quick Access to Essential Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="/trains"
              className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300 border border-blue-100"
            >
              <h3 className="text-xl font-semibold mb-3 text-blue-800">
                Train Schedules
              </h3>
              <p className="text-gray-600">
                Find schedules by train name or number across all routes in
                Bangladesh.
              </p>
            </a>
            <a
              href="/station"
              className="block p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300 border border-green-100"
            >
              <h3 className="text-xl font-semibold mb-3 text-green-800">
                Station Schedules
              </h3>
              <p className="text-gray-600">
                View all train schedules for major railway stations in
                Bangladesh.
              </p>
            </a>

            <a
              href="/live-tracking"
              className="block p-6 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-300 border border-red-100"
            >
              <h3 className="text-xl font-semibold mb-3 text-red-800">
                Live Train Tracking
              </h3>
              <p className="text-gray-600">
                Track trains in real-time and get live updates on their status.
              </p>
            </a>
          </div>
        </section>

        {/* Popular Trains Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold">Popular Trains</h2>
            <a href="/trains" className="text-blue-600 hover:underline">
              View All Trains →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTrains.map((trainName) => {
              const cleanName = stripBracketContent(trainName);
              const urlSlug = cleanName.toLowerCase().replace(/\s+/g, "-");
              return (
                <a
                  key={trainName}
                  href={`/trains/${urlSlug}`}
                  className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {cleanName}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    View schedule, stops, and booking information.
                  </p>
                  <div className="flex justify-end">
                    <span className="text-blue-600 font-medium">
                      View Schedule →
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Major Stations Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold">Major Railway Stations</h2>
            <a href="/station" className="text-blue-600 hover:underline">
              View All Stations →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {majorStations.map((station, index) => (
              <a
                key={index}
                href={`/station/${station.toLowerCase()}`}
                className="p-4 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 text-center border border-gray-100"
              >
                <h3 className="font-medium text-gray-800">{station} Station</h3>
                <p className="text-sm text-gray-500 mt-1">View all trains</p>
              </a>
            ))}
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="mt-16 pt-8 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold  mb-4">About Our Data</h2>
            <div className="prose prose-indigo ">
              <p>
                At Train Jatri, we are committed to providing accurate and
                up-to-date train schedule information to our users. Our data is
                collected from official Bangladesh Railway sources and
                government websites to ensure reliability.
              </p>
              <p className="mt-4">
                We update our database on a regular basis, typically every
                month, to reflect any changes in train schedules, routes, or
                government regulations. However, please note that train
                schedules are subject to change due to various factors including
                maintenance, weather conditions, or operational requirements.
              </p>
              <p className="mt-4">
                While we strive for accuracy, we recommend cross-verifying
                important travel information with official Bangladesh Railway
                sources before making travel arrangements. Train Jatri is not
                responsible for any inconvenience or loss resulting from
                schedule changes or inaccuracies in the information provided.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Last updated: 21th June, 2025
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
