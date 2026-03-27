import React from "react";
import type { Metadata } from "next";
import Image from "next/image";

// Define metadata for the page
export const metadata: Metadata = {
  title: "Dhaka Metro Rail Schedule & Timings | Train Jatri",
  description:
    "Complete Dhaka Metro Rail schedule and timings for Uttara North to Motijheel route. Check first and last train departure times, weekday, Friday, weekend and government holiday schedules with frequency details.",
  keywords:
    "metro rail schedule, dhaka metro rail, uttara to motijheel, metro rail timings, dhaka mrt, bangladesh metro rail, dhaka metro rail first train, dhaka metro rail last train",
  openGraph: {
    title: "Dhaka Metro Rail Schedule & Timings | Train Jatri",
    description:
      "Dhaka Metro Rail schedule for Uttara North to Motijheel with first and last train times, weekday, Friday, weekend and holiday timings. Updated metro rail timings with frequency information.",
    type: "website",
    images: "/metro.png",
    url: "https://www.trainjatri.com/metro-rail",
    siteName: "Train Jatri",
  },
};

const ScheduleTable = ({
  title,
  schedule,
}: {
  title: string;
  schedule: { from: string; to: string; first: string; last: string }[];
}) => (
  <div className="my-10">
    <h3 className="text-lg my-5">{title}</h3>
    <div className="w-full overflow-x-auto max-w-full">
      <table className="min-w-max w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
              From Station
            </th>
            <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
              To Station
            </th>
            <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
              First Train
            </th>
            <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap">
              Last Train
            </th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                {item.from}
              </td>
              <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                {item.to}
              </td>
              <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                {item.first}
              </td>
              <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap">
                {item.last}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const schedules = [
  {
    id: "weekday",
    title: "Weekday Schedule (শনিবার to বৃহস্পতিবার)",
    items: [
      {
        from: "Uttara North (উত্তরা উত্তর)",
        to: "Motijheel (মতিঝিল)",
        first: "7:10 AM",
        last: "9:00 PM",
      },
      {
        from: "Motijheel (মতিঝিল)",
        to: "Uttara North (উত্তরা উত্তর)",
        first: "7:30 AM",
        last: "9:40 PM",
      },
    ],
  },
  {
    id: "friday",
    title: "Friday Schedule (শুক্রবার)",
    items: [
      {
        from: "Uttara North (উত্তরা উত্তর)",
        to: "Motijheel (মতিঝিল)",
        first: "3:00 PM",
        last: "9:00 PM",
      },
      {
        from: "Motijheel (মতিঝিল)",
        to: "Uttara North (উত্তরা উত্তর)",
        first: "3:20 PM",
        last: "9:40 PM",
      },
    ],
  },
];

// Text summary of all schedules for SEO
const textSchedule = {
  weekday: {
    title: "Weekday Schedule (Saturday to Thursday)",
    northToMotijheel:
      "The first train from Uttara North to Motijheel departs at 7:10 AM, and the last train leaves at 9:00 PM.",
    motijheelToNorth:
      "From Motijheel to Uttara North, the first departure is at 7:30 AM, while the last service runs at 9:40 PM.",
  },
  friday: {
    title: "Friday Schedule",
    northToMotijheel:
      "On Fridays, the first train from Uttara North to Motijheel starts at 3:00 PM, with the last train leaving at 9:00 PM.",
    motijheelToNorth:
      "From Motijheel, the first departure is at 3:20 PM, and the last train departs at 9:40 PM.",
  },
};

export default function MetroRailPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-8 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
            Dhaka Metro Rail Schedule
          </h1>

          {/* Summary Section */}
          <div className="max-w-3xl mx-auto text-gray-700 text-lg">
            <p className="mb-4">
              The <strong>Dhaka Metro Rail schedule</strong> operates regularly
              from <strong>Sunday to Thursday</strong>. Trains start from{" "}
              <strong>Uttara North at 7:10 AM</strong> and the last train
              departs at <strong>9:00 PM</strong>. From{" "}
              <strong>Motijheel</strong>, the first train leaves at{" "}
              <strong>7:30 AM</strong> and the final service runs until{" "}
              <strong>9:40 PM</strong>.
            </p>
            <p className="mb-4">
              On <strong>Fridays</strong>, metro services are available in the
              afternoon, starting from <strong>3:00 PM</strong> to{" "}
              <strong>9:40 PM</strong>. On{" "}
              <strong>Saturdays and public holidays</strong>, the metro follows
              the regular weekday schedule.
            </p>
            <p>
              Check the latest <strong>Dhaka Metro Rail time schedule</strong>{" "}
              before travel for any updates or special day adjustments.
            </p>
          </div>
        </div>

        {/* All Schedules */}
        <div className="w-full overflow-x-auto max-w-[400px] md:max-w-screen">
          {schedules.map((schedule) => (
            <div key={schedule.id} id={schedule.id} className="mb-8">
              <ScheduleTable title={schedule.title} schedule={schedule.items} />
            </div>
          ))}
        </div>

        <Image
          src="/metro.png"
          alt="Metro rail schedule"
          width={400}
          height={200}
          className="mx-auto my-8"
        />

        {/* Text Schedule for SEO */}
        <div className="prose max-w-none bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Detailed Dhaka Metro Rail Schedule
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            {textSchedule.weekday.title}
          </h3>
          <p>
            {textSchedule.weekday.northToMotijheel}{" "}
            {textSchedule.weekday.motijheelToNorth} This schedule is followed
            from Sunday to Thursday, providing consistent timings for
            office-goers and students.
          </p>

          <h3 className="mt-4 text-xl font-semibold text-gray-800 mt-6 mb-3">
            {textSchedule.friday.title}
          </h3>
          <p>
            {textSchedule.friday.northToMotijheel}{" "}
            {textSchedule.friday.motijheelToNorth} Friday services start later
            to accommodate weekly holidays in Bangladesh.
          </p>

          <h3 className="mt-4 text-xl font-semibold text-gray-800 mt-8 mb-3">
            About Dhaka Metro Rail
          </h3>
          <p>
            The <strong>Dhaka Metro Rail</strong> (MRT Line-6) is
            Bangladesh&apos;s first metro rail service, designed to reduce
            traffic congestion and provide a modern, efficient, and
            environment-friendly transport system. Covering the key route
            between Uttara North and Motijheel, it has become one of the most
            reliable public transportation systems in Dhaka city.
          </p>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Important Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                General Guidelines
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>
                    Arrive at least 15 minutes before the last train departure
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Keep your ticket until the end of your journey</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Follow all safety instructions from staff</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Information
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Helpline: 16457</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Email: info@dhakametro.org</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Website: www.dhakametro.org</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
