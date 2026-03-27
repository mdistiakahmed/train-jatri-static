import React from "react";
import { Metadata } from "next";
import SearchTrainLocation from "@/components/search/SearchTrainLocation";
import { trainDataSummary } from "@/data/trainDataSummary";

interface TrainInfo {
  name: string;
  forwardPath: string;
  forwardTrainNumber: string;
  reversePath: string;
  reverseTrainNumber: string;
}

export const metadata: Metadata = {
  title: "Live Train Tracking Bangladesh | Real-Time Train Status BD",
  description:
    "Track Bangladesh Railway trains live. Get real-time train running status, delay information, and current location updates instantly.",
  keywords: [
    "live train tracking",
    "train location",
    "Bangladesh train",
    "SMS train tracking",
    "train status",
    "train number",
    "train code",
  ],
  openGraph: {
    title: "Live Train Tracking Bangladesh | Real-Time Train Status BD",
    description:
      "Track Bangladesh Railway trains live. Get real-time train running status, delay information, and current location updates instantly.",
    type: "website",
    url: "https://www.trainjatri.com/live-tracking",
    images: "/logo.png",
  },
  twitter: {
    title: "Live Train Tracking Bangladesh | Real-Time Train Status BD",
    description:
      "Track Bangladesh Railway trains live. Get real-time train running status, delay information, and current location updates instantly.",
    images: "/logo.png",
  },
};

const LiveTrackingPage = () => {
  // Sort trains alphabetically by name
  const sortedTrains = [...trainDataSummary].sort((a, b) =>
    a.name.localeCompare(b.name),
  ) as TrainInfo[];

  return (
    <div className="p-4 my-2 mx-auto max-w-7xl ">
      <div className="bg-white md:p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Bangladesh Railway Live Train Tracking
        </h1>

        <p className="mb-4 text-lg text-gray-700">
          Step 1: Search and select the train you want to track.
        </p>
        <p className="mb-4 text-lg text-gray-700">
          Step 2: Send an SMS with the train number (eg:{" "}
          <code className="bg-gray-200 px-2 py-1 rounded mx-1">TR 701</code>) to{" "}
          <code className="bg-gray-200 px-2 py-1 rounded mx-1">16318</code>.
        </p>
        <p className="mb-4 text-lg text-gray-700">
          Step 3: Receive the update SMS with the current location and status of
          the train.
        </p>
      </div>

      <SearchTrainLocation />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          How to Track a Train via SMS
        </h2>

        <div className="bg-gray-100 p-6 rounded-lg">
          <p className="mb-4">To track a train, follow these simple steps:</p>

          <ol className="list-decimal list-inside mb-4">
            <li className="mb-2">
              <strong>Compose a New SMS:</strong> Open the messaging app on your
              mobile device.
            </li>
            <li className="mb-2">
              <strong>Type the Command:</strong> In the message body, type the
              following command:
              <code className="bg-gray-200 px-2 py-1 rounded mx-1">
                TR &lt;Space&gt; train no/train code
              </code>
              Replace <code>train no/train code</code> with the actual train
              number or code.
            </li>
            <li className="mb-2">
              <strong>Send the SMS:</strong> Send the SMS to the following
              number:
              <code className="bg-gray-200 px-2 py-1 rounded mx-1">16318</code>
            </li>
            <li>
              <strong>Receive the Update:</strong> You will receive a response
              SMS with the current location and status of the train.
            </li>
          </ol>

          <p className="mt-4">
            <strong>Example:</strong> To track train number 701, type:
            <code className="bg-gray-200 px-2 py-1 rounded mx-1">TR 701</code>
            and send it to 16318.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Important Notes</h2>

        <ul className="list-disc list-inside">
          <li className="mb-2">
            Ensure that you type the command correctly, with a space between
            &quot;TR&quot; and the train number/code.
          </li>
          <li className="mb-2">Standard SMS charges may apply.</li>
          <li>
            The accuracy of the live tracking information depends on the
            availability of real-time data.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center">
          All Available Trains
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Find your train and track its location by sending an SMS with the
          train number to 16318.
        </p>

        <div className="max-w-3xl mx-auto space-y-4">
          {sortedTrains.map((train, index) => (
            <div
              key={`${train.name}-${index}`}
              className="bg-white p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-3 text-blue-800 capitalize">
                How to Track {train.name}
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {train.forwardPath}:
                  </p>
                  <code className="text-sm font-mono bg-gray-50 p-2 rounded block w-full mt-1">
                    TR {train.forwardTrainNumber} to 16318
                  </code>
                </div>

                {train.reverseTrainNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {train.reversePath}:
                    </p>
                    <code className="text-sm font-mono bg-gray-50 p-2 rounded block w-full mt-1">
                      TR {train.reverseTrainNumber} to 16318
                    </code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LiveTrackingPage;
