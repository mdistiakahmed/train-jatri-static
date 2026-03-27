import React from "react";
import Head from "next/head";
import Image from "next/image";

const PlacesToVisitPage = () => {
  const destinations = [
    {
      name: "Sundarbans",
      description:
        "The world's largest mangrove forest, home to the Royal Bengal Tiger.",
      imageUrl: "/sundarbans.jpg", // Replace with your image path
      alt: "Sundarbans Mangrove Forest",
    },
    {
      name: "Cox's Bazar",
      description:
        "The longest natural sea beach in the world, perfect for relaxation and water activities.",
      imageUrl: "/coxsbazar.jpg", // Replace with your image path
      alt: "Cox's Bazar Sea Beach",
    },
    {
      name: "Sreemangal",
      description:
        "Known as the tea capital of Bangladesh, with lush green tea gardens and scenic landscapes.",
      imageUrl: "/sreemangal.jpg", // Replace with your image path
      alt: "Sreemangal Tea Gardens",
    },
    {
      name: "Lalbagh Fort",
      description:
        "A historical Mughal fort in Dhaka, showcasing impressive architecture and history.",
      imageUrl: "/lalbagh.jpg", // Replace with your image path
      alt: "Lalbagh Fort Dhaka",
    },
    {
      name: "Saint Martin's Island",
      description:
        "Bangladesh's only coral island, offering pristine beaches and coral reefs.",
      imageUrl: "/saintmartins.jpg", // Replace with your image path
      alt: "Saint Martin's Island",
    },
    {
      name: "Sonargaon",
      description:
        "An ancient city and historical capital of Bengal, with well-preserved ruins and folk art.",
      imageUrl: "/sonargaon.jpg", //Replace with your image path
      alt: "Sonargaon Historical Site",
    },
  ];

  return (
    <div className="p-6 min-h-screen">
      <Head>
        <title>Places to Visit in Bangladesh - Train Jatri</title>
        <meta
          name="description"
          content="Discover the best tourist destinations in Bangladesh. Explore historical sites, natural wonders, and cultural attractions with Train Jatri."
        />
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Explore Bangladesh: Must-Visit Destinations
        </h1>

        <p className="text-lg text-gray-600 mb-10 text-center">
          Discover the beauty and diversity of Bangladesh with our curated list
          of must-visit destinations. From historical landmarks to natural
          wonders, plan your unforgettable journey with Train Jatri.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <div
              key={destination.name}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={destination.imageUrl}
                alt={destination.alt}
                width={600}
                height={400}
                className="w-full h-60 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  {destination.name}
                </h2>
                <p className="text-gray-600">{destination.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesToVisitPage;
