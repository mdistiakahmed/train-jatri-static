import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import MetroTodaySchedule from "./MetroTodaySchedule";
import { FaQuestionCircle, FaRegCommentDots } from "react-icons/fa";

export const metadata: Metadata = {
  title:
    "Dhaka Metro Rail Schedule 2026 | Timings, First & Last Train | Train Jatri",
  description:
    "Dhaka Metro Rail Schedule 2026 for Uttara North to Motijheel route. Check first train, last train, weekday timings, Friday schedule, Saturday service, and updated metro rail timings in Dhaka, Bangladesh.",
  keywords:
    "Dhaka Metro Rail Schedule 2026, metro rail timings Dhaka, first train Dhaka metro, last train Dhaka metro, Friday metro schedule Dhaka, Uttara to Motijheel train time, Bangladesh metro rail schedule",

  openGraph: {
    title: "Dhaka Metro Rail Schedule 2026 | Timings & Updates",
    description:
      "Complete Dhaka Metro Rail schedule with first train, last train, weekday, Friday, and Saturday timings for Uttara North to Motijheel route.",
    type: "website",
    images: "/metro.png",
    url: "https://www.trainjatri.com/metro-rail-schedula",
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
    title: "Weekday Schedule (রবিবার - বৃহস্পতিবার)",
    items: [
      {
        from: "Uttara North (উত্তরা উত্তর)",
        to: "Motijheel (মতিঝিল)",
        first: "06:30 AM",
        last: "09:50 PM",
      },
      {
        from: "Motijheel (মতিঝিল)",
        to: "Uttara North (উত্তরা উত্তর)",
        first: "07:15 AM",
        last: "10:30 PM",
      },
    ],
  },
  {
    id: "saturday",
    title: "Saturday Schedule (শনিবার)",
    items: [
      {
        from: "Uttara North (উত্তরা উত্তর)",
        to: "Motijheel (মতিঝিল)",
        first: "06:30 AM",
        last: "09:50 PM",
      },
      {
        from: "Motijheel (মতিঝিল)",
        to: "Uttara North (উত্তরা উত্তর)",
        first: "07:15 AM",
        last: "10:30 PM",
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
        first: "03:00 PM",
        last: "09:50 PM",
      },
      {
        from: "Motijheel (মতিঝিল)",
        to: "Uttara North (উত্তরা উত্তর)",
        first: "03:20 PM",
        last: "10:30 PM",
      },
    ],
  },
];

// Text summary of all schedules for SEO
const textSchedule = {
  weekday: {
    title: "Weekday Schedule (Sunday to Thursday)",
    northToMotijheel:
      "The first train from Uttara North to Motijheel departs at 6:30 AM, and the last train leaves at 9:50 PM.",
    motijheelToNorth:
      "From Motijheel to Uttara North, the first departure is at 7:15 AM, while the last service runs at 10:30 PM.",
  },

  saturday: {
    title: "Saturday Schedule",
    northToMotijheel:
      "On Saturdays, the first train from Uttara North to Motijheel departs at 6:30 AM, and the last train leaves at 9:50 PM.",
    motijheelToNorth:
      "From Motijheel to Uttara North, the first departure is at 7:15 AM, while the last service runs at 10:30 PM.",
  },

  friday: {
    title: "Friday Schedule",
    northToMotijheel:
      "On Fridays, the first train from Uttara North to Motijheel starts at 3:00 PM, with the last train leaving at 9:50 PM.",
    motijheelToNorth:
      "From Motijheel, the first departure is at 3:20 PM, and the last train departs at 10:30 PM.",
  },
};

