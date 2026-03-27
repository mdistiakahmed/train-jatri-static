import { Metadata } from "next";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaFacebook,
  FaLinkedin,
  FaMapMarkerAlt,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contact TrainJatri | Connect with Our Railway Support Team",
  description:
    "Get in touch with TrainJatri. We are here to support your Bangladesh Railway travel with accurate schedules, tracking, and expert help.",
};

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <FaEnvelope className="text-[#006fee] text-3xl" />,
      title: "Email Support",
      description: "For schedule questions, feedback, or technical issues",
      contact: "randzyx62@gmail.com",
      type: "email",
    },
    {
      icon: <FaPhoneAlt className="text-[#f06246] text-3xl" />,
      title: "Phone Hotline",
      description: "Talk directly to our support team during business hours",
      contact: "+880 1310599806",
      type: "phone",
    },
  ];

  const socialChannels = [
    {
      icon: <FaFacebook className="text-blue-600 text-3xl" />,
      name: "Facebook",
      handle: "TrainJatri",
      url: "https://facebook.com/trainjatri",
    },
    {
      icon: <FaLinkedin className="text-blue-700 text-3xl" />,
      name: "LinkedIn",
      handle: "TrainJatri",
      url: "https://linkedin.com/company/trainjatri",
    },
  ];

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold  mb-6 relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-40 after:h-1 after:bg-[#006fee]">
            Contact TrainJatri
          </h1>
          <p className="text-xl  max-w-3xl mx-auto mb-4">
            We value every passenger’s journey. Whether you’re planning a trip,
            facing a delay, or simply have a question about train schedules —
            our dedicated support team is here to assist you.
          </p>
          <p className="text-lg  max-w-3xl mx-auto">
            Feel free to reach out via email, phone, or social media. We aim to
            make your railway experience in Bangladesh smoother, smarter, and
            stress-free.
          </p>
        </section>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white shadow-2xl rounded-2xl p-8 transform hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center h-full"
            >
              <div className="mb-6 p-4 bg-gray-100 rounded-full">
                {method.icon}
              </div>
              <h2 className="text-2xl font-semibold  mb-4">{method.title}</h2>
              <p className="mb-6">{method.description}</p>
              <a
                href={
                  method.type === "email"
                    ? `mailto:${method.contact}`
                    : `tel:${method.contact}`
                }
                className="mt-auto bg-gradient-to-r from-[#006fee] to-[#f06246] text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-300 w-full max-w-xs"
              >
                {method.contact}
              </a>
            </div>
          ))}
        </div>

        {/* Social Media */}
        <section className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-40 after:h-1 after:bg-[#006fee]">
            Stay Connected
          </h2>
          <p className="text-xl  mb-12">
            Follow TrainJatri for real-time updates, travel tips, and feature
            announcements.
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {socialChannels.map((channel, index) => (
              <a
                key={index}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300 w-40"
              >
                <div className="mb-4 p-4 bg-gray-100 rounded-full">
                  {channel.icon}
                </div>
                <span className="font-semibold">{channel.name}</span>
                <span className="text-sm">{channel.handle}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Office Info */}
        <section className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <h2
                className="text-2xl font-bold 
               mb-6 pb-4 border-b border-gray-200"
              >
                Official Communication
              </h2>
              <p className="mb-4">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:randzyx62@gmail.com"
                  className="text-[#006fee] hover:underline ml-1"
                >
                  randzyx62@gmail.com
                </a>
              </p>
              <p className="mb-4">
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+8801310599806"
                  className="text-[#f06246] hover:underline ml-1"
                >
                  +880 1310599806
                </a>
              </p>
              <p className="text-sm">
                Support Hours: 9:00 AM – 6:00 PM (GMT+6)
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-200">
                Head Office
              </h2>
              <div className="flex items-start space-x-3 ">
                <FaMapMarkerAlt className="mt-1 text-blue-500 flex-shrink-0" />
                <div>
                  <p>Dhakkin Khan, Dhaka-1229, Bangladesh</p>
                  <p className="text-sm mt-2">Visit by appointment only.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="text-center mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-40 after:h-1 after:bg-[#006fee]">
            We are Here for You
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            At TrainJatri, we believe every train journey should begin with
            confidence. Whether you are navigating routes, tracking arrivals, or
            facing last-minute changes — we’re just a message away.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Our support team is made up of railway data experts, engineers, and
            travel enthusiasts who understand the challenges of train travel in
            Bangladesh. We’re constantly working to improve our tools, answer
            your questions, and keep you on track.
          </p>
          <p className="text-lg leading-relaxed mb-8">
            Your feedback not only helps us grow, but also shapes the way
            millions of travelers move across the country. Don’t hesitate to
            reach out — we’d love to hear from you.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#006fee] hover:bg-[#0053c7] text-white text-lg px-6 py-3 rounded-full transition duration-300"
          >
            Contact Us Now
          </a>
        </section>
      </div>
    </div>
  );
}
