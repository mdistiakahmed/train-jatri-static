import React from "react";
import {
  FaTrain,
  FaMapMarkerAlt,
  FaClock,
  FaInfoCircle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaTrain className="text-red-600 text-2xl" />
              <span className="text-xl font-bold">TrainJatri</span>
              <span className="text-red-500 text-xs">.com</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your complete guide to Bangladesh Railway. Find accurate
              schedules, live tracking, and travel information for all train
              routes across Bangladesh.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://www.facebook.com/train.jatri"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-red-500" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Train Schedule", href: "/trains" },
                { name: "Routes by Station", href: "/station" },
                {
                  name: "Live Tracking",
                  href: "/live-tracking",
                },
                {
                  name: "Book Tickets",
                  href: "https://eticket.railway.gov.bd/",
                  external: true,
                },
                {
                  name: "Thailand Train Schedule",
                  href: "https://www.railthailand.com/",
                  external: true,
                },
              ].map((item) => (
                <li key={item.name}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <a
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FaTrain className="mr-2 text-red-500" />
              Popular Routes
            </h3>
            <ul className="space-y-2">
              {[
                {
                  name: "Narsingdi to Dhaka",
                  slug: "narsingdi#Narsingdi-to-Dhaka",
                },
                { name: "Cumilla to Dhaka", slug: "cumilla#Cumilla-to-Dhaka" },
                {
                  name: "Dhaka to Chattogram",
                  slug: "dhaka#Dhaka-to-Chattogram",
                },
              ].map((route) => (
                <li key={route.slug}>
                  <a
                    href={`/station/${route.slug}`}
                    className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {route.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-red-500" />
              Contact & Info
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <FaClock className="mt-1 mr-2 text-red-500 flex-shrink-0" />
                <span>24/7 Customer Support</span>
              </li>
              <li>
                <p>Email: randzyx62@gmail.com</p>
              </li>
              <li>
                <p>Official BR Hotline: 131</p>
              </li>
              <li>
                <a
                  href="https://railway.portal.gov.bd/sites/default/files/files/railway.portal.gov.bd/page/add42f17_4f9b_40a9_b7ef_e357878fb6ba/Contact%20Details.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300"
                >
                  Bangladesh Railway Contact Informations
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} TrainJatri.com. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="/privacy-policy"
              className="text-sm text-gray-400 hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="/contact"
              className="text-sm text-gray-400 hover:text-white"
            >
              Contact Us
            </a>
            <a
              href="/sitemap.xml"
              className="text-sm text-gray-400 hover:text-white"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