export default function MetroRailPage() {
  const faqData = schedules.flatMap((schedule) =>
    schedule.items.map((item) => {
      return {
        title: schedule.title,
        from: item.from,
        to: item.to,
        first: item.first,
        last: item.last,
      };
    }),
  );

  const faqSchemaData = schedules.flatMap((schedule) =>
    schedule.items.map((item) => ({
      question: `What are the first and last train times on ${schedule.title} from ${item.from} to ${item.to}?`,
      answer: `On ${schedule.title}, trains from ${item.from} to ${item.to} start at ${item.first} and run until ${item.last}.`,
    })),
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqSchemaData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-8 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
            Dhaka Metro Rail Schedule
          </h1>

          <MetroTodaySchedule />

          {/* Summary Section */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Dhaka Metro Rail Schedule Overview (2026)
          </h2>

          <div className="max-w-3xl mx-auto text-gray-700 text-lg">
            <p className="mb-4">
              The <strong>Dhaka Metro Rail Schedule 2026</strong> operates
              regularly from Sunday to Thursday on the MRT Line-6 route between{" "}
              Uttara North and Motijheel . Trains start at{" "}
              <strong>6:30 AM</strong> and run until <strong>9:50 PM</strong>{" "}
              from Uttara North, while Motijheel operates from{" "}
              <strong>7:15 AM</strong> to <strong>10:30 PM</strong>.
            </p>

            <p className="mb-4">
              On Saturdays, the metro follows the same schedule as weekdays,
              operating from <strong>6:30 AM to 9:50 PM</strong> (Uttara North)
              and <strong>7:15 AM to 10:30 PM</strong> (Motijheel).
            </p>

            <p className="mb-4">
              On Fridays, metro services operate in the afternoon from{" "}
              <strong>3:00 PM</strong> until <strong>9:50 PM</strong> from
              Uttara North, and from <strong>3:20 PM</strong> until{" "}
              <strong>10:30 PM</strong> from Motijheel.
            </p>

            <p>
              Check the latest <strong>Dhaka Metro Rail time schedule</strong>{" "}
              before travel for any updates or special day adjustments.
            </p>

            <p className="mt-4">
              This page provides updated{" "}
              <strong>Dhaka Metro Rail timings</strong>, including first train,
              last train, Friday schedule, and weekend operations.
            </p>
          </div>
        </div>

        <Image
          src="/metro.png"
          alt="Metro rail schedule"
          width={400}
          height={200}
          className="mx-auto my-8"
        />

        {/* All Schedules */}
        <div className="w-full overflow-x-auto max-w-[400px] md:max-w-screen">
          {schedules.map((schedule) => (
            <div key={schedule.id} id={schedule.id} className="mb-8">
              <ScheduleTable title={schedule.title} schedule={schedule.items} />
            </div>
          ))}
        </div>

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

          <h3 className="mt-4 text-xl font-semibold text-gray-800 mt-6 mb-3">
            {textSchedule.saturday.title}
          </h3>
          <p>
            {textSchedule.saturday.northToMotijheel}{" "}
            {textSchedule.saturday.motijheelToNorth} Saturday services start
            later to accommodate weekly holidays in Bangladesh.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-14 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Frequently Asked Questions About Dhaka Metro Rail Schedule
          </h2>

          <div className="space-y-6 max-w-4xl mx-auto flex flex-col gap-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100"
              >
                {/* Question */}
                <div className="flex items-start gap-3 mb-3">
                  <FaQuestionCircle className="text-indigo-600 mt-1 shrink-0 text-lg" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    What are the first and last train times on {faq.title} from{" "}
                    {faq.from} to {faq.to}?
                  </h3>
                </div>

                {/* Answer */}
                <div className="flex items-start gap-3">
                  <FaRegCommentDots className="text-gray-500 mt-1 shrink-0 text-lg" />
                  <p className="text-gray-700 leading-7">
                    On <strong>{faq.title}</strong>, trains from{" "}
                    <strong>{faq.from}</strong> to <strong>{faq.to}</strong>{" "}
                    start at <strong>{faq.first}</strong> and the last train
                    runs until <strong>{faq.last}</strong>.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History Section */}
        <div className="mt-12 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            History of Dhaka Metro Rail (MRT Line-6)
          </h2>

          <div className="text-gray-700 text-lg space-y-4">
            <p>
              The <strong>Dhaka Metro Rail</strong> is Bangladesh&apos;s first
              modern mass rapid transit system, developed to reduce severe
              traffic congestion in Dhaka city. The project is part of the
              larger <strong>MRT Line-6</strong>, which connects{" "}
              <strong>Uttara North</strong> to <strong>Motijheel</strong>.
            </p>

            <p>
              The metro rail project was initiated with support from
              international development partners and was designed to provide a
              fast, safe, and environmentally friendly public transportation
              system for millions of daily commuters in Dhaka.
            </p>

            <p>
              The first section of the metro rail became operational in recent
              years, marking a major milestone in Bangladesh&apos;s
              transportation history. Since its launch, it has significantly
              reduced travel time between northern and central Dhaka.
            </p>

            <p>
              Today, Dhaka Metro Rail continues to expand in phases, with
              additional stations and future lines planned to improve
              connectivity across the city. It is now considered one of the most
              reliable and efficient transport systems in Bangladesh.
            </p>

            <p>
              This page provides updated{" "}
              <strong>Dhaka Metro Rail schedule 2026</strong>, including first
              train, last train, weekday timings, Friday schedule, and weekend
              operations.
            </p>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </div>
  );
}
