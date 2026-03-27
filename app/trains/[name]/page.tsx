import React from "react";
import { getDataForTrain } from "@/utils/getData";
import { FaTrain, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import Image from "next/image";
import { uniqueTrainNames } from "@/utils/trainNames";

export async function generateStaticParams() {
  return uniqueTrainNames.map((name: string) => ({
    name: name.split(" ").join("-").toLowerCase(),
  }));
}

export const generateMetadata = async ({ params }: any) => {
  const { name } = await params;
  const trainData = await getDataForTrain(name);

  if (!trainData || !trainData.forward) {
    return {
      title: "Train Details Not Found",
      description: "Train details could not be found.",
    };
  }

  const { forward } = trainData;

  return {
    title: `${forward.train_name}- Route & Schedule`,
    description: `Details of ${forward.train_name}, including route, schedule, and off days. Travels ${forward.path}.`,
    openGraph: {
      title: `${forward.train_name} - Route & Schedule`,
      description: `Details of ${forward.train_name}, including route, schedule, and off days. Travels ${forward.path}.`,
      url: `https://www.trainjatri.com/trains/${name}`,
      siteName: "Train Jatri",
      type: "website",
      images: "/logo.png",
    },
    twitter: {
      card: "summary_large_image",
      title: `${forward.train_name} - Route & Schedule`,
      description: `Details of ${forward.train_name}, including route, schedule, and off days. Travels ${forward.path}.`,
      images: "/logo.png",
    },
  };
};

const Page = async ({ params }: any) => {
  const { name } = await params;
  const trainData = await getDataForTrain(name);

  if (!trainData) {
    return <div>Train data not found.</div>;
  }

  const forward = trainData.forward;
  const reverse = trainData.reverse;

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const banglaDaysOfWeek = [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
  ];
  const shortDaysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getOffDay = (days: string[]) => {
    if (!days) {
      return null;
    }
    const offDayIndex = shortDaysOfWeek.findIndex((day) => !days.includes(day));
    if (offDayIndex !== -1) {
      return `${daysOfWeek[offDayIndex]} (${banglaDaysOfWeek[offDayIndex]})`;
    }
    return "কোন বন্ধের দিন নেই";
  };

  const forwardOffDay = getOffDay(forward?.days);
  const reverseOffDay = getOffDay(reverse?.days);

  const forwardSource = forward?.routes[0].city;
  const forwardDestination = forward?.routes[forward.routes.length - 1].city;
  const forwardDepartureTime = forward?.routes[0].departure_time;
  const forwardArrivalTime =
    forward?.routes[forward.routes.length - 1].arrival_time;
  const forwardHours = forward?.total_duration;

  const reverseSource = reverse?.routes[0].city;
  const reverseDestination = reverse?.routes[reverse.routes.length - 1].city;
  const reverseDepartureTime = reverse?.routes[0].departure_time;
  const reverseArrivalTime =
    reverse?.routes[reverse.routes.length - 1].arrival_time;
  const reverseHours = reverse?.total_duration;

  const generateRouteDescription = (
    routes: any[],
    trainName: string,
    pathName: string,
  ) => {
    let description = `${trainName} departs from ${routes[0].city} at ${routes[0].departure_time}. `;

    for (let i = 1; i < routes.length - 1; i++) {
      description += `Then it arrives in ${routes[i].city}, at ${routes[i].arrival_time} and then departs at ${routes[i].departure_time}. `;
    }

    description += `Finally, it arrives at the destination (${
      routes[routes.length - 1].city
    }) at ${routes[routes.length - 1].arrival_time}.`;

    return (
      <div className="bg-white">
        <h2 className="font-semibold  mb-4 text-center">{pathName}</h2>
        <p className="text-center">{description}</p>
      </div>
    );
  };

  let faqForwardQuestion: any = [];
  let faqReverseQuestion: any = [];

  if (forward != null) {
    faqForwardQuestion = [
      {
        question: `What are the operating days of ${forward.train_name} from ${forward.path}?`,
        answer: `${forward.train_name} operates on ${forward.days.join(
          ", ",
        )} from ${forward.path}.`,
      },
      {
        question: `What is the total duration of the journey for ${forward.train_name} from ${forward.path}?`,
        answer: `The total duration for ${forward.train_name} from ${forward.path} is ${forward.total_duration}.`,
      },
      {
        question: `Where does ${forward.train_name} start and end from ${forward.path}?`,
        answer: `${forward.train_name} starts at ${
          forward.routes[0].city
        } and ends at ${
          forward.routes[forward.routes.length - 1].city
        } that travels from ${forward.path}.`,
      },
      {
        question: `What is the weekly offday for ${forward.train_name} that travels from ${forward.path}?`,
        answer: `The weekly offday for ${forward.train_name} from ${
          forward.path
        } is ${
          forward.days.length < 7
            ? forward.days.reduce(
                (offDay: any, day: any) =>
                  (offDay = [
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                  ].filter((d) => !forward.days.includes(d))[0]),
                "",
              )
            : "No offday"
        }.`,
      },
      ...forward.routes.slice(1).map((route: any) => ({
        question: `When does ${forward.train_name} arrive at ${route.city} that travels from ${forward.path}?`,
        answer: `${forward.train_name} arrives at ${route.city} at ${route.arrival_time} that travels from ${forward.path}.`,
      })),
    ];
  }

  if (reverse != null) {
    faqReverseQuestion = [
      {
        question: `What are the operating days of ${reverse.train_name} that travels from ${reverse.path}?`,
        answer: `${reverse.train_name} operates on ${reverse.days.join(
          ", ",
        )} that travels from ${reverse.path}.`,
      },
      {
        question: `What is the total duration of the journey for ${reverse.train_name} that travels from ${reverse.path}?`,
        answer: `The total duration for ${reverse.train_name} that travels from ${reverse.path} is ${reverse.total_duration}.`,
      },
      {
        question: `Where does ${reverse.train_name} start and end that travels from ${reverse.path}?`,
        answer: `${reverse.train_name} starts at ${
          reverse.routes[0].city
        } and ends at ${
          reverse.routes[reverse.routes.length - 1].city
        } that travels from ${reverse.path}.`,
      },
      {
        question: `What is the weekly offday for ${reverse.train_name} that travels from ${reverse.path}?`,
        answer: `The weekly offday for ${reverse.train_name} that travels from ${
          reverse.path
        } is ${
          reverse.days.length < 7
            ? reverse.days.reduce(
                (offDay: any, day: any) =>
                  (offDay = [
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                  ].filter((d) => !reverse.days.includes(d))[0]),
                "",
              )
            : "No offday"
        }.`,
      },
      ...reverse.routes.slice(1).map((route: any) => ({
        question: `When does ${reverse.train_name} arrive at ${route.city} that travels from ${reverse.path}?`,
        answer: `${reverse.train_name} arrives at ${route.city} at ${route.arrival_time} that travels from ${reverse.path}.`,
      })),
    ];
  }

  const faqData = [...faqForwardQuestion, ...faqReverseQuestion];

  return (
    <div className="min-h-screen">
      <div className="mx-auto p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-8 text-center capitalize flex items-center justify-center">
          <FaTrain className="mr-2" />{" "}
          {forward?.train_name ?? reverse.train_name}
        </h1>

        <div className="mx-auto p-6 text-center">
          {forward && (
            <p className="p-2 border rounded-2xl bg-white">
              {forward.train_name} travels {forward.path} on every day of the
              week except {forwardOffDay}. It departs from {forwardSource} at{" "}
              {forwardDepartureTime.replace(" BST", "")}, and arrives at{" "}
              {forwardDestination} at {forwardArrivalTime.replace(" BST", "")}.
              It takes total {forwardHours}.
            </p>
          )}

          {reverse && (
            <p className="p-2 mt-4 border rounded-2xl bg-white">
              {reverse.train_name} travels {reverse.path} on every day of the
              week except {reverseOffDay}. It departs from {reverseSource} at{" "}
              {reverseDepartureTime.replace(" BST", "")}, and arrives at{" "}
              {reverseDestination} at {reverseArrivalTime.replace(" BST", "")}.
              It takes total {reverseHours}.
            </p>
          )}
        </div>

        <div className="mx-auto p-6 text-center text-xs ">
          <h2 className="font-semibold text-indigo-700 mb-2 text-sm">
            Live track this Train
          </h2>
          <div
            className={`flex gap-2 ${!forward || !reverse ? "justify-center" : "justify-between"}`}
          >
            {forward ? (
              <div className="flex flex-col p-2 border rounded-lg">
                <p className="font-bold italic">{forward.path} </p>
                <p>
                  Type <b>TR {forward.train_number}</b> and send it to{" "}
                  <b>16318</b>.
                </p>
              </div>
            ) : null}

            {reverse ? (
              <div className="flex flex-col p-2 border rounded-lg">
                <p className="font-bold italic">{reverse.path}</p>
                <p>
                  Type <b>TR {reverse.train_number}</b> and send it to{" "}
                  <b>16318</b>.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <Image
          src="/logo.png"
          alt="Bangladesh Railway Train Journey"
          width={400}
          height={200}
          className="mx-auto my-8"
        />

        <div className="flex flex-col">
          {/* Left Side (Forward Route) */}

          {forward ? (
            <div className="mb-8">
              <h2 className="font-semibold mb-4 text-center flex flex-col">
                <span className="text-2xl text-[#046ce6]">{forward.path}</span>
                <span className="text-xl text-[#fe1226]">
                  বন্ধের দিন: {getOffDay(forward.days)}
                </span>
              </h2>

              <div className="w-full overflow-x-auto">
                <table className="min-w-max w-full bg-white rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap text-center">
                        Station
                      </th>
                      <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap text-center">
                        Arrival
                      </th>
                      <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap text-center">
                        Departure
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {forward.routes.map((route: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            {index === 0 ? (
                              <FaMapMarkerAlt className="text-green-600 mr-1 text-lg" />
                            ) : index === forward.routes.length - 1 ? (
                              <FaMapMarkerAlt className="text-red-600 mr-1 text-lg" />
                            ) : (
                              <FaMapMarkerAlt className="text-indigo-600 mr-1" />
                            )}
                            {route.city}
                          </div>
                        </td>
                        <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap text-center">
                          {route.arrival_time
                            ? route.arrival_time.replace(" BST", "")
                            : "-"}
                        </td>
                        <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap text-center">
                          {route.departure_time
                            ? route.departure_time.replace(" BST", "")
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {/* Right Side (Reverse Route) */}
          {reverse ? (
            <div className="">
              <h2 className="text-2xl flex flex-col font-semibold text-indigo-700 mb-4 text-center">
                <span className="text-2xl text-[#046ce6]">{reverse.path}</span>
                <span className="text-xl text-[#fe1226]">
                  বন্ধের দিন: {getOffDay(reverse.days)}
                </span>
              </h2>
              <div className="w-full overflow-x-auto">
                <table className="min-w-max w-full bg-white rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap text-center">
                        Station
                      </th>
                      <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap text-center">
                        Arrival
                      </th>
                      <th className="py-2 px-4 border-b text-xs sm:text-sm whitespace-nowrap text-center">
                        Departure
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reverse.routes.map((route: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            {index === 0 ? (
                              <FaMapMarkerAlt className="text-green-600 mr-1 text-lg" />
                            ) : index === reverse.routes.length - 1 ? (
                              <FaMapMarkerAlt className="text-red-600 mr-1 text-lg" />
                            ) : (
                              <FaMapMarkerAlt className="text-indigo-600 mr-1" />
                            )}
                            {route.city}
                          </div>
                        </td>
                        <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap text-center">
                          {route.arrival_time
                            ? route.arrival_time.replace(" BST", "")
                            : "-"}
                        </td>
                        <td className="py-2 px-4 text-xs sm:text-sm whitespace-nowrap text-center">
                          {route.departure_time
                            ? route.departure_time.replace(" BST", "")
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>

        <Image
          src="/logo.png"
          alt="Bangladesh Railway Train Journey"
          width={400}
          height={200}
          className="mx-auto my-8"
        />

        {forward ? (
          <div className="my-5">
            {generateRouteDescription(
              forward.routes,
              forward.train_name,
              forward.path,
            )}
          </div>
        ) : null}

        {reverse ? (
          <div className="my-5">
            {generateRouteDescription(
              reverse.routes,
              reverse.train_name,
              reverse.path,
            )}
          </div>
        ) : null}

        {/* FAQ Section */}
        <div className="mt-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center border-b pb-2 border-gray-200">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
