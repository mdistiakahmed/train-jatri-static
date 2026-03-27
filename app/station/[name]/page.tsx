import { getDataForStation } from "@/utils/getData";
import React from "react";
import Head from "next/head";
import Image from "next/image";

import { allStationNames } from "./../../../data/Stations/0_all_station_name";
import {
  formatTrainNameForUrl,
  generateForwardTrainsDescription,
  generateReverseTrainsDescription,
  GroupedTrainSchedules,
  groupTrainsByDestination,
  JsonLdStructuredData,
  StationFAQ,
  StationSEOIntro,
  TableOfContents,
} from "./components";
import { FaExternalLinkAlt } from "react-icons/fa";

export async function generateStaticParams() {
  return allStationNames.map((name: string) => ({
    name: name.split(" ").join("-").toLowerCase(),
  }));
}

export const generateMetadata = async ({ params }: any) => {
  const { name } = await params;
  const trainData = await getDataForStation(name);

  if (!trainData) {
    return {
      title: "Train Details Not Found",
      description: "Train details could not be found.",
    };
  }

  return {
    title: `${name.charAt(0).toUpperCase() + name.slice(1)} Station Train Schedule in Bangladesh`,
    description: `Details of ${name} station train time schedule , weekly offday , source and destination arrival time.`,
    openGraph: {
      title: `${name.charAt(0).toUpperCase() + name.slice(1)} Station Train Schedule in Bangladesh`,
      description: `Details of ${name} station train time schedule , weekly offday , source and destination arrival time.`,
      url: `https://www.trainjatri.com/station/${name}`,
      siteName: "Train Jatri",
      type: "website",
      images: "/logo.png",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name.charAt(0).toUpperCase() + name.slice(1)} Station Train Schedule`,
      description: `Details of ${name} station train time schedule , weekly offday , source and destination arrival time.`,
      images: "/logo.png",
    },
  };
};

const StationPage = async ({ params }: any) => {
  const { name } = await params;

  const trainData = await getDataForStation(name);

  if (!trainData) {
    return (
      <div className="p-4">
        <Head>
          <title>{name} Train Schedule - Train Jatri</title>
          <meta
            name="description"
            content={`Train schedule information for ${name} station. No data available.`}
          />
        </Head>
        Station data not found.
      </div>
    );
  }

  const stationName = name.charAt(0).toUpperCase() + name.slice(1);
  const groupedRoutes = groupTrainsByDestination(trainData, stationName);

  return (
    <div className="text-center">
      <JsonLdStructuredData stationName={stationName} trainData={trainData} />

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          {stationName} Railway Station Train Schedule
        </h1>
        <StationSEOIntro stationName={stationName} trainData={trainData} />

        {/* Add Table of Contents */}
        <div className="w-full overflow-x-auto max-w-screen p-4">
          <TableOfContents
            groupedRoutes={groupedRoutes}
            stationName={stationName}
          />
        </div>

        <Image
          src="/logo.png"
          alt="Bangladesh Railway Train Journey"
          width={400}
          height={200}
          className="mx-auto"
        />
      </div>

      <div className="w-full overflow-x-auto max-w-screen p-4">
        <div className="mb-6" id="forward-trains">
          <h3 className="text-lg my-5">
            Forward Trains - {stationName} Train Schedule
          </h3>
          {/* Add dynamic SEO text */}
          {generateForwardTrainsDescription(
            stationName,
            trainData.forward_trains,
          )}
          <div className="w-full overflow-x-auto max-w-full">
            <table className="min-w-max w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    Train Name
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    From
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
                    Destination
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    Destination Arrival Time
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    Train No.
                  </th>
                </tr>
              </thead>
              <tbody>
                {trainData.forward_trains.map((train: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      <a
                        href={`/trains/${formatTrainNameForUrl(train.train_name)}`}
                        className="text-blue-600 underline inline-flex items-center space-x-3 transition-colors"
                      >
                        <span>{train.train_name}</span>
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      {train.from}
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
                      {train.to}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      {train.arrival_time_at_destination}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      {train.train_number}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="my-10">
          <h3 className="text-lg my-5">
            Downwards Trains - {stationName} Train Schedule
          </h3>
          {/* Add dynamic SEO text */}
          {generateReverseTrainsDescription(
            stationName,
            trainData.reverse_trains,
          )}
          <div className="w-full overflow-x-auto max-w-full">
            <table className="min-w-max w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    Train Name
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    From
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
                    Destination
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    Destination Arrival Time
                  </th>
                  <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
                    Train No.
                  </th>
                </tr>
              </thead>
              <tbody>
                {trainData.reverse_trains.map((train: any) => (
                  <tr key={train.trainNumber} className="border-b">
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      <a
                        href={`/trains/${formatTrainNameForUrl(train.train_name)}`}
                        className="text-blue-600 underline inline-flex items-center space-x-3 transition-colors"
                      >
                        <span>{train.train_name}</span>
                        <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      {train.from}
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
                      {train.to}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      {train.arrival_time_at_destination}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                      {train.train_number}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add grouped schedules */}
      <div className="w-full overflow-x-auto max-w-screen p-4">
        <GroupedTrainSchedules groupedRoutes={groupedRoutes} />
      </div>

      <StationFAQ stationName={stationName} trainData={trainData} />
    </div>
  );
};

export default StationPage;
